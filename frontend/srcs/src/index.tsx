import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.js'
import { Provider } from 'react-redux'
import { persistor, store } from './redux/store.ts';
import { PersistGate } from 'redux-persist/integration/react';
import './index.scss'
import { ThemeProvider, createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      dark: "648dae",
      main: "#90caf9",
      light: "#a6d4fa",
    },
    secondary: {
      dark: "#006974",
      main: '#0097a7',
      light: '#33abb8'
    },
  },
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </PersistGate>
    </Provider>
  </React.StrictMode>,
)
