import { createRoot } from 'react-dom/client'
import './App.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import store from './Admin/ReduxToolkit/store.js'
import { ToastProvider } from './Admin/Toast/ToastProvider.jsx'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
  <ToastProvider>
    <App />
  </ToastProvider>
  </Provider>
)
