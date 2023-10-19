/* eslint-disable react-hooks/exhaustive-deps */
import { useParams } from "react-router";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import JobDescriptionJobDetails from "../../../Components/FreelancerComponents/JobDescriptionJobDetails";
import RightSidebarJobDetails from "../../../Components/FreelancerComponents/RightSidebarJobDetails";
import { getJob } from "src/api/job-apis";

export default function JobAppliedDetails() {
  const { id } = useParams();
  const [jobData, setJobData] = useState({});

  useEffect(() => {
    getJob(id).then(res => {
      console.log("load job, ", id);
      setJobData(res.data)
    })
  }, []);
  const { t } = useTranslation(['main']);

  return (
    <div className="container-md container-fluid-sm my-lg-4 my-sm-4 py-xs-5">
      <div className="d-lg-block">
        <div className="row my-lg-4 px-0 mx-0 d-lg-block d-none py-xs-5">
          <h3>{t("Job details")}</h3>
        </div>
        <div className="row ">
          <JobDescriptionJobDetails job={jobData} />
          <RightSidebarJobDetails job={jobData} />
        </div>
      </div>
    </div>
  );
}
