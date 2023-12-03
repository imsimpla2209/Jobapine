/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */

import { CheckCircleTwoTone } from '@ant-design/icons'
import { Button, Input, Modal, Space, Typography } from 'antd'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router'
import { Link, useNavigate } from 'react-router-dom'
import { locationStore } from 'src/Store/commom.store'
import { userStore } from 'src/Store/user.store'
import { getFreelancers } from 'src/api/freelancer-apis'
import { getSkills } from 'src/api/job-apis'
import { checkMessageRoom } from 'src/api/message-api'
import { getAllProposalInJob, updateStatusProposal } from 'src/api/proposal-apis'
import { useSubscription } from 'src/libs/global-state-hook'
import img from '../../../assets/img/icon-user.svg'
import Loader from './../../SharedComponents/Loader/Loader'
import ReviewProposalsPageHeader from './../ReviewProposalsPageHeader'
import { EStatus } from 'src/utils/enum'

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
  const [rejectMessage, setRejectMessage] = useState('')
  const [openModal, setOpenModal] = useState(false)
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
    await checkMessageRoom({ member: [clientID, freelancerID], proposal: proposalId })
    navigate(`/messages?proposalId=${proposalId}`)
  }

  const handleReject = async () => {
    await updateStatusProposal(id, {
      status: EStatus.REJECTED,
      comment: rejectMessage || 'Your proposal does not meet my requirements.',
    })
  }

  if (loading) return <Loader />

  return (
    <>
      <ReviewProposalsPageHeader proposals={proposals.length} />
      <Modal
        open={openModal}
        title={t('Do you want to reject this proposal ?')}
        okText={t('Reject')}
        okType="danger"
        onOk={handleReject}
        onCancel={() => {
          setOpenModal(false)
          setRejectMessage('')
        }}
      >
        <span className="text-muted">Why you want to reject this proposal</span>
        <Input
          style={{ marginTop: 8 }}
          value={rejectMessage}
          autoFocus
          placeholder="Your proposal does not meet my requirements."
          onInput={e => setRejectMessage((e.target as any).value)}
        />
      </Modal>
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
                  <span className="text-muted">{t('Introduction')}: </span>
                  <span className="fw-bold">{currentFreelancer?.intro}</span>
                </p>
                <div>
                  <span className="text-muted">{t('Locations')}: </span>

                  <Space split={'|'}>
                    {currentFreelancer?.currentLocations?.map(l =>
                      locations.find(loc => loc.code === l)?.name ? (
                        <div key={l} className="text-muted  fw-bold ">
                          {locations.find(loc => loc.code === l)?.name}
                        </div>
                      ) : null
                    )}
                  </Space>
                </div>
                <div className="row py-3">
                  <div className="col">
                    <span className="text-muted">{t('Hourly rate')}:</span>
                    <span className="fw-bold"> ${currentFreelancer?.expectedAmount} /hr</span>
                  </div>
                  <div className="col">
                    <span className="text-muted">{t('Earned')}: </span>
                    <span className="fw-bold">${currentFreelancer?.earned}</span>
                  </div>
                </div>

                <div className="col-lg-10">
                  <div>
                    <span className="text-muted">{t('Skills')}:</span>
                    <div className="d-flex justify-content-start">
                      {currentSkills?.map((skill, index) => (
                        <div className="chip mb-3 ms" key={index}>
                          <span> {t(skill?.name)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <p>
                    <span className="text-muted">{t('Certificates')}: </span>
                    <span className="fw-bold"> {currentFreelancer?.certificate}</span>
                  </p>
                  <p>
                    <span className="text-muted">{t('Expected payment amount')}: </span>
                    <span className="fw-bold">${proposal?.expectedAmount}</span>
                  </p>
                  <p id="Cover-Letter">
                    <span className="text-muted">{t('Cover Letter')}: </span>
                    <span className="fw-bold">{proposal.description}</span>
                  </p>
                </div>
              </div>
              <div className="col py-3" style={{ justifyContent: 'end', display: 'flex', alignItems: 'start' }}>
                <Space>
                  <Button onClick={() => sendMSG(currentFreelancer.user, proposal._id)}>Messages</Button>
                  {proposal.currentStatus === 'accepted' ? (
                    <Space>
                      <CheckCircleTwoTone twoToneColor="#52c41a" />
                      <Text type="success">{t('Accepted')}</Text>
                    </Space>
                  ) : (
                    <>
                      <Button type="primary" danger onClick={() => setOpenModal(true)}>
                        {t('Reject')}
                      </Button>
                      <Button type="primary">
                        <Link to={`/create-contract/${proposal._id}?freelancerID=${currentFreelancer?._id}`}>
                          {t('Accept')}
                        </Link>
                      </Button>
                    </>
                  )}
                </Space>
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
