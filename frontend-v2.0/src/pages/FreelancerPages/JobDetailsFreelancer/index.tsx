
import { useParams } from "react-router";
import JobDescriptionJobDetails from "../../../Components/FreelancerComponents/JobDescriptionJobDetails";
import RightSidebarJobDetails from "../../../Components/FreelancerComponents/RightSidebarJobDetails";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { freelancerStore, userStore } from "src/Store/user.store";
import { getJob } from "src/api/job-apis";
import { useSubscription } from "src/libs/global-state-hook";
import AcceptedAlert from "../../../Components/FreelancerComponents/AcceptedAlert";
import Loader from "../../../Components/SharedComponents/Loader/Loader";
import ClientRecentHistory from "src/Components/FreelancerComponents/ClientRecentHistory";
import OtherOpenJobsByThisClient from "src/Components/FreelancerComponents/OtherOpenJobsByThisClient";
import SimilarJobsOnJobSickers from "src/Components/FreelancerComponents/SimilarJobsOnJobSickers";

export default function JobDetailsFreelancer() {
  const { id } = useParams();
  const [jobData, setJobData] = useState(null)
  const freelancer = useSubscription(freelancerStore).state;
  const user = useSubscription(userStore).state;
  useEffect(() => {
    getJob(id).then(res => {
      console.log("load job, ", id);
      setJobData(res.data)
    })
  }, [id])

  const { t } = useTranslation(['main']);

  return (
    <>
      {jobData !== null ?
        <div className="container-md container-fluid-sm my-lg-5 my-sm-4 py-xs-5 px-md-5">
          <div className="d-lg-block">
            <div className="row my-lg-4 px-0 mx-0 d-lg-block d-none py-xs-5 py-2">
              {
                user.isVerified === false &&
                <AcceptedAlert widthh="100%" />
              }
              <h3 className="mt-4">{t("Job details")}</h3>
            </div>
            <div className="row">
              <JobDescriptionJobDetails job={jobData} />
              <RightSidebarJobDetails job={jobData} freelancer={freelancer}/>
            </div>
          </div>
          <div className="row  me-md-1">
            <div className="col-lg-12 col-xs-12">
              <ClientRecentHistory />
              <OtherOpenJobsByThisClient client={jobData?.client}/>
              <SimilarJobsOnJobSickers id={jobData?._id}/>
            </div>
          </div>
        </div>
        :
        <div className="d-flex justify-content-center align-items-center" style={{ height: "90vh" }}>
          <Loader />
        </div>
      }

    </>
  );
}

