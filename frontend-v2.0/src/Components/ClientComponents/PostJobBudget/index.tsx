import { useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StepContext } from 'src/pages/ClientPages/PostJop'
import { postJobSubscribtion } from '../PostJobGetStarted'
import './style.css'
import { EPaymenType } from 'src/utils/enum'
import { IJobPayment } from 'src/types/job'

export default function Postbudget({ setBtns, btns }) {
  const { setStep } = useContext(StepContext)
  const { t } = useTranslation(['main'])
  const [job, setJob] = useState<{ payment: IJobPayment; budget: number }>({ payment: null, budget: 0 })

  const getData = e => {
    const val = e.target.value
    const name = e.target.name
    switch (name) {
      case 'payment':
        job.payment = { ...job.payment, type: val }
        setJob({ ...job, payment: job.payment })
        break
      case 'budget':
        job.budget = parseInt(val)
        setJob({ ...job, budget: job.budget })
        break
      default:
        break
    }
  }

  const addData = () => {
    postJobSubscribtion.updateState({
      ...job,
    })

    setBtns({ ...btns, review: false })
    setStep('review')
  }

  return (
    <>
      <section className=" bg-white border rounded mt-3 pt-4">
        <div className="border-bottom ps-4">
          <h4>{t('Budget')}</h4>
          <p>{t('Step 6 of 7')}</p>
        </div>
        <div className="px-4 mt-3">
          <p className="fw-bold mt-2">{t('How would you like to pay your freelancer or agency?')}</p>
          <div className="my-4 d-flex justify-content-between w-75" onInput={getData}>
            <label className="border border-success rounded p-3 text-center w-50">
              <input type="radio" className="float-end" name="payment" value={EPaymenType.PERHOURS} />
              <div>
                <i className="fas fa-stopwatch mt-4"></i>
              </div>
              <h6 className="my-3">{t('Pay by the hour')}</h6>
              <div>{t('Pay hourly to easily scale up and down.')}</div>
            </label>
            <label className="border border-success rounded p-3 text-center mx-3 w-50">
              <input type="radio" className="float-end" name="payment" value={EPaymenType.WHENDONE} />
              <div>
                <i className="fas fa-file-invoice-dollar mt-4"></i>
              </div>
              <h6 className="my-3">{t('Pay a fixed price')}</h6>
              <div>{t('Define payment before work begins and pay only when work is delivered.')}</div>
            </label>
          </div>
        </div>
        {job.payment?.type === EPaymenType.WHENDONE ? (
          <div className="px-4 my-3">
            <p className="fw-bold mt-2">{t('Do you have a specific budget?')}</p>
            <div className="me-5 mt-2 position-relative jd-inp-cn w-25">
              <div className="position-absolute">
                <i className="fas fa-dollar-sign"></i>
              </div>
              <input
                className="form-control text-end shadow-none"
                onInput={getData}
                name="budget"
                type="number"
                placeholder="00.00"
              />
            </div>
          </div>
        ) : (
          job.payment?.type === EPaymenType.PERHOURS && (
            <div className="px-4 my-3">
              <p className="fw-bold mt-2">{t('Set your own hourly rate')}</p>
              <div className="me-5 mt-2 position-relative jd-inp-cn w-25">
                <div className="position-absolute">
                  <i className="fas fa-dollar-sign"></i>
                </div>
                <input
                  className="form-control text-end shadow-none"
                  onInput={getData}
                  name="budget"
                  type="number"
                  placeholder="00.00"
                />
                <span className="position-absolute">/hr</span>
              </div>
            </div>
          )
        )}
      </section>

      <section className="bg-white border rounded mt-3">
        <div className="ps-4 my-3">
          <button className="btn" onClick={() => setStep('visibility')}>
            <span className="btn border text-success me-4 px-5">{t('Back')}</span>
          </button>
          <button className={`btn ${job.payment === null || job.budget === 0 ? 'disabled' : ''}`}>
            <span className="btn bg-jobsicker px-5" onClick={addData}>
              {t('Next')}
            </span>
          </button>
        </div>
      </section>
    </>
  )
}
