/* eslint-disable react-hooks/exhaustive-deps */
import { Toaster } from 'react-hot-toast';
import { I18nextProvider } from "react-i18next";
import { HashRouter } from "react-router-dom";
import "./App.css";
import { AuthProvider } from "./Components/Providers/AuthProvider";
import LayOut from "./LayOut/LayOut";
import i18n from "./i18n";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { PAYPAL_CLIENT_ID } from './api/constants';
import { SocketProvider } from './socket.io';

function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <SocketProvider>
          <I18nextProvider i18n={i18n}>
            <PayPalScriptProvider options={{ clientId: PAYPAL_CLIENT_ID }}>
              <div
                // dir={i18n.language === 'vi' ? "rtl" : "ltr"}
                lang={i18n.language === 'vi' ? 'vi' : "en"}
                >
                <LayOut />
              </div>
              <Toaster />
            </PayPalScriptProvider>

          </I18nextProvider >
        </SocketProvider>
      </AuthProvider>
    </HashRouter>
  );
}

export default App;
