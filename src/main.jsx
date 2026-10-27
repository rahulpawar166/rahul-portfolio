import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ChoreQuestPage from './ChoreQuestPage.jsx'

const isChoreQuestPage = /^\/chorequest(?:\/|$)/.test(window.location.pathname)


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {isChoreQuestPage ? <ChoreQuestPage /> : <App />}
  </React.StrictMode>
)