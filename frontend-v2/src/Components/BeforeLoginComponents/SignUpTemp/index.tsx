/* eslint-disable jsx-a11y/alt-text */
import React from "react";
import SignupForm from "../Signup Form";

import SignupLogos from "../Signup logos";

export default function SignUpTemp() {
  return (
    <>
      <div className="container-fluid bg-jobsicker-dark">
        <div className="row">
          <SignupForm />
        </div>
      </div>
      <SignupLogos />
    </>
  );
}
