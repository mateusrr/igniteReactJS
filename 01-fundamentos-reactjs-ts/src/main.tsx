import React from 'react' //criação de interfaces
import ReactDOM from 'react-dom/client' //integração com a DOM
import { App } from './App'

/*
vai criar html, css, js dentro da div root

render usar uma sintaxe

componentes do react
semelhantes a tag do html

está renderizando algo interno o arquivo importado App.jsx*/

//o uso de exclamação (!) no final é para dizer ao TS que tal definição
//existe, caso o mesmo reporte algum erro.
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
