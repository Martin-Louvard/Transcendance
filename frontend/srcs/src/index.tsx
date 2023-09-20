import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { persistor, store } from './redux/store.ts';
import { PersistGate } from 'redux-persist/integration/react';
import './index.scss'
import { ThemeProvider, createTheme } from '@mui/material';
import App from './App.js';
import './fonts/f25/F25_Bank_Printer_Bold.otf';

const theme = createTheme({
  palette: {
    primary: {
      dark: "006974",
      main: "#FFFFFF",
      light: "#33abb8",
    },
    secondary: {
      dark: "#006974",
      main: '#FFFFFF',
      light: '#33abb8'
    },
    action: {
      disabled: '#FFFFFF',
    }
  },
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  //<React.StrictMode>
    <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </PersistGate>
    </Provider>
  /*</React.StrictMode>*/
)
