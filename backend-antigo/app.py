from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
import os

app = Flask(__name__)

# Liberação total para o app Android não ser bloqueado
CORS(app, resources={r"/*": {"origins": "*"}})

@app.route('/consulta')
def consulta_cnpj():
    cnpj = request.args.get('cnpj')
    
    # Limpa o CNPJ para garantir que a API receba só números
    if cnpj:
        cnpj = ''.join(filter(str.isdigit, cnpj))
    
    if not cnpj:
        return jsonify({"erro": "CNPJ não fornecido"}), 400

    url = f'https://brasilapi.com.br/api/cnpj/v1/{cnpj}'
    
    try:
        r = requests.get(url, timeout=15)
        
        if r.status_code != 200:
            return jsonify({"erro": "CNPJ não encontrado ou API fora do ar"}), r.status_code
        
        data = r.json()

        resultado = {
            "razao_social": data.get("razao_social"),
            "nome_fantasia": data.get("nome_fantasia"),
            "cnpj": data.get("cnpj"),
            "data_abertura": data.get("data_inicio_atividade"),
            "atividade_principal": data.get("cnae_fiscal_descricao"),
            "codigo_atividade_principal": data.get("cnae_fiscal"),
            "atividades_secundarias": data.get("cnaes_secundarios", []),
            "logradouro": data.get("logradouro"),
            "numero": data.get("numero"),
            "cep": data.get("cep"),
            "bairro": data.get("bairro"),
            "municipio": data.get("municipio"),
            "uf": data.get("uf"),
            "capital_social": data.get("capital_social"),
            "socios": data.get("qsa", [])
        }

        return jsonify(resultado)

    except requests.exceptions.RequestException:
        return jsonify({"erro": "Erro na conexão com a API externa"}), 500
    except Exception as e:
        return jsonify({"erro": str(e)}), 500

if __name__ == '__main__':
    # Configuração obrigatória para o Render
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)