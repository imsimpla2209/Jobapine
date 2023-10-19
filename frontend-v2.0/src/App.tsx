/* eslint-disable react-hooks/exhaustive-deps */
import { Toaster } from 'react-hot-toast';
import { I18nextProvider } from "react-i18next";
import { HashRouter } from "react-router-dom";
import "./App.css";
import { AuthProvider } from "./Components/Providers/AuthProvider";
import LayOut from "./LayOut/LayOut";
import i18n from "./i18n";

function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <I18nextProvider i18n={i18n}>
          <div
            // dir={i18n.language === 'vi' ? "rtl" : "ltr"}
            lang={i18n.language === 'vi' ? 'vi' : "en"}
            style={{ fontFamily: "'Cairo', sans-serif !important" }}>
            <LayOut />
          </div>
          <Toaster />
        </I18nextProvider >
      </AuthProvider>
    </HashRouter>
  );
}

export default App;
