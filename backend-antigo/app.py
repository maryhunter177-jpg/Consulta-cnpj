from flask import Flask, jsonify, request
from flask_cors import CORS
import requests

app = Flask(__name__)
# Libera o acesso para que seu site consiga consultar o servidor
CORS(app)

@app.route('/consulta')
def consulta_cnpj():
    cnpj = request.args.get('cnpj')
    
    if not cnpj:
        return jsonify({"erro": "CNPJ não fornecido"}), 400

    url = f'https://brasilapi.com.br/api/cnpj/v1/{cnpj}'
    
    try:
        # Faz a requisição para a BrasilAPI
        r = requests.get(url, timeout=10)
        
        if r.status_code != 200:
            return jsonify({"erro": "CNPJ não encontrado ou API fora do ar"}), r.status_code
        
        data = r.json()

        # Monta a resposta exatamente como o seu main.js espera
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

    except requests.exceptions.RequestException as e:
        return jsonify({"erro": "Erro na conexão com a API externa"}), 500
    except Exception as e:
        return jsonify({"erro": str(e)}), 500

if __name__ == '__main__':
    # O Gunicorn usará o "app", mas isso aqui serve para testes locais
    app.run(debug=True)