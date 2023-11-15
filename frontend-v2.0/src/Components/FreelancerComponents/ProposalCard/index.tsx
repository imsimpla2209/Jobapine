/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getJob } from "src/api/job-apis";
import Loader from './../../SharedComponents/Loader/Loader';
import { EStatus } from "src/utils/enum";
import { useTranslation } from "react-i18next";
import { currencyFormatter, randomDate } from "src/utils/helperFuncs";
import { BlueColorButton } from "src/Components/CommonComponents/custom-style-elements/button";
import { isEmpty } from "lodash";
import { Collapse } from "antd";
import { requestMessageRoom } from "src/api/message-api";
import { useSubscription } from "src/libs/global-state-hook";
import { userStore } from "src/Store/user.store";

export default function ProposalCard({ proposal, jobId, ind, isInMSG = false }) {
  const { t } = useTranslation(['main'])
  const [jobData, setJobData] = useState<any>({})
  const [isSendRequest, setSendRequest] = useState<any>(false)
  const user = useSubscription(userStore).state

  useEffect(() => {
    getJob(jobId).then(res => {
      setJobData(res.data);
    }).catch(err => console.log(err));
  }, []);

  const createRequestMSGRoom = () => {
    requestMessageRoom({
      from: (user?.id || user?._id),
      to: jobData?.client?.user,
      proposal: proposal._id,
      text: 'Accept me please!'
    }).then(() => {
      setSendRequest(true)
    }).catch((err) => {
      console.log('ERROR: Could not send request', err)
    })
  }

  return (
    <>
      {
        jobId
          &&
          jobData?.title ?
          <div>
            <div className="row">
              <div className="col-md-7 col-12">
                <Link
                  to={`/job/review-proposal/${proposal._id}`}
                  className={`fw-bold ${proposal?.currentStatus === EStatus.ACCEPTED ? "" : "pe-none"}`}
                  style={{ color: "#6600cc" }}
                >
                  {
                    isInMSG ? "Proposal Information" : `Proposals No.${ind + 1}`
                  }
                </Link>
                <div>
                  <strong className=" me-2">
                    {t("Cover Letter")}:
                  </strong>
                  <span className="text-muted text-wrap">
                    {proposal?.description}
                  </span>
                </div>
                <div className="">
                  <div className="d-flex flex-wrap">
                    <strong className="me-2">{t("Submited Date")}: </strong>
                    <div>
                      {
                        proposal?.currentStatus === EStatus.ACCEPTED
                          ? new Date(proposal?.status?.date * 1000).toLocaleString()
                          : (proposal?.createdAt ? new Date((proposal?.createdAt) * 10000).toLocaleString() : randomDate(new Date(2022, 0, 1), new Date()).toLocaleString())
                      }
                    </div>
                  </div>
                  <div className="d-flex flex-wrap">
                    <strong className="me-2">{t("Status")}: </strong>
                    <span>
                      {
                        proposal?.currentStatus
                      }
                    </span>
                  </div>
                  <div className="d-flex flex-wrap">
                    <strong className="me-2">{t("Expected Amount")}: </strong>
                    <span>
                      {
                        currencyFormatter(proposal?.expectedAmount) + '/ ' + t(`${jobData?.payment?.type}`)
                      }
                    </span>
                  </div>
                  {
                    !isInMSG && <div>
                      {
                        (proposal?.currentStatus === EStatus.ACCEPTED || proposal?.currentStatus === EStatus.INPROGRESS)
                          ? <Link to="/messages"><BlueColorButton>{t("Go to messaging")}</BlueColorButton></Link>
                          : <BlueColorButton style={{
                            pointerEvents: (isSendRequest || proposal?.msgRequestSent) ? "none" : "auto",
                            background: (isSendRequest || proposal?.msgRequestSent) ? "gray" : "",
                          }} className="" onClick={createRequestMSGRoom}>
                            {(isSendRequest || proposal?.msgRequestSent) ? <>{t("Sent")}</> : <>{t("Request to message")}</>} 
                          </BlueColorButton>
                      }
                    </div>
                  }
                  <div>
                    {
                      !isEmpty(proposal?.answers) && <>
                        <strong className="me-2">{t("answers")}: </strong>
                        <Collapse
                          items={Object.keys(proposal?.answers)?.map((a, ix) => {
                            return {
                              key: ix,
                              label: jobData?.questions[a],
                              children: <p>{proposal?.answers[a]}</p>,
                            }
                          })} defaultActiveKey={[0]} />
                      </>
                    }
                  </div>
                </div>
              </div>
              <div className="col-md-5 col-12 d-flex flex-column">
                <strong className=" me-2">
                  {t("Applied Job")}:
                </strong>
                <Link
                  to={`/job/${jobId}`}
                  className="fw-bold "
                  style={{ color: "#6600cc" }}
                >
                  {jobData.title}
                </Link>
                <div className="text muted">{jobData?.description}</div>
              </div>
            </div>
            <hr />
          </div>
          : ind === 0 && <Loader />
      }
    </>
  );
}
