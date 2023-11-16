/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */

import { CheckCircleTwoTone } from '@ant-design/icons'
import { Button, Space, Typography } from 'antd'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router'
import { Link, useNavigate } from 'react-router-dom'
import { locationStore } from 'src/Store/commom.store'
import { userStore } from 'src/Store/user.store'
import { getFreelancers } from 'src/api/freelancer-apis'
import { getSkills } from 'src/api/job-apis'
import { checkMessageRoom } from 'src/api/message-api'
import { getAllProposalInJob } from 'src/api/proposal-apis'
import { useSubscription } from 'src/libs/global-state-hook'
import img from '../../../assets/img/icon-user.svg'
import Loader from './../../SharedComponents/Loader/Loader'
import ReviewProposalsPageHeader from './../ReviewProposalsPageHeader'

export const { Text } = Typography

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
  console.log('proposals', proposals)
  const sendMSG = async (freelancerID: string, proposalId: string) => {
    await checkMessageRoom({ from: clientID, to: freelancerID })
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
                  <span className="text-muted  fw-bold d-flex" style={{ gap: 8 }}>
                    {currentFreelancer?.currentLocations?.map(l => (
                      <div key={l}>{locations.find(loc => loc.code === l).name} | </div>
                    ))}
                  </span>
                </div>
                <div className="row py-3">
                  <div className="col">
                    <span className="text-muted">Hourly Rate:</span>
                    <span className="fw-bold"> ${currentFreelancer?.expectedAmount} /hr</span>
                  </div>
                  <div className="col">
                    <span className="text-muted">Earned: </span>
                    <span className="fw-bold">${currentFreelancer?.earned}</span>
                  </div>
                </div>
              </div>
              <div className="col py-3" style={{ justifyContent: 'end', display: 'flex', alignItems: 'start' }}>
                <Space>
                  <Button onClick={() => sendMSG(currentFreelancer.user, proposal._id)}>Messages</Button>
                  {proposal.currentStatus === 'accepted' ? (
                    <Space>
                      <CheckCircleTwoTone twoToneColor="#52c41a" />
                      <Text type="success">Accepted</Text>
                    </Space>
                  ) : (
                    <>
                      <Button type="primary" danger>
                        Reject
                      </Button>
                      <Button type="primary">
                        <Link to={`/create-contract/${proposal._id}?freelancerID=${currentFreelancer?._id}`}>
                          Accept
                        </Link>
                      </Button>
                    </>
                  )}
                </Space>
              </div>

              <div className="col-lg-10 pt-lg-3 mx-3">
                <div>
                  <span className="text-muted">Skills:</span>
                  <div className="d-flex justify-content-start">
                    {currentSkills?.map((skill, index) => (
                      <div className="chip mb-3 ms" key={index}>
                        <span> {t(skill?.name)}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <p>
                  <span className="text-muted">Certificate: </span>
                  <span className="fw-bold"> {currentFreelancer?.certificate}</span>
                </p>
                <p>
                  <span className="text-muted">Expected wage: </span>
                  <span className="fw-bold">${proposal?.expectedAmount}</span>
                </p>
                <p id="Cover-Letter">
                  <span className="text-muted">Cover Letter: </span>
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
