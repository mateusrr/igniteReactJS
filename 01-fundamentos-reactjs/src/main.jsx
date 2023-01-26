import React from 'react' //criação de interfaces
import ReactDOM from 'react-dom/client' //integração com a DOM
import { App } from './App'

/*
vai criar html, css, js dentro da div root

render usar uma sintaxe

componentes do react
semelhantes a tag do html

está renderizando algo interno o arquivo importado App.jsx*/

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
