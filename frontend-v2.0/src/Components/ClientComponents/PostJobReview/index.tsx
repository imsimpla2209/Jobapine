/* eslint-disable react-hooks/exhaustive-deps */
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useSubscription } from 'src/libs/global-state-hook'
import Loader from '../../SharedComponents/Loader/Loader'
import { defaultPostJobState, postJobSubscribtion } from '../PostJobGetStarted'
import './style.css'
import { createJob } from 'src/api/job-apis'
import { userStore } from 'src/pages/AdminPages/auth/user-store'

export default function PostJobReview() {
  const { state: userStoreState } = useSubscription(userStore)
  const { t } = useTranslation(['main'])
  const { state } = useSubscription(postJobSubscribtion)

  const publishJob = () => {
    postJobSubscribtion.updateState({ currentStatus: 'public' })
    createJob({ ...state, client: userStoreState._id })
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
              <Link className="btn bg-jobsicker me-4 px-5" to="/" onClick={publishJob}>
                {t('Post Job Now')}
              </Link>
            </div>
            <div className="px-4 mt-4">
              <h5>{t('Title')}</h5>
              <div>
                <div className="my-4">
                  <p>{state?.title}</p>
                </div>
                <div>
                  <h6 className="text-muted">{t('Job Category')}</h6>
                  <p>{state?.categories}</p>
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
                  <p>{state?.reqSkills}</p>
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
              <Link className="btn bg-jobsicker me-4 px-5" to="/" onClick={publishJob}>
                {t('Post Job Now')}
              </Link>
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
