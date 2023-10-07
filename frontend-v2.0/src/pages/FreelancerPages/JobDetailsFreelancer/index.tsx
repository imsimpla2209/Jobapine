
import { useParams } from "react-router";
import JobDescriptionJobDetails from "../../../Components/FreelancerComponents/JobDescriptionJobDetails";
import RightSidebarJobDetails from "../../../Components/FreelancerComponents/RightSidebarJobDetails";

import { fakeFreelancerState } from "Store/fake-state";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import AcceptedAlert from "../../../Components/FreelancerComponents/AcceptedAlert";
import Loader from "../../../Components/SharedComponents/Loader/Loader";

export default function JobDetailsFreelancer() {
  const { id } = useParams();
  const [jobData, setJobData] = useState(null)
  const user = fakeFreelancerState;

  useEffect(() => {
    // dispatch(freelancerDataAction());
    // db.collection("job").doc(id).get().then(res => {
    //   setJobData(res.data())
    //   console.log("sasa");
    // })
  }, [])

  const { t } = useTranslation(['main']);

  return (
    <>
      {jobData !== null ?
        <div className="container-md container-fluid-sm my-lg-5 my-sm-4 py-xs-5  px-5">
          <div className="d-lg-block">
            <div className="row my-lg-4 px-0 mx-0 d-lg-block d-none py-xs-5">
              {
                user.accepted === false &&
                <AcceptedAlert widthh="100%" />
              }
              <h3 className="mt-4">{t("Job details")}</h3>
            </div>
            <div className="row">
              <JobDescriptionJobDetails job={jobData} />
              <RightSidebarJobDetails job={jobData} />
            </div>
          </div>
          {/* <div className="row">
            <div className="col-lg-12 col-xs-12"> */}
          {/* <ClientRecentHistory /> */}
          {/* <OtherOpenJobsByThisClient /> */}
          {/* <SimilarJobsOnJobSickers /> */}
          {/* </div>
          </div> */}
        </div>
        :
        <div className="d-flex justify-content-center align-items-center" style={{ height: "90vh" }}>
          <Loader />
        </div>
      }

    </>
  );
}

