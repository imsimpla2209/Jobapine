
import { fakeFreelancerState, fakeJobsState } from "Store/fake-state";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Loader from "../../SharedComponents/Loader/Loader";
import JobCard from "./JobCard";
import "./SectionCenterFreelancerHome.css";


export default function SectionCenterFreelancerHome() {

  const { i18n, t } = useTranslation(['main']);
  let lang = i18n.language;
  const [isliked, setisliked] = useState(false)
  const jobs = fakeJobsState;
  const user = fakeFreelancerState;
  const [switchedJobs, setswitchedJobs] = useState([])

  useEffect(() => {
    setswitchedJobs([...jobs])
  }, [])

  useEffect(() => {

    let tempArr = [];
    // if (switchJobs === "Best Matches") {
    //   jobs.map((e) => e.jobCategory === user.jobCategory && tempArr.push(e))
    //   setswitchedJobs([...tempArr]);
    // }
    // else {
    //   setswitchedJobs([...jobs])
    // };
  }, [jobs, user])



  const saveJob = (e, id) => {
    setisliked(!isliked)
    // if (e.target.className === 'far fa-heart') {
    //   updateUserData("freelancer", { savedJobs: [...user?.savedJobs, id] });
    //   e.target.className = 'fas fa-heart text-jobsicker'
    // }
    // else {
    //   user?.savedJobs?.forEach((item, index) => {
    //     if (item === id) {
    //       user?.savedJobs?.splice(index, 1);
    //       updateUserData("freelancer", { savedJobs: [...user?.savedJobs] });
    //       e.target.className = 'far fa-heart'
    //     }
    //   })
    // }
  }

  return (
    <div className="col-lg-8 col-xs-12">
      {/* <HeadOfCenterSection /> */}
      {
        jobs[0]?.jobID
          ? switchedJobs.map((item, index) => (
            <div key={index}>
              <JobCard item={item} saveJob={saveJob} user={user} lang={lang} />
            </div>
          ))
          : <div className="d-flex justify-content-center align-items-center" style={{ height: "10vh" }}>
            <Loader />
          </div>
      }
    </div >
  );
}