
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { getJobs } from "src/api/job-apis";
import Loader from "../../SharedComponents/Loader/Loader";
import JobCard from "./JobCard";
import "./SectionCenterFreelancerHome.css";


export default function SectionCenterFreelancerHome({ user }) {

  const { i18n, t } = useTranslation(['main']);
  const lang = i18n.language;
  const [isliked, setisliked] = useState(false)
  const [switchedJobs, setswitchedJobs] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true);
    getJobs({}).then(res => {
      setswitchedJobs(res.data.results)
      setLoading(false)
    }).catch(err => {
      toast.error('something went wrong, ', err)
      setLoading(false)
    })
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
  }, [])



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
        !loading
          ? switchedJobs.map((item, index) => (
            <div key={index}>
              <JobCard item={item} saveJob={saveJob} freelancer={user} lang={lang} />
            </div>
          ))
          : <div className="d-flex justify-content-center align-items-center" style={{ height: "10vh" }}>
            <Loader />
          </div>
      }
    </div >
  );
}