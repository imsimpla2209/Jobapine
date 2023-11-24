/* eslint-disable react-hooks/exhaustive-deps */
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useSubscription } from 'src/libs/global-state-hook'
import Loader from '../../SharedComponents/Loader/Loader'
import { defaultPostJobState, postJobSubscribtion } from '../PostJobGetStarted'
import './style.css'
import { createJob } from 'src/api/job-apis'
import { fetchAllToCL } from 'src/utils/helperFuncs'
import { Button, message } from 'antd'
import { clientStore } from 'src/Store/user.store'

export default function PostJobReview() {
  const { state: userStoreState } = useSubscription(clientStore)
  const { t } = useTranslation(['main'])
  const { state } = useSubscription(postJobSubscribtion)

  const publishJob = async () => {
    if (state.attachments?.length) {
      await fetchAllToCL(state.attachments)
        .then(res => {
          state['attachments'] = res?.filter(url => !!url) || []
        })
        .catch(err => {
          state['attachments'] = []
        })
    }
    createJob({ ...state, client: userStoreState.id })
      .then(res => {
        console.log(res)
        postJobSubscribtion.updateState({ currentStatus: 'public' })
        message.success('🎉🎉🎉 Job created successfully! 🎉🎉🎉')
      })
      .catch(err => {
        message.error('Failed to create Job')
      })
  }

  const deletePost = () => {
    postJobSubscribtion.updateState(defaultPostJobState)
  }

  return (
    <>
      {state !== null ? (
        <>
          <section className=" bg-white border rounded mt-3">
            <div className="ps-4 d-flex border-bottom justify-content-between align-items-center py-4">
              <h4>{t('Review and post')}</h4>
              <Button className="btn bg-jobsicker me-4 px-5" onClick={publishJob}>
                {t('Post Job Now')}
              </Button>
            </div>
            <div className="px-4 mt-4">
              <h5>{t('Title')}</h5>
              <div>
                <div className="my-4">
                  <p>{state?.title}</p>
                </div>
                <div>
                  <h6 className="text-muted">{t('Job Category')}</h6>
                  {/* <p>{state?.categories}</p> */}
                  {/* {state?.categories?.map((c, index) => (
                    <div key={index}>
                      <button type="button" className="btn text-light btn-sm rounded-pill cats mx-1">
                        {c}
                      </button>
                    </div>
                  ))} */}
                </div>
              </div>
            </div>
          </section>

          <section className=" bg-white border rounded mt-4">
            <div className="px-4 mt-4">
              <h5>{t('Description')}</h5>
              <div>
                <div className="my-4">
                  <p>{state?.description}</p>
                </div>
              </div>
            </div>
          </section>

          <section className=" bg-white border rounded mt-4">
            <div className="px-4 mt-4">
              <h5>{t('Details')}</h5>
              <div>
                <div className="my-4">
                  <h6 className="text-muted">{'Type of Project'}</h6>
                  <p>{state?.type}</p>
                </div>
              </div>
            </div>
          </section>

          <section className=" bg-white border rounded mt-4">
            <div className="px-4 mt-4">
              <h5>{t('Expertise')}</h5>
              <div>
                <div className="my-4">
                  <h6 className="text-muted">{t('Experience Level')}</h6>
                  <p>{state?.experienceLevel}</p>
                  {/* <p>{state?.reqSkills}</p> */}
                </div>
              </div>
            </div>
          </section>

          <section className=" bg-white border rounded mt-4">
            <div className="px-4 mt-4">
              <h5>{t('Visibility')}</h5>
              <div>
                <div className="my-4">
                  <h6 className="text-muted">{t('Job Posting Visibility')}</h6>
                  <p>{state?.jobDuration}</p>
                </div>
                <div className="my-4">
                  <h6 className="text-muted">{t('Number freelancer')}</h6>
                  <p>{state?.preferences.nOEmployee}</p>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white border rounded mt-4">
            <div className="px-4 mt-4">
              <h5>{t('Budget')}</h5>
              <div className="d-flex">
                <div className="my-4 w-50">
                  <h6 className="text-muted">{t('JobHourly or Fixed-Price')}</h6>
                  <p>{state?.payment.type}</p>
                </div>
                <div className="my-4">
                  <h6 className="text-muted">{'Budget'}</h6>
                  <p>{state?.budget}</p>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white border rounded mt-4">
            <div className="ps-4 my-3 py-2">
              <Button className="btn bg-jobsicker me-4 px-5" onClick={publishJob}>
                {t('Post Job Now')}
              </Button>
              <Link className="btn border text-success px-5" to="/home" onClick={deletePost}>
                {t('Delete & Exit')}
              </Link>
            </div>
          </section>
        </>
      ) : (
        <Loader />
      )}
    </>
  )
}
