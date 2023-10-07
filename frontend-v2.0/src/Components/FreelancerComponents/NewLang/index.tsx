import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function NewLang(props) {
  let [language, setlanguage] = useState("");
  const lang = (e) => {
    language = e.target.value;
    setlanguage(language);
    console.log(language)
  };
  const navigate = useNavigate()
  let [proficiency, setproficiency] = useState("");
  const prof = (e) => {
    proficiency = e.target.value;
    setproficiency(e.target.value);
    console.log(proficiency)
  };
  const add = () => {
    props.toggleAddLang();
    props.addlangToList({ "language": language, "languageAr": language === "Arabic" ? "اللغة العربية" : language === "French" ? "اللغة الفرنسية" : language === "Spanish" ? "اللغة الأسبانية" : "اللغة الهندية", "langProf": proficiency, "langProfAr": proficiency === "proficiency" ? "إجادة اللغة" : proficiency === "Basic" ? "أساسي" : proficiency === "Conversational" ? "محادثة" : proficiency === "Fluent" ? "فصيح" : "اللغة الأم" });
    navigate("/create-profile/hourly-rate")
  }
  return (
    <>
      <p className="fw-bold">Language</p>
      <div className="d-flex ">
        <select
          className="form-select form-select-lg mb-3 shadow-none w-50"
          aria-label=".form-select-lg example"
          onChange={lang}
        >
          <option selected>Select Language</option>
          <option value="Arabic">Arabic</option>
          <option value="French">French</option>
          <option value="Spanish">Spanish</option>
          <option value="Hindi">Hindi</option>
        </select>
        <div className="col-4 mx-auto">
          <i className="fas fa-trash fs-2" onClick={props.toggleAddLang}></i>
        </div>
      </div>

      <p className="fw-bold">Proficiency</p>
      <select
        className="form-select form-select-lg mb-3 shadow-none w-50"
        aria-label=".form-select-lg example"
        onChange={prof}
      >
        <option selected>Select proficiency</option>
        <option value="Basic">Basic</option>
        <option value="Conversational">Conversational</option>
        <option value="Fluent">Fluent</option>
        <option value="Native">Native</option>
      </select>
      <button
        className="btn bg-jobsicker px-5"
        onClick={add}
      >
        Add
      </button>
    </>
  )
}