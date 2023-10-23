/* eslint-disable */
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import SearchBarJobsFreelancer from "../SearchBarJobsFreelancer";
import { miniSearch } from "src/utils/handleData";
import { AutoComplete } from "antd";

export default function FindWorkFreelancerHome() {
  const { t } = useTranslation(['main']);
  

  return (
    <div className="d-none d-lg-block" >
      <div className="row my-lg-4">
        <div className="col">
          <h4 style={{ fontWeight: '500' }}>{t("FindWork")}</h4>
        </div>
        <div className="col-8">
          <SearchBarJobsFreelancer />
        </div>
        <div className="col"></div>
      </div>
    </div>
  );
}
