/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from "react";
import { useTranslation } from "react-i18next";
import ProposalCard from "../../../Components/FreelancerComponents/ProposalCard";

export default function Proposals() {

  const { t } = useTranslation(['main']);
  const [freelancerData, setFreelancerData] = useState({ active: [], submited: [] });

  // useEffect(async () => {
  //   await db.collection("freelancer")
  //     .doc(auth.currentUser.uid)
  //     .collection("jobProposal")
  //     .get()
  //     .then(res => {
  //       res.docs.map(proposal => {
  //         if (proposal.exists) {
  //           if (proposal.data().status === "contract") {
  //             freelancerData.active.push(proposal.data());
  //           } else {
  //             freelancerData.submited.push(proposal.data());
  //           }
  //         }
  //       });
  //       setFreelancerData({ active: [...freelancerData.active], submited: [...freelancerData.submited] });
  //     });
  //   console.log(freelancerData);
  // }, []);

  return (
    <>
      <div className="row justify-content-center">
        <div className="col-9">
          <h3 className="my-5">{t("My proposals")}</h3>
          <div className="list-group-item py-lg-4 mt-3">
            <h4>
              {t("Active proposals")} ({freelancerData?.active?.length})
              <span className="text-jobsicker ms-2">
                <i className="fas fa-question-circle"></i>
              </span>
            </h4>
          </div>
          <div className="container list-group-item py-lg-4 mb-3">
            {freelancerData?.active?.map((proposal, index) => (
              <ProposalCard jobId={proposal.jobId} proposal={proposal} key={index} ind={index} />
            ))}
          </div>
          <div className="list-group-item py-lg-4 mt-3">
            <h4>
              {t("Submited proposals")} ({freelancerData?.submited?.length})
              <span className="text-jobsicker ms-2">
                <i className="fas fa-question-circle"></i>
              </span>
            </h4>
          </div>
          <div className="container list-group-item py-lg-4 mb-3">
            {freelancerData?.submited?.map((proposal, index) => (
              <ProposalCard jobId={proposal.jobId} proposal={proposal} key={index} ind={index} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
