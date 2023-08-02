import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.js'
import { Provider } from 'react-redux'
import { persistor, store } from './store.ts';
import { PersistGate } from 'redux-persist/integration/react';
import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
    </Provider>
  </React.StrictMode>,
)