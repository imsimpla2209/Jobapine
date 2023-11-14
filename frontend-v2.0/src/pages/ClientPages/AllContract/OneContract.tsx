/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-script-url */
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getFreelancer } from 'src/api/freelancer-apis'
import { getJob } from 'src/api/job-apis'
import { formatDay } from 'src/utils/helperFuncs'

export default function OneContract({ contract, ind }) {
  const navigate = useNavigate()
  const [currentJob, setCurrentJob] = useState(null)
  const [freelancer, setFreelancer] = useState(null)
  useEffect(() => {
    getJob(contract.job).then(res => setCurrentJob(res.data))
    getFreelancer(contract.freelancer).then(res => setFreelancer(res.data))
  }, [contract])
  console.log(contract)
  return (
    <section
      className="air-card-hover py-3"
      id="contract26184114"
      style={{ borderTop: ind !== 0 && '1px solid #00000020' }}
    >
      <div className="row justify-content-between">
        <div className="col-lg-5 col-md-5 col-xs-10 qa-wm-fl-cl-tile d-flex flex-direction-column justify-content-space-between">
          <div>
            <div className="row qa-wm-fl-cl-title ">
              <div className="col-xs-12">
                <Link to={''} className="m-0 fw-bold">
                  {currentJob?.title}
                </Link>
              </div>
            </div>
            <div className="row qa-wm-fl-cl-client m-sm-bottom my-2">
              <div className="col-xs-6">
                <Link className="text-muted" to={`/freelancer-profile/${freelancer?.authID}`}>
                  <strong className="m-0 ellipsis d-block ng-binding">{freelancer?.name}</strong>
                </Link>
              </div>
            </div>
            <div className="row qa-wm-fl-cl-dates">
              <div className="col-xs-12">
                <small className="text-muted ">
                  <span>{formatDay(new Date(contract?.startDate))}</span> -{' '}
                  <span>{contract?.endDate ? formatDay(new Date(contract?.endDate)) : 'active'}</span>
                </small>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 col-xs-12 d-flex flex-direction-column justify-content-space-between">
          <div className="row">
            <div className="col-xs-6 qa-wm-fl-cl-terms col-xs-12">
              <div>
                <span className="text-muted">Budget: </span>
                <strong>${contract?.agreeAmount}</strong> {contract?.paymentType === 'Hourly' && '/hr'}
              </div>
              {/* {job?.status === false && (
                <>
                  <p className="m-0-top-bottom mt-2">Completed Feb 4</p>
                  <div>
                    <StarsRating clientReview={job?.clientAllReviews} index={1} />
                    <StarsRating clientReview={job?.clientAllReviews} index={2} />
                    <StarsRating clientReview={job?.clientAllReviews} index={3} />
                    <StarsRating clientReview={job?.clientAllReviews} index={4} />
                    <StarsRating clientReview={job?.clientAllReviews} index={5} />
                  </div>
                </>
              )} */}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
