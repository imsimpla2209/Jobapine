import React from "react";
import ConnectsAndSubmit from "./../ConnectsAndSubmit";
import ClientInfo from "./../ClientInfo";
import JobLink from "./../JobLink";
import { useTranslation } from "react-i18next";
import { Result } from "antd";
import { Link } from "react-router-dom";

export default function RightSidebarJobDetails({ job, freelancer }) {
  const { t } = useTranslation(['main'])
  return (
    <div className="col-lg-3 col-xs-3 d-flex flex-column">
      {
        job?.appliedFreelancers?.includes(freelancer?._id) ? <div>
            <Result
              title={t("You already applied for this Job")}
              extra={
                <Link to={`/proposals`} type="primary" key="console">
                  {t("Review proposal")}
                </Link>
              }
            />
          </div> :
          <ConnectsAndSubmit />
      }
      <ClientInfo client={job?.client} />
      <JobLink id={job?._id} />
    </div>
  );
}
