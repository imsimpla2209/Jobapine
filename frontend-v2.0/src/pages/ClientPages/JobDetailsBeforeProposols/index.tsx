
import { useParams } from "react-router";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ClientJobDetails from "src/Components/ClientComponents/ClientJobDetails";
import SimilarJobsOnJobSickers from "src/Components/FreelancerComponents/SimilarJobsOnJobSickers";
import { clientStore, userStore } from "src/Store/user.store";
import { getJob } from "src/api/job-apis";
import { useSubscription } from "src/libs/global-state-hook";
import Loader from "../../../Components/SharedComponents/Loader/Loader";

export default function JobDetailsBeforeProposals() {
  const { id } = useParams();
  const [jobData, setJobData] = useState(null)
  const client = useSubscription(clientStore).state;
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
                (client.id || client?._id) === jobData?.client?._id &&
                <div style={{ padding: 3, border: '1px solid #ccc', borderRadius: 8}}>{t("You can update your job directly here")}</div>
              }
              <h3 className="mt-4">{t("Job details")}</h3>
            </div>
            <div className="row">
              <ClientJobDetails job={jobData} />
              {/* <RightSidebarJobDetails job={jobData} freelancer={freelancer}/> */}
            </div>
          </div>
          <div className="row  me-md-1">
            <div className="col-lg-12 col-xs-12">
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

