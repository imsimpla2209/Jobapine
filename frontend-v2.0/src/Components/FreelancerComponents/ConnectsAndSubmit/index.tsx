/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { freelancerStore, userStore } from "src/Store/user.store";
import { useSubscription } from "src/libs/global-state-hook";

export default function ConnectsAndSubmit() {
  const { t } = useTranslation(['main']);
  const { id } = useParams();
  const freelancer = useSubscription(freelancerStore).state;
  const user = useSubscription(userStore).state;
  // let [text, setText] = useState("");
  let [proposal, setProposal] = useState("");
  const [jobProposal, setjobProposal] = useState(false);
  const navigate = useNavigate();
  const [isliked, setisliked] = useState(false)

  useEffect(() => {
    // db.collection("freelancer")
    //   .doc(auth.currentUser.uid)
    //   .collection("jobProposal")
    //   .where("jobId", "==", id)
    //   .onSnapshot((res) => {
    //     if (res?.docs.length > 0) setjobProposal(true);
    //   });
  }, []);

  useEffect(() => {
    // dispatch(jobsDataAction());
    // dispatch(freelancerDataAction())
  }, [isliked])
  const saveJob = (e) => {
    setisliked(!isliked)
    // if (e.target.className === 'far fa-heart') {
    //   updateUserData("freelancer", { savedJobs: [...freelancer?.savedJobs, id] });
    //   e.target.className = 'fas fa-heart text-jobsicker'

    // }
    // else {
    //   user?.savedJobs?.forEach((item, index) => {
    //     if (item === id) {
    //       user?.savedJobs?.splice(index, 1);
    //       updateUserData("freelancer", { savedJobs: [...freelancer?.savedJobs] });
    //       e.target.className = 'far fa-heart'

    //     }
    //   })
    // }
  }





  const handlewithdrawProposal = async () => {
    try {
      // await db
      //   .collection("job")
      //   .doc(id)
      //   .collection("proposals")
      //   .where("freelancerId", "==", auth.currentUser.uid)
      //   .get()
      //   .then((res) =>
      //     res.docs.map((e) => {
      //       proposal = e.id;
      //       setProposal(proposal);
      //       db.collection("job")
      //         .doc(id)
      //         .collection("proposals")
      //         .doc(proposal)
      //         .delete();
      //       console.log(proposal);
      //     })
      //   );
      // await db
      //   .collection("freelancer")
      //   .doc(auth.currentUser.uid)
      //   .collection("jobProposal")
      //   .where("jobId", "==", id)
      //   .get()
      //   .then((res) =>
      //     res.docs.map((e) => {
      //       freelancer = e.id;
      //       setFreelancer(freelancer);
      //       db.collection("freelancer")
      //         .doc(auth.currentUser.uid)
      //         .collection("jobProposal")
      //         .doc(freelancer)
      //         .delete();
      //       console.log(freelancer);
      //     })
      //   );
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="bg-white py-lg-4 px-4 border border-1 py-sm-3">
      <div className="d-lg-grid gap-2  mx-auto d-none">
        {!jobProposal ? (
          <button
            className="btn bg-jobsicker"
            onClick={(handleRout) => navigate(`/job/apply/${id}`)}
            disabled={user.isVerified === false || user.sickPoints < 2}
          >
            {t("Submit a proposal")}
          </button>
        ) : (
          <button
            className="btn bg-jobsicker-dark"
            onClick={handlewithdrawProposal}
          >
            {t("Withdraw")}
          </button>
        )}

        <button
          className="btn btn-light border border-1 my-lg-2"
          type="button"
        >
          <i
            onClick={(e) => saveJob(e)}
            className={`${freelancer?.favoriteJobs?.includes(id) ? 'fas fa-heart text-jobsicker' : 'far fa-heart'}`}
            aria-hidden="true"
          />
          {/* {text} */}
        </button>

      </div>
      <p>
        {t("Required Connects to submit a proposal")}: 2
      </p>
      <p>
        {t("Available Connects")}: {user.sickPoints}
      </p>
    </div>
  );
}