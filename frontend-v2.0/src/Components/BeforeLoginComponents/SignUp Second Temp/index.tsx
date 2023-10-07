/* eslint-disable jsx-a11y/alt-text */
import React from "react";

import SignUpSecondForm from "../Signup Second Form";
import SignupLogos from "../Signup logos";

export default function SignUpSecondTemp() {
  return (
    <>
      <div className="container-fluid bg-jobsicker-dark">
        <div className="row">
          <SignUpSecondForm />
        </div>
      </div>
      <SignupLogos />
    </>
  );
}
