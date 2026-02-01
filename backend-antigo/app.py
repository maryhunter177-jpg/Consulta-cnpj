from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
import os

app = Flask(__name__)
# Liberação total do CORS para o aplicativo Android
CORS(app, resources={r"/*": {"origins": "*"}})

@app.route('/')
def home():
    return jsonify({"status": "online", "use": "/consulta?cnpj=11045297000235"})

@app.route('/consulta')
def consulta_cnpj():
    cnpj = request.args.get('cnpj', '').strip()
    # Limpa caracteres não numéricos
    cnpj = ''.join(filter(str.isdigit, cnpj))
        
    if len(cnpj) != 14:
        return jsonify({"erro": "CNPJ deve ter 14 dígitos"}), 400

    url = f'https://brasilapi.com.br/api/cnpj/v1/{cnpj}'
        
    try:
        r = requests.get(url, timeout=30)
                
        if r.status_code != 200:
            return jsonify({"erro": f"CNPJ não encontrado ({r.status_code})"}), 404
            
        data = r.json()
                
        # SUA CORREÇÃO AQUI: Estrutura segura para Atividade Principal
        atividade = data.get("atividade_principal", {})
        
        resultado = {
            "razao_social": data.get("razao_social", "-"),
            "nome_fantasia": data.get("fantasia", "-"), 
            "cnpj": data.get("cnpj", "-"),
            "data_abertura": data.get("data_inicio_atividade", "-"),
            "atividade_principal": atividade.get("text", "-") if isinstance(atividade, dict) else "-",
            "codigo_atividade_principal": atividade.get("code", "-") if isinstance(atividade, dict) else "-",
            "atividades_secundarias": data.get("atividades_secundarias", []),
            "logradouro": data.get("logradouro", "-"),
            "numero": data.get("numero", "-"),
            "cep": data.get("cep", "-"),
            "bairro": data.get("bairro", "-"),
            "municipio": data.get("municipio", "-"),
            "uf": data.get("uf", "-"),
            "capital_social": data.get("capital_social", "-"),
            "socios": data.get("qsa", [])
        }
        return jsonify(resultado)
    except Exception as e:
        return jsonify({"erro": f"Erro: {str(e)}"}), 500

if __name__ == '__main__':
    # Porta dinâmica para o Render
    port = int(os.environ.get("PORT", 10000))
    app.run(host='0.0.0.0', port=port)