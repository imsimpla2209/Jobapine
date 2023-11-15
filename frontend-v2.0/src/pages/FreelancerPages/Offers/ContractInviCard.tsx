/* eslint-disable react-hooks/exhaustive-deps */
import { Popconfirm } from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ProposalCard from 'src/Components/FreelancerComponents/ProposalCard';
import { acceptContract, getContract, rejectContract } from 'src/api/contract-apis';
import { getProposal } from 'src/api/proposal-apis';
import { EStatus } from 'src/utils/enum';
import { currencyFormatter, pickName } from 'src/utils/helperFuncs';

export default function ContractInviCard({ invitation, getOffers }) {
  const [decide, setDecide] = useState<any>();
  const [contract, setContract] = useState<any>();
  const [proposal, setProposal] = useState();
  const { t, i18n } = useTranslation(['main'])

  useEffect(() => {
    getContract(invitation.content?.contractID).then(res => {
      setContract(res.data);
    })
    getProposal(invitation.content?.proposal).then(res => {
      setProposal(res.data);
    })
  }, [invitation])

  const accept = () => {
    if (contract?._id && invitation?._id) {
      acceptContract(contract?._id, invitation?._id).then(() => {
        return setDecide(EStatus.ACCEPTED);
      })
    }
  }

  const decline = () => {
    if (contract?._id && invitation?._id) {
      rejectContract(contract?._id, invitation?._id).then(() => {
        return setDecide(EStatus.REJECTED);
      })
    }
  }


  return (

    <div className="col-11 mx-auto bg-gray border border-gray rounded p-5 mb-4 text-center">
      {
        (invitation && contract) &&
        <>
          <p><strong>{t("Contract")} {t("Title")}: </strong>{invitation?.content?.job?.title}</p>
          <p><strong>{t("Invitation")} {t("Description")}: </strong>{pickName(invitation?.content?.content, i18n.language)}</p>
          <p><strong>{t("Contract")} {t("Budget")}: </strong>{currencyFormatter(invitation?.content?.job?.budget)}</p>
          <p><strong>{t("Contract")} Payment Type: </strong>{t(`${invitation?.content?.job?.payment?.type}`)}</p>
          <p><strong>{t("Agree Amount")}: </strong>{t(`${currencyFormatter(contract?.agreeAmount)}`)}</p>
          <p><strong>{t("Contract")} {t("End date")}: </strong>{new Date(invitation?.dueDate).toLocaleString()}</p>

          <div style={{ padding: 8, border: '1px solid', borderRadius: 8, marginBottom: 8, background: 'white' }}>
            <ProposalCard proposal={proposal} jobId={invitation?.content?.job?._id} ind={1} isInMSG={true} ></ProposalCard>
          </div>

          {
            invitation?.type === EStatus.PENDING && <>
              <Popconfirm
                title="Confirm"
                description="Are you sure?"
                onConfirm={accept}
                okText="Yes"
                cancelText="No"
              >
                <button
                  className="btn bg-jobsicker me-1"
                >
                  {t("Accept")}
                </button>
              </Popconfirm>
              <Popconfirm
                title="Confirm"
                description="Are you sure?"
                onConfirm={decline}
                okText="Yes"
                cancelText="No"
              >
                <button
                  className="btn btn-danger ms-1"
                >
                  {t("Reject")}
                </button>
              </Popconfirm>
            </>
          }
        </>
      }
    </div>
  )
}
