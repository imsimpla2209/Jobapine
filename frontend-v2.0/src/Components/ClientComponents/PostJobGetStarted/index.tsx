/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { createSubscription } from 'src/libs/global-state-hook'
import { StepContext } from 'src/pages/ClientPages/PostJop'
import { ICreateJobBody } from 'src/types/job'

export const defaultPostJobState: ICreateJobBody = {
  client: '',
  title: '',
  description: '',
  categories: [],
  type: null,
  payment: null,
  scope: null,
  budget: 0,
}

export const postJobSubscribtion = createSubscription<ICreateJobBody>(defaultPostJobState)

export default function PostJobGetStarted({ setBtns, btns }) {
  const { setStep } = useContext(StepContext)
  const [start, setStart] = useState(false)
  const { t } = useTranslation(['main'])
  const [job, setJob] = useState({ jobDuration: '' })

  const createJob = () => {
    setStart(true)
  }

  const getData = ({ target }) => {
    job.jobDuration = target.value
    setJob({ ...job, jobDuration: job.jobDuration })
  }

  const addData = () => {
    postJobSubscribtion.updateState({
      jobDuration: job.jobDuration,
    })
    setBtns({ ...btns, title: false })
    setStep('title')
  }

  return (
    <section className=" bg-white border rounded mt-3 pt-4">
      <div className="border-bottom ps-4 pb-3">
        <h4>{t('Getting started')}</h4>
      </div>
      {!start ? (
        <div className="ps-4 my-3">
          <button className="btn bg-jobsicker" onClick={createJob}>
            {t('Get Start')}
          </button>
        </div>
      ) : (
        <>
          <div className="ps-4 my-3">
            <p className="fw-bold">{t('What would you like to do?')}</p>
            <div className=" w-75 my-4 ms-4 d-flex justify-content-between" onInput={getData}>
              <label className="border border-success rounded p-3 text-center">
                <input type="radio" className="float-end" name="short-long-job" value="short-term" />
                <div>
                  <i className="far fa-clock"></i>
                </div>
                <h5 className="my-3">{t('Short-term or part-time work')}</h5>
                <div>{t('Less than 30 hrs/week')}</div>
                <div>{t('Less than 3 months')}</div>
              </label>
              <label className="border border-success rounded p-3 text-center">
                <input type="radio" className="float-end" name="short-long-job" value="long-term" />
                <div>
                  <i className="far fa-calendar-plus"></i>
                </div>
                <h5 className="my-3">{t('Designated, longer term work')}</h5>
                <div>{t('More than 30 hrs/week')}</div>
                <div>{t('3+ months')}</div>
              </label>
            </div>
          </div>
          <div className="ps-4 my-3">
            <button className="btn">
              <Link className="btn border text-success me-4 px-5 fw-bold" to="/home">
                {t('Cancel')}
              </Link>
            </button>
            <button className={`btn ${job.jobDuration === '' ? 'disabled' : ''}`}>
              <span className="btn bg-jobsicker px-5" onClick={addData}>
                {t('Continue')}
              </span>
            </button>
          </div>
        </>
      )}
    </section>
  )
}
