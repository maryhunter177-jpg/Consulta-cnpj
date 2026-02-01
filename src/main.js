document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('cnpj-form')
  const input = document.getElementById('cnpj-input')
  const btnPesquisar = form.querySelector('button')
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
    const cnpj = input.value.replace(/\D/g, '')

    if (cnpj.length !== 14) {
      alert('Por favor, digite um CNPJ válido com 14 dígitos.')
      return
    }

    btnPesquisar.innerText = 'Buscando...'
    btnPesquisar.disabled = true

    try {
      // URL definitiva do seu backend no Render
      const urlServidor = `https://consulta-cnpj-jpyl.onrender.com/consulta?cnpj=${cnpj}`
      
      const resposta = await fetch(urlServidor, {
        method: 'GET',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' }
      })
      
      if (!resposta.ok) {
        throw new Error(`Erro no servidor: ${resposta.status}`)
      }

      const dados = await resposta.json()

      if (dados.erro) {
        alert(`Aviso: ${dados.erro}`)
        return
      }

      // Preenchimento dos dados na tela
      document.getElementById('razao_social').innerText = dados.razao_social || '-'
      document.getElementById('nome_fantasia').innerText = dados.nome_fantasia || '-'
      document.getElementById('cnpj').innerText = dados.cnpj || '-'
      document.getElementById('abertura').innerText = dados.data_abertura || '-'
      document.getElementById('atividade').innerText = dados.atividade_principal || '-'

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

      const tabelaAtv = document.getElementById('atividade_table')
      tabelaAtv.innerHTML = '<tr><th>Código</th><th>Descrição</th></tr>'
      tabelaAtv.innerHTML += `<tr><td>${dados.codigo_atividade_principal || '-'}</td><td>${dados.atividade_principal || '-'}</td></tr>`

      if (dados.atividades_secundarias && dados.atividades_secundarias.length > 0) {
        dados.atividades_secundarias.forEach((atv) => {
          tabelaAtv.innerHTML += `<tr><td>${atv.code || atv.codigo || '-'}</td><td>${atv.text || atv.descricao || '-'}</td></tr>`
        })
      }

      const tabelaSocios = document.getElementById('socios_table')
      tabelaSocios.innerHTML = '<tr><th>Nome</th><th>Cargo</th></tr>'
      if (dados.socios && dados.socios.length > 0) {
        dados.socios.forEach((socio) => {
          tabelaSocios.innerHTML += `<tr><td>${socio.nome || socio.nome_socio || '-'}</td><td>${socio.qual || socio.qualificacao_socio || '-'}</td></tr>`
        })
      }
      
    } catch (err) {
      console.error('Erro detalhado:', err)
      alert('Erro ao consultar! O servidor pode estar "acordando". Tente novamente em breve.')
    } finally {
      btnPesquisar.innerText = 'Pesquisar'
      btnPesquisar.disabled = false
    }
  })
})