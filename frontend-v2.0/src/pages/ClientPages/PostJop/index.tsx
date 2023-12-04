import { AlertFilled, DollarTwoTone, EditOutlined, HomeOutlined } from '@ant-design/icons'
import PostJobAside from 'Components/ClientComponents/PostJobAside'
import PostJobGetStarted from 'Components/ClientComponents/PostJobGetStarted'
import { Breadcrumb, Card, Modal, Row } from 'antd'
import { createContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import PostJobBudget from 'src/Components/ClientComponents/PostJobBudget'
import PostJobDescription from 'src/Components/ClientComponents/PostJobDescription'
import PostJobDetails from 'src/Components/ClientComponents/PostJobDetails'
import PostJobExpertise from 'src/Components/ClientComponents/PostJobExpertise'
import PostJobReview from 'src/Components/ClientComponents/PostJobReview'
import PostJobTitle from 'src/Components/ClientComponents/PostJobTitle'
import PostJobVisibility from 'src/Components/ClientComponents/PostJobVisibility'
import { Title } from '../JobDetailsBeforeProposols'
import { SICKPOINTS_PER_POST } from 'src/utils/enum'
import { useSubscription } from 'src/libs/global-state-hook'
import { clientStore, userStore } from 'src/Store/user.store'
import VerifyPaymentModal from 'src/Components/ClientComponents/HomeLayout/VerifyPaymentModal'

export const StepContext = createContext({ step: 'started', setStep: val => {} })

export default function PostJob() {
  const navigate = useNavigate()
  const { t } = useTranslation(['main'])
  const [step, setStep] = useState('started')
  const [showWarning, setShowWarning] = useState(false)
  const { state: user } = useSubscription(userStore)
  const [btns, setBtns] = useState({
    started: false,
    title: true,
    description: true,
    details: true,
    expertise: true,
    visibility: true,
    budget: true,
    review: true,
  })
  const { state: client } = useSubscription(clientStore)
  const [openVerifyModal, setOpenVerifyModal] = useState(false)

  useEffect(() => {
    if (!client?.paymentVerified) {
      setOpenVerifyModal(true)
    } else {
      setOpenVerifyModal(false)
    }

    // navigate('/create-profile')
    if (user.sickPoints < SICKPOINTS_PER_POST) {
      setShowWarning(true)
    } else {
      setShowWarning(false)
    }
  }, [])

  return (
    <StepContext.Provider value={{ step, setStep }}>
      <VerifyPaymentModal open={openVerifyModal} handleClose={() => setOpenVerifyModal(false)} />

      {showWarning && !openVerifyModal ? (
        <Modal
          open={true}
          title={
            <Title level={5} style={{ color: '#eb2f96' }}>
              <AlertFilled color="#eb2f96" style={{ marginRight: 8 }} />
              Not enough SickPoints to create a job
            </Title>
          }
          onOk={() => navigate('/buyconnects')}
          onCancel={() => navigate('/')}
          cancelText={t('Back to Home')}
          okText={t('Buy now')}
        >
          <p>
            You need to have at least {SICKPOINTS_PER_POST} <DollarTwoTone twoToneColor="#eb2f96" /> SickPoints to post
            a job.
          </p>
        </Modal>
      ) : null}

      <section className="sec-bg-cn p-4" style={{ minHeight: '100vh' }}>
        <div className="container">
          <Row style={{ padding: '20px 0px' }}>
            <Card style={{ width: '100%' }}>
              <Breadcrumb
                items={[
                  {
                    path: '/',
                    title: (
                      <>
                        <HomeOutlined />
                        <span className="fw-bold">{t('Home')}</span>
                      </>
                    ),
                  },
                  {
                    title: (
                      <>
                        <EditOutlined />
                        <span className="fw-bold">{t('Post Job')}</span>
                      </>
                    ),
                  },
                ]}
              />
            </Card>
          </Row>
          <div className="row">
            <div className="col-lg-3">
              <PostJobAside btns={btns} />
            </div>
            <div className="col-lg-9">
              {step === 'started' && <PostJobGetStarted setBtns={setBtns} btns={btns} />}
              {step === 'title' && <PostJobTitle setBtns={setBtns} btns={btns} />}
              {step === 'description' && <PostJobDescription setBtns={setBtns} btns={btns} />}
              {step === 'details' && <PostJobDetails setBtns={setBtns} btns={btns} />}
              {step === 'expertise' && <PostJobExpertise setBtns={setBtns} btns={btns} />}
              {step === 'visibility' && <PostJobVisibility setBtns={setBtns} btns={btns} />}
              {step === 'budget' && <PostJobBudget setBtns={setBtns} btns={btns} />}
              {step === 'review' && <PostJobReview />}
            </div>
          </div>
        </div>
      </section>
    </StepContext.Provider>
  )
}
