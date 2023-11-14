/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router'
import { Link, useNavigate } from 'react-router-dom'
import { locationStore } from 'src/Store/commom.store'
import { userStore } from 'src/Store/user.store'
import { getFreelancers } from 'src/api/freelancer-apis'
import { getSkills } from 'src/api/job-apis'
import { createMessageRoom } from 'src/api/message-api'
import { getAllProposalInJob } from 'src/api/proposal-apis'
import { useSubscription } from 'src/libs/global-state-hook'
import img from '../../../assets/img/icon-user.svg'
import Loader from './../../SharedComponents/Loader/Loader'
import ReviewProposalsPageHeader from './../ReviewProposalsPageHeader'

export default function ReviewProposalsCard() {
  const {
    state: { id: clientID },
  } = useSubscription(userStore)
  const { state: locations } = useSubscription(locationStore)
  const { t } = useTranslation(['main'])
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [proposals, setProposals] = useState([])
  const [freelancers, setFreelancers] = useState([])
  const [skills, setSkills] = useState([])
  const navigate = useNavigate()
  useEffect(() => {
    setLoading(true)
    getFreelancers({}).then(res => setFreelancers(res.data.results))
    getSkills().then(res => setSkills(res.data))
    getAllProposalInJob(id)
      .then(res => setProposals(res.data.results))
      .finally(() => setLoading(false))
  }, [])

  const sendMSG = async (freelancerID: string, proposalId: string) => {
    await createMessageRoom({ member: [freelancerID, clientID], proposal: proposalId })
    navigate(`/messages?proposalId=${proposalId}`)
  }

  if (loading) return <Loader />

  return (
    <>
      <ReviewProposalsPageHeader proposals={proposals.length} />

      {proposals.length > 0 ? (
        proposals.map((proposal, index) => {
          const currentFreelancer = freelancers.find(({ _id }) => _id === proposal.freelancer)
          const currentSkills = skills.filter(({ _id }) => currentFreelancer?.skills?.find(item => item.skill === _id))
          console.log(currentFreelancer)
          return (
            <div className="row border bg-white border-1 ms-0 pt-2" key={index}>
              <div className="col-1 pt-lg-3">
                <img
                  alt=""
                  className="circle"
                  src={currentFreelancer?.img?.[0] ? currentFreelancer?.img?.[0] : img}
                  style={{ width: '70px', height: '70px' }}
                />
              </div>
              <div className="col-lg-6 pt-lg-3 ">
                <Link
                  to={`/freelancer-profile/${currentFreelancer?.authID}`}
                  id="job-title-home-page "
                  className="link-dark job-title-hover fw-bold text-success"
                >
                  {currentFreelancer?.name}
                </Link>
                <p id="job-title-home-page" className="link-dark my-1">
                  <span className="text-muted">Intro: </span>
                  <span className="fw-bold">{currentFreelancer?.intro}</span>
                </p>
                <div>
                  <span className="text-muted">Country: </span>
                  <span className="text-muted  fw-bold d-flex">
                    {currentFreelancer?.currentLocations?.map(l => (
                      <div key={l}>{locations[Number(l)]?.name}, </div>
                    ))}
                  </span>
                </div>
                <div className="row py-3">
                  <div className="col">
                    <span className="text-muted">Hourly Rate:</span>
                    <span className="fw-bold"> {currentFreelancer?.expectedAmount} /hr</span>
                  </div>
                  <div className="col">
                    <span className="text-muted">Earned: </span>
                    <span className="fw-bold">{currentFreelancer?.earned}</span>
                  </div>
                </div>
              </div>
              <div className="col py-3">
                <div className="btn-group float-end "></div>
                <div className="btn-group float-start">
                  <ul className="dropdown-menu ">
                    <li>
                      <a className="dropdown-item" href="#">
                        Candidate will not be notified
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col py-3">
                <span
                  className="btn bg-white btn-outline-secondary"
                  onClick={() => sendMSG(currentFreelancer.user, proposal._id)}
                >
                  <span className="text-success fw-bold">Messages</span>
                </span>
              </div>
              <div className="col py-3">
                <Link
                  type="button"
                  className="btn bg-jobsicker px-5"
                  to={`/create-contract/${proposal._id}?freelancerID=${currentFreelancer?._id}`}
                >
                  Hire
                </Link>
              </div>
              <div className="col-lg-1 pt-lg-3"></div>
              <div className="col-lg-10 pt-lg-3 mx-3">
                <p>
                  <span className="text-muted">Skills:</span>
                  <div className="d-flex justify-content-start">
                    {currentSkills?.map((skill, index) => (
                      <div className="chip mb-3 ms" key={index}>
                        <span> {t(skill?.name)}</span>
                      </div>
                    ))}
                  </div>
                </p>
                <p>
                  <span className="text-muted">Certificate:</span>
                  <span className="fw-bold"> {currentFreelancer?.certificate}</span>
                </p>
                <p>
                  <span className="text-muted">Proposed bid:</span>
                  <span className="fw-bold"> {proposal?.expectedAmount}</span>
                </p>
                <p id="Cover-Letter">
                  <span className="text-muted">Cover Letter - </span>
                  <span className="fw-bold">{proposal.description}</span>
                </p>
              </div>
            </div>
          )
        })
      ) : (
        <div className="row border bg-white border-1 ms-0 py-3">
          <p className="text-muted text-center h1">No proposals</p>
        </div>
      )}
    </>
  )
}
