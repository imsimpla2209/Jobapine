/* eslint-disable */
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import SearchBarJobsFreelancer from "../SearchBarJobsFreelancer";


export default function FindWorkFreelancerHome() {
  const { t } = useTranslation(['main']);
  
  const [verify, setverify] = useState(false);
  // firebaseApp.auth().onAuthStateChanged(user => {
  //   if (user) {
  //     var verf = user.emailVerified;
  //     setverify(verf);
  //   }
  // });

  return (
    <div className="d-none d-lg-block" >
      <div className="row my-lg-4">
        <div className="col">
          <h4 style={{fontWeight:'500'}}>{t("FindWork")}</h4>
        </div>
        <div className="col-8">
        <SearchBarJobsFreelancer/>
        </div>
        <div className="col"></div>
      </div>
    </div>
  );
}
