import React from "react";
import ConnectsAndSubmit from "./../ConnectsAndSubmit";
import ClientInfo from "./../ClientInfo";
import JobLink from "./../JobLink";

export default function RightSidebarJobDetails({ job }) {
  return (
    <div className="col-lg-3 col-xs-3 d-flex flex-column">
      <ConnectsAndSubmit />
      <ClientInfo clientID={job?.authID} />
      <JobLink />
    </div>
  );
}
