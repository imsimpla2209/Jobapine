import React, { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

export default function JobLink({ id }) {
  let his = useNavigate()

  const [state, setstate] = useState({
    value: `http://localhost:6969/job/${id}`,
    copied: false,
  });

  const { t } = useTranslation(['main']);

  return (
    <div className="bg-white pb-lg-2 px-4 border border-1 py-xs-5 h-100">
      <h5 className="py-lg-2">{t("Job link")}</h5>
      <input
        // onInput={({ target: { value } }) => setstate({ value, copied: false })}
        className="form-control my-3"
        type="text"
        defaultValue={state.value}
        aria-label="Disabled input example"
        disabled
      />

      <CopyToClipboard
        text={state.value}
        onCopy={() => toast(`${t("Copy Link")}`, { position: 'bottom-right'})}
      >
        <button className="fw-bold py-1 my-3 cursor-pointer bg-white border border-0 a" style={{ color: '#6600cc'}}>
          {t("Copy Link")}
        </button>
      </CopyToClipboard>
    </div>
  );
}
