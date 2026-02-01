<template>
  <div class="p-4 max-w-xl mx-auto">
    <h1 class="text-2xl font-bold mb-4">Consulta de CNPJ</h1>
    
    <input 
      v-model="cnpjFormatado" 
      @input="formatarCnpj" 
      placeholder="Digite o CNPJ" 
      class="border p-2 w-full mb-2"
      maxlength="18"
    />
    <button 
      @click="consultarCnpj" 
      class="bg-blue-500 text-white p-2 w-full mb-4"
    >
      Pesquisar
    </button>

    <div v-if="resultado" class="bg-gray-100 p-4 rounded shadow">
      <h2 class="text-xl font-semibold mb-2">Informações da Empresa</h2>
      <p><strong>Razão Social:</strong> {{ resultado.razao_social }}</p>
      <p><strong>Nome Fantasia:</strong> {{ resultado.nome_fantasia || '-' }}</p>
      <p><strong>UF:</strong> {{ resultado.uf }}</p>
      <p><strong>Município:</strong> {{ resultado.municipio }}</p>
      <p><strong>Capital Social:</strong> R$ {{ resultado.capital_social.toLocaleString() }}</p>
      <p><strong>Natureza Jurídica:</strong> {{ resultado.natureza_juridica }}</p>
      <p><strong>Situação Cadastral:</strong> {{ resultado.descricao_situacao_cadastral }}</p>

      <div v-if="resultado.qsa.length">
        <h3 class="mt-4 font-semibold">Sócios</h3>
        <ul class="list-disc ml-5">
          <li v-for="(socio, index) in resultado.qsa" :key="index">
            {{ socio.nome_socio }} - {{ socio.qualificacao_socio }}
          </li>
        </ul>
      </div>
    </div>

    <div v-else-if="erro" class="text-red-500">
      {{ erro }}
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      cnpjFormatado: "",  // input com formatação
      resultado: null,
      erro: null,
    };
  },
  methods: {
    formatarCnpj() {
      // remove tudo que não é número
      let cnpj = this.cnpjFormatado.replace(/\D/g, "");

      // aplica máscara: 00.000.000/0000-00
      if (cnpj.length > 2) cnpj = cnpj.replace(/^(\d{2})(\d)/, "$1.$2");
      if (cnpj.length > 5) cnpj = cnpj.replace(/^(\d{2}\.\d{3})(\d)/, "$1.$2");
      if (cnpj.length > 8) cnpj = cnpj.replace(/^(\d{2}\.\d{3}\.\d{3})(\d)/, "$1/$2");
      if (cnpj.length > 12) cnpj = cnpj.replace(/^(\d{2}\.\d{3}\.\d{3}\/\d{4})(\d)/, "$1-$2");

      this.cnpjFormatado = cnpj;
    },
    async consultarCnpj() {
      this.resultado = null;
      this.erro = null;

      // remove máscara antes de enviar para a API
      const cnpjNumeros = this.cnpjFormatado.replace(/\D/g, "");

      try {
        const response = await axios.get(
          `https://brasilapi.com.br/api/cnpj/v1/${cnpjNumeros}`
        );
        this.resultado = response.data;
      } catch (error) {
        this.erro = "CNPJ inválido ou não encontrado.";
      }
    },
  },
};
</script>