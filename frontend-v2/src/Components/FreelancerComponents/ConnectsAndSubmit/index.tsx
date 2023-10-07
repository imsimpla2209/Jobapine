/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { fakeFreelancerState } from "Store/fake-state";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { updateUserData } from "../../../Network/Network";

export default function ConnectsAndSubmit() {
  const { t } = useTranslation(['main']);
  const { id } = useParams();
  const user = fakeFreelancerState;
  // let [text, setText] = useState("");
  let [proposal, setProposal] = useState("");
  let [freelancer, setFreelancer] = useState("");
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
    if (e.target.className === 'far fa-heart') {
      updateUserData("freelancer", { savedJobs: [...user?.savedJobs, id] });
      e.target.className = 'fas fa-heart text-jobsicker'

    }
    else {
      user?.savedJobs?.forEach((item, index) => {
        if (item === id) {
          user?.savedJobs?.splice(index, 1);
          updateUserData("freelancer", { savedJobs: [...user?.savedJobs] });
          e.target.className = 'far fa-heart'

        }
      })
    }
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
            disabled={user.accepted === false || user.connects < 2}
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
            className={`${user?.savedJobs?.includes(id) ? 'fas fa-heart text-jobsicker' : 'far fa-heart'}`}
            aria-hidden="true"
          />
          {/* {text} */}
        </button>

      </div>
      <p>
        {t("Required Connects to submit a proposal")}: 2
      </p>
      <p>
        {t("Available Connects")}: {user.connects}
      </p>
    </div>
  );
}