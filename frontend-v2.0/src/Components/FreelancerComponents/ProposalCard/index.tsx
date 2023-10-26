/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getJob } from "src/api/job-apis";
import Loader from './../../SharedComponents/Loader/Loader';
import { EStatus } from "src/utils/enum";
import { useTranslation } from "react-i18next";
import { randomDate } from "src/utils/helperFuncs";

export default function ProposalCard({ proposal, jobId, ind }) {
  const { t } = useTranslation(['main'])
  const [jobData, setJobData] = useState<any>({})

  useEffect(() => {
    getJob(jobId).then(res => {
      setJobData(res.data);
    }).catch(err => console.log(err));
  }, []);

  return (
    <>
      {
        jobId
          &&
          jobData?.title ?
          <div>
            <div className="d-flex flex-wrap flex-md-row flex-column justify-content-around">
              <div className="">
                <Link
                  to={`/job/review-proposal/${proposal._id}`}
                  className="fw-bold "
                  style={{ color: "#6600cc" }}
                >
                  Proposals No.{ind + 1}
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
                  <div>
                    {
                      proposal?.currentStatus === EStatus.ACCEPTED
                        ? new Date(proposal?.status?.date * 1000).toLocaleString()
                        : t("Submited Date") + ': ' + (proposal?.createdAt ? new Date((proposal?.createdAt) * 10000).toLocaleString() : randomDate(new Date(2022, 0, 1), new Date()).toLocaleString())
                    }
                  </div>
                  <div>
                    {
                      t("Status") + ': ' + proposal?.currentStatus
                    }
                  </div>
                </div>
              </div>
              <div className="d-flex flex-column">
                <strong className=" me-2">
                  {t("Job details")}:
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
