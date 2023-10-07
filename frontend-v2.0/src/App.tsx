/* eslint-disable react-hooks/exhaustive-deps */
import i18n from "./i18n";
import { I18nextProvider } from "react-i18next";
import { BrowserRouter } from "react-router-dom";
import "./App.css";
import LayOut from "./LayOut/LayOut";


function App() {
  return (
    <BrowserRouter>
      <I18nextProvider i18n={i18n}>
        <div
          // dir={i18n.language === 'vi' ? "rtl" : "ltr"}
          lang={i18n.language === 'vi' ? 'vi' : "en"}
          style={{ fontFamily: "'Cairo', sans-serif !important" }}>
          <LayOut />
        </div>
      </I18nextProvider >
    </BrowserRouter>
  );
}

export default App;