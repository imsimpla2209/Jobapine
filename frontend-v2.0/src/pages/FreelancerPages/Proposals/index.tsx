/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ProposalCard from "../../../Components/FreelancerComponents/ProposalCard";
import { getProposals } from "src/api/proposal-apis";
import { useSubscription } from "src/libs/global-state-hook";
import { freelancerStore } from "src/Store/user.store";
import { EStatus } from "src/utils/enum";

export default function Proposals() {

  const { t } = useTranslation(['main']);
  const freelancer = useSubscription(freelancerStore).state
  const [proposals, setProposals] = useState({ active: [], submited: [] });
  const [isFirstLoad, setFirstLoad] = useState(true)

  useEffect(() => {
    if(!!freelancer?._id && isFirstLoad) {
      getProposals({ freelancer: freelancer?._id }).then((res) => {
        setFirstLoad(false);
        const activeProposals = []
        const submitedProposals = []
        res.data.results.map(proposal => {
          if (proposal) {
            if (proposal.currentStatus === EStatus.ACCEPTED) {
              activeProposals.push(proposal);
            } else {
              submitedProposals.push(proposal);
            }
          }
        });
        setProposals({ active: [...activeProposals], submited: [...submitedProposals] });
      }).catch((err) => {
        console.log('cannot load proposals', err)
      })
    }
  }, [freelancer?._id]);

  return (
    <>
      <div className="row justify-content-center">
        <div className="col-md-9 col-12">
          <h3 className="my-5">{t("My proposals")}</h3>
          <div className="list-group-item py-lg-4 mt-3">
            <h4>
              {t("Active proposals")} ({proposals?.active?.length})
              <span className="text-jobsicker ms-2">
                <i className="fas fa-question-circle"></i>
              </span>
            </h4>
          </div>
          <div className="container list-group-item py-lg-4 mb-3">
            {proposals?.active?.map((proposal, index) => (
              <ProposalCard jobId={proposal.job} proposal={proposal} key={index} ind={index} />
            ))}
          </div>
          <div className="list-group-item py-lg-4 mt-3">
            <h4>
              {t("Submited proposals")} ({proposals?.submited?.length})
              <span className="text-jobsicker ms-2">
                <i className="fas fa-question-circle"></i>
              </span>
            </h4>
          </div>
          <div className="container list-group-item py-lg-4 mb-3">
            {proposals?.submited?.map((proposal, index) => (
              <ProposalCard jobId={proposal.job} proposal={proposal} key={index} ind={index} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
