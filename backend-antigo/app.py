from flask import Flask, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

@app.route('/consulta')
def consulta_cnpj():
    from flask import request
    cnpj = request.args.get('cnpj')
    url = f'https://brasilapi.com.br/api/cnpj/v1/{cnpj}'
    try:
        r = requests.get(url, timeout=10)
        if r.status_code != 200:
            return jsonify({"erro": "CNPJ não encontrado"}), 404
        data = r.json()

        # Prepara dados pro frontend
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
    except Exception as e:
        return jsonify({"erro": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
from flask import Flask, jsonify
from flask_cors import CORS
import requests