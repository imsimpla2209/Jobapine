/* eslint-disable react-hooks/exhaustive-deps */
import { fakeFreelancerState } from "Store/fake-state";
import { useEffect, useState } from "react";
import SavedJobsHeader from "./../../../Components/FreelancerComponents/SavedJobsHeader";
import SavedJobsJobComponent from "./../../../Components/FreelancerComponents/SavedJobsJobComponent";
import Loader from './../../../Components/SharedComponents/Loader/Loader';

export default function SavedJobs() {

  const user = fakeFreelancerState;
  const [isliked, setisliked] = useState(false)
  useEffect(() => {
    // dispatch(freelancerDataAction());
  }, [isliked, user.savedJobs]);

  return (
    <div className="container-md container-fluid-sm my-lg-4">
      <div className="col-12">
        <SavedJobsHeader jobs={user?.savedJobs?.length} />
        {
          user?.savedJobs ?
            user?.savedJobs?.map((item) => (
              <SavedJobsJobComponent jobId={item} key={item} isliked={isliked} setisliked={setisliked} />
            ))
            :
            <div className="d-flex justify-content-center align-items-center" style={{ height: "70vh" }}>
              <Loader />
              <p className="h3">No saved jobs.</p>
            </div>
        }
      </div>
    </div>
  );
}