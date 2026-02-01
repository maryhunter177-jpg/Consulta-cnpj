document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('cnpj-form')
  const input = document.getElementById('cnpj-input')
  const abas = document.querySelectorAll('.tab')
  const conteudos = document.querySelectorAll('.tab-content')

  // Alterna abas
  abas.forEach((aba, idx) => {
    aba.addEventListener('click', () => {
      abas.forEach((a) => a.classList.remove('active'))
      conteudos.forEach((c) => c.classList.remove('active'))
      aba.classList.add('active')
      conteudos[idx].classList.add('active')
    })
  })

  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    // Limpa o CNPJ para enviar apenas números
    const cnpj = input.value.replace(/\D/g, '')

    try {
      // ATUALIZADO: Usando o servidor oficial no Render em vez do localhost
      const resposta = await fetch(`https://consulta-cnpj-jpyl.onrender.com/consulta?cnpj=${cnpj}`)
      
      if (!resposta.ok) {
        throw new Error('Erro na requisição ao servidor')
      }

      const dados = await resposta.json()

      if (dados.erro) {
        alert(dados.erro)
        return
      }

      // Preenchimento das Informações Principais
      document.getElementById('razao_social').innerText = dados.razao_social || '-'
      document.getElementById('nome_fantasia').innerText = dados.nome_fantasia || '-'
      document.getElementById('cnpj').innerText = dados.cnpj || '-'
      document.getElementById('abertura').innerText = dados.data_abertura || '-'
      document.getElementById('atividade').innerText = dados.atividade_principal || '-'

      // Detalhes da Tabela de Informações
      document.getElementById('info_razao').innerText = dados.razao_social || '-'
      document.getElementById('info_abertura').innerText = dados.data_abertura || '-'
      document.getElementById('info_cnpj').innerText = dados.cnpj || '-'
      document.getElementById('info_logradouro').innerText = dados.logradouro || '-'
      document.getElementById('info_numero').innerText = dados.numero || '-'
      document.getElementById('info_cep').innerText = dados.cep || '-'
      document.getElementById('info_bairro').innerText = dados.bairro || '-'
      document.getElementById('info_municipio').innerText = dados.municipio || '-'
      document.getElementById('info_uf').innerText = dados.uf || '-'
      document.getElementById('info_capital').innerText = dados.capital_social || '-'

      // Atividade econômica
      const tabelaAtv = document.getElementById('atividade_table')
      tabelaAtv.innerHTML = '<tr><th>Código</th><th>Descrição</th></tr>'

      // Principal
      tabelaAtv.innerHTML += `<tr><td>${dados.codigo_atividade_principal || '-'}</td><td>${dados.atividade_principal || '-'}</td></tr>`

      // Secundárias
      if (dados.atividades_secundarias && dados.atividades_secundarias.length > 0) {
        dados.atividades_secundarias.forEach((atv) => {
          tabelaAtv.innerHTML += `<tr><td>${atv.codigo}</td><td>${atv.descricao}</td></tr>`
        })
      }

      // Sócios
      const tabelaSocios = document.getElementById('socios_table')
      tabelaSocios.innerHTML = '<tr><th>Nome</th><th>CPF/CNPJ</th></tr>'
      if (dados.socios && dados.socios.length > 0) {
        dados.socios.forEach((socio) => {
          tabelaSocios.innerHTML += `<tr><td>${socio.nome_socio || '-'}</td><td>${socio.cnpj_cpf_do_socio || '-'}</td></tr>`
        })
      }
    } catch (err) {
      console.error('Erro detalhado:', err)
      alert('Erro ao consultar CNPJ! Verifique sua conexão com a internet.')
    }
  })
})