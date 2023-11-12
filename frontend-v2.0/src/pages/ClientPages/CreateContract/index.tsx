/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Form, Input, Modal, Result, Space } from 'antd'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { DefaultUpload } from 'src/Components/CommonComponents/upload/upload'
import SubmitProposalFixed from 'src/Components/FreelancerComponents/SubmitProposalFixed'
import SubmitProposalHourly from 'src/Components/FreelancerComponents/SubmitProposalHourly'
import Loader from 'src/Components/SharedComponents/Loader/Loader'
import { freelancerStore, userStore } from 'src/Store/user.store'
import { getProposal } from 'src/api/proposal-apis'
import { useSubscription } from 'src/libs/global-state-hook'
import { EComplexityGet, EPaymenType } from 'src/utils/enum'
import { currencyFormatter, pickName, randomDate } from 'src/utils/helperFuncs'

export default function CreateContract() {
  const { id: proposalID } = useParams()
  const { i18n, t } = useTranslation(['main'])
  let lang = i18n.language
  const [jobData, setJobData] = useState(null)
  const [files, setFiles] = useState([])
  const [open, setOpen] = useState(false)
  const user = useSubscription(userStore).state
  const [isValid, setValid] = useState(true)
  const [answer, setAnswer] = useState<Record<number, string>>({})
  const [proposalData, setProposalData] = useState(null)
  let [rate, setrate] = useState(0)

  const [searchParams] = useSearchParams()
  const freelancerID = searchParams.get('freelancerID')

  const [contract, setContract] = useState({
    jobPaymentType: '',
    agreeAmount: 0,
    startDate: '',
    endDate: '',
  })
  const [edit, setEdit] = useState({ budget: false, paymentType: false })
  const [done, setDone] = useState(false)

  useEffect(() => {
    getProposal(proposalID).then(res => {
      setJobData(res.data.job)
      setProposalData(res.data)
    })
  }, [proposalID])

  const getData = ({ target }) => {
    const val = target.value
    const name = target.name
    switch (name) {
      case 'jobPaymentType':
        setContract({ ...contract, jobPaymentType: val })
        break
      case 'budget':
        setContract({ ...contract, agreeAmount: parseInt(val) })
        break
      case 'date':
        setContract({ ...contract, endDate: val })
        break
      default:
        break
    }
  }

  const editBudget = () => {
    setEdit({ ...edit, budget: true })
  }

  const editPaymentType = () => {
    setEdit({ ...edit, paymentType: true })
  }

  const cancel = () => {
    setEdit({ budget: false, paymentType: false })
    setContract({ ...contract, agreeAmount: 0, jobPaymentType: '' })
  }

  const startContract = () => {}
  const handlVal = () => {}

  const normFile = (e: any) => {
    // handle event file changes in upload and dragger components
    const fileList = e
    setFiles(fileList)
    return e
  }

  const handlewithdrawProposal = async () => {}

  if (!proposalData) return <Loader />

  return (
    <div className="container my-5 px-5">
      <h3>Create Contract</h3>
      <div className="bg-white py-5">
        <div className="mx-auto w-50">
          <p>Do you want to edit budget or job payment type before you start the contract?</p>
          <div className="text-center" style={{ gap: 16, display: 'flex' }}>
            <button className={`btn btn-outline-secondary ${edit.budget ? 'btn-dark' : ''}`} onClick={editBudget}>
              Change Job Budget
            </button>
            <button
              className={`btn btn-outline-secondary ${edit.paymentType ? 'btn-dark' : ''}`}
              onClick={editPaymentType}
            >
              Change Job Payment Type
            </button>
            {edit.budget || edit.paymentType ? (
              <button className="btn btn-danger" onClick={cancel}>
                Cancel
              </button>
            ) : (
              ''
            )}
          </div>
          {edit.budget && (
            <label className="text-center d-block mt-4">
              Budget:
              <input className="form-control d-inline w-50 my-3 ms-2" type="text" name="budget" onInput={getData} />
            </label>
          )}
          <div>
            {edit.paymentType && (
              <div className="my-4 d-flex justify-content-between w-100" onInput={getData}>
                <label className="border border-success rounded p-3 text-center w-50">
                  <input type="radio" className="float-end" name="jobPaymentType" value="Hourly" />
                  <div>
                    <i className="fas fa-stopwatch mt-4"></i>
                  </div>
                  <h6 className="my-3">{t('Pay by the hour')}</h6>
                  <div>{t('Pay hourly to easily scale up and down.')}</div>
                </label>
                <label className="border border-success rounded p-3 text-center mx-3 w-50">
                  <input type="radio" className="float-end" name="jobPaymentType" value="Fixed Price" />
                  <div>
                    <i className="fas fa-file-invoice-dollar mt-4"></i>
                  </div>
                  <h6 className="my-3">{t('Pay a fixed price')}</h6>
                  <div>{t('Define payment before work begins and pay only when work is delivered.')}</div>
                </label>
              </div>
            )}
          </div>
          <label className="text-center d-block mt-4">
            Start date:
            <input
              className="form-control d-inline w-50 my-3 ms-2"
              type="date"
              name="date"
              value={contract.startDate}
              onInput={getData}
            />
          </label>
          <label className="text-center d-block mt-4">
            End date:
            <input
              className="form-control d-inline w-50 my-3 ms-2"
              type="date"
              name="date"
              value={contract.endDate}
              onInput={getData}
            />
          </label>
          {done && (
            <div className="alert text-jobsicker d-flex align-items-center justify-content-center" role="alert">
              <svg width="30" id="check-circle-fill" fill="currentColor" viewBox="0 0 16 16">
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"></path>
              </svg>
              <div className="ms-2">The offer was sent to the freelancer</div>
            </div>
          )}
          <button
            className="btn bg-jobsicker text-white d-block mx-auto w-50 mt-4"
            onClick={startContract}
            disabled={!contract.startDate || !contract.endDate}
          >
            Start Contract
          </button>
        </div>
      </div>
      <>
        <main>
          <div className="container px-md-5">
            <div className="row mt-5">
              <div className="bg-white border" style={{ borderRadius: 16 }}>
                <h2 className="h4 border-bottom p-4">{t('Job details')}</h2>
                <div className="ps-4 pt-2 d-flex flex-md-row flex-column">
                  <div className="w-75">
                    <p className="fw-bold">{jobData?.title}</p>
                    <span>
                      {jobData?.createdAt
                        ? new Date(`${jobData?.createdAt}`).toLocaleString()
                        : randomDate(new Date(2022, 0, 1), new Date()).toLocaleString()}
                    </span>
                    <div className="mb-3">
                      <span className="bg-cat-cn py-1 px-2 me-3 rounded-pill">
                        <Space size={'middle'}>
                          {jobData?.categories.map(c => (
                            <Link
                              to="#"
                              key={c?.name}
                              className="advanced-search-link"
                              style={{ fontWeight: 600, fontSize: 16 }}
                            >
                              {c?.name}
                            </Link>
                          ))}
                        </Space>
                      </span>
                    </div>
                    <div className="mb-3">
                      <p>{jobData?.description}</p>
                      <Link to={`/job/${jobData._id}`}></Link>
                    </div>
                  </div>
                  <div className="w-25 border-start m-3 ps-3 ">
                    <div>
                      <span>
                        <i className="fas fa-head-side-virus" />
                      </span>
                      <span className="ps-2">
                        <strong>{t('Experiencelevel')}</strong>
                      </span>
                      <p className="ps-4">{t(EComplexityGet[Number(jobData?.scope?.complexity)])}</p>
                    </div>
                    <div>
                      <span>
                        <i className="far fa-clock" />
                      </span>
                      <span className="ps-2">
                        <strong>{t('Hours to be determined')}</strong>
                      </span>
                      <p className="ps-4">{t(`${jobData?.payment?.type}`)}</p>
                    </div>
                    <div>
                      <span>
                        <i className="far fa-calendar-alt" />
                      </span>
                      <span className="ps-2">
                        <strong>
                          {jobData?.scope?.duration} {t('days')}
                        </strong>
                      </span>
                      <p className="ps-4">{t('Job Duration')}</p>
                    </div>
                  </div>
                </div>
                <div className="mx-4 py-2 border-top pb-4">
                  <p className="fw-bold">{t('Skills and experties')}</p>
                  <div className="col">
                    {jobData?.reqSkills?.map((skill, index) => (
                      <Space key={index} size={0} className="me-sm-5 " wrap={true}>
                        <Button key={index} className="btn text-light btn-sm rounded-pill cats mx-1 my-1">
                          {pickName(skill?.skill, lang)}
                        </Button>
                        {/* <Progress done={skill?.level} /> */}
                      </Space>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="row mt-5">
              {/* <div className="col"> */}
              <div className="bg-white border" style={{ borderRadius: 16 }}>
                <h2 className="h4 border-bottom p-4">{t('Terms')}</h2>
                <div className="ps-4 pt-2 d-flex flex-md-row flex-column">
                  {jobData?.payment?.type === EPaymenType.WHENDONE ? (
                    <SubmitProposalFixed rate={rate} setrate={setrate} />
                  ) : (
                    <SubmitProposalHourly rate={rate} setrate={setrate} currentValue={jobData?.payment?.amount} />
                  )}

                  <div className="w-25 m-3 ps-3 d-flex flex-column justify-content-center align-items-center">
                    <svg width="120px" role="img" viewBox="0 0 145 130" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M72.5.5L16.8 17.6v61c0 5.6 1.4 11.2 4.2 16.1 6.1 10.8 20.3 27.5 51.5 34.8 31.2-7.2 45.4-24 51.5-34.8 2.8-4.9 4.2-10.5 4.2-16.1v-61L72.5.5z"
                        fill="#6600cc"
                      />
                      <path
                        d="M128.2 78.6v-61L72.5.5v129c31.2-7.2 45.4-24 51.5-34.8 2.8-4.9 4.2-10.4 4.2-16.1z"
                        fill="#34ba08"
                      />
                      <path
                        d="M75.9 75.9c2.8-.4 4.4-1.6 4.4-4 0-2-1.2-3.2-4.4-4.9l-6.1-1.6C61 62.9 56.5 59.7 56.5 52c0-6.9 5.3-11.3 13.3-12.5v-3.6h6.5v3.6c4.4.4 8.1 2 11.7 4.4l-4 7.3c-2.4-1.6-5.3-2.8-7.7-3.6 0 0-2-.8-6.1-.4-3.2.4-4.4 2-4.4 4s.8 3.2 4.4 4.4l6.1 1.6C86 59.6 90 63.7 90 70.5c0 6.9-5.3 11.7-13.3 12.5v4h-6.5v-4c-6.1-.4-11.3-2.4-15.4-5.7l4.9-7.3c3.2 2.4 6.5 4.4 10.1 5.3 4.1 1 6.1.6 6.1.6z"
                        fill="#fff"
                      />
                    </svg>
                    <p className="ms-5">
                      Includes JobSickers Hourly Protection
                      <a className="upw-c-cn" href="#">
                        Learn more
                      </a>
                    </p>
                  </div>
                </div>
              </div>
              {/* </div> */}
            </div>
            <div className="row mt-5 pb-5">
              <div className="bg-white border" style={{ borderRadius: 16 }}>
                <h2 className="h4 border-bottom p-4">{t('Additional details')}</h2>
                <div className="ps-4 pt-2 pe-4">
                  <p className="fw-bold">{t('Cover Letter')}</p>
                  <textarea
                    name="coverLetter"
                    className="form-control"
                    rows={8}
                    defaultValue={''}
                    onChange={handlVal}
                  />
                </div>

                <div className="ps-4 pt-2 pe-4 mt-3">
                  {jobData?.questions?.length && (
                    <>
                      <p className="fw-bold">{t("Fast Client's Questions")}</p>
                      {jobData?.questions?.map((question, ix) => (
                        <Form.Item
                          label={question + '?'}
                          key={question}
                          required
                          tooltip={t('You need to answer this question')}
                        >
                          <Input
                            placeholder={t('You need to answer this question')}
                            onChange={(e: any) => {
                              setAnswer({ ...answer, [ix]: e.target.value })
                            }}
                          />
                        </Form.Item>
                      ))}
                    </>
                  )}
                </div>

                <div className="mx-4 mt-3 py-2 pb-4">
                  <p className="fw-bold">{t('Attachments')}</p>
                  <div className="d-flex mb-3">
                    {proposalData?.proposalImages?.length > 0 && (
                      <div className="bg-white py-lg-4 px-4 border border-1 row pb-sm-3 py-xs-5">
                        <h5 className="fw-bold my-4">Images</h5>
                        <div className="col">
                          {proposalData?.proposalImages?.map((img, index) => (
                            <p key={index}>
                              <a
                                target="_blank"
                                href={img}
                                className=" mx-1"
                                // style={{ backgroundColor: "#9b9d9f" }}
                                key={index}
                                rel="noreferrer"
                              >
                                {img}
                              </a>
                            </p>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="attachments-cn">
                    <p className="pt-2 px-5 text-center">
                      drag or{' '}
                      <label htmlFor="file" className="upw-c-cn me-1" style={{ cursor: 'pointer' }}>
                        {t('upload')}
                      </label>
                      {t('Additional project files (optional)')}
                      <DefaultUpload normFile={normFile} files={files}></DefaultUpload>
                    </p>
                  </div>
                  <p className="my-3">
                    {t('You may attach up to 10 files under the size of')} <strong>25MB</strong>{' '}
                    {t(
                      `each. Include work samples or other documents to support your application. Do not attach your résumé — your JobSickers profile is automatically forwarded tothe client with your proposal.`
                    )}
                  </p>
                </div>
                <div className="border-top ps-4 py-4">
                  {isValid ? (
                    <>
                      <button className="btn shadow-none text-white" style={{ backgroundColor: '#5b14b8' }}>
                        {t('Submit Proposal')}
                      </button>
                      <button className="btn shadow-none upw-c-cn">{t('Cancel')}</button>
                    </>
                  ) : (
                    <>
                      <Result
                        title={`${t('You already applied for this Job')} ${t('OR')} ${t(
                          'You are Blocked from this one'
                        )}`}
                        extra={
                          <Link to={`/proposals`} type="primary" key="console">
                            {t('Review proposal')}
                          </Link>
                        }
                      />
                    </>
                  )}

                  <Modal open={open} footer={null} className="w-100 w-md-75">
                    <div>
                      <div className="">
                        <h5 className="">{t('Review proposal')}</h5>
                        {/* <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                          ></button> */}
                      </div>
                      <div className="">
                        <div className="pt-2">
                          <div className="w-75">
                            <p className="fw-bold" style={{ fontSize: 19 }}>
                              {jobData?.title}
                            </p>
                            <div className="mb-3">
                              <span className="bg-cat-cn py-1 px-2 rounded-pill">
                                <Space size={'middle'}>
                                  {jobData?.categories.map(c => (
                                    <Link
                                      to="#"
                                      key={c?.name}
                                      className="advanced-search-link"
                                      style={{ fontWeight: 600, fontSize: 16 }}
                                    >
                                      {c?.name}
                                    </Link>
                                  ))}
                                </Space>
                              </span>
                            </div>
                            <div className="mb-3">
                              <p>{jobData?.description}</p>
                            </div>
                          </div>
                          <div className="border-bottom mb-3 d-flex flex-md-row flex-column justify-content-between">
                            <div>
                              <span>
                                <i className="fas fa-head-side-virus" />
                              </span>
                              <span className="ps-2">
                                <strong>Expert</strong>
                              </span>
                              <p className="ps-4">{t(EComplexityGet[Number(jobData?.scope?.complexity)])}</p>
                            </div>
                            <div>
                              <span>
                                <i className="far fa-clock" />
                              </span>
                              <span className="ps-2">
                                <strong>{t('Hours to be determined')}</strong>
                              </span>
                              <p className="ps-4">{t(`${jobData?.payment?.type}`)}</p>
                            </div>
                            <div>
                              <span>
                                <i className="far fa-calendar-alt" />
                              </span>
                              <span className="ps-2">
                                <strong>
                                  {jobData?.scope?.duration} {t('days')}
                                </strong>
                              </span>
                              <p className="ps-4">{t('Job Duration')}</p>
                            </div>
                          </div>
                        </div>
                        <div>
                          <p className="fw-bold">{t('Cover Letter')}</p>
                          <div className="mb-3">
                            <p>{proposalData.coverLetter}</p>
                          </div>
                        </div>
                        {rate && (
                          <div>
                            <p className="fw-bold">{t('Hourly Rate')}</p>
                            <div className="mb-3">
                              <p>{currencyFormatter(rate)}</p>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="modal-footer">
                        <button
                          type="button"
                          style={{ background: '#56889c' }}
                          className="btn rounded text-white"
                          data-bs-dismiss="modal"
                          onClick={handlewithdrawProposal}
                        >
                          {t('WithDraw proposal')}
                        </button>
                        <button onClick={() => {}} className="btn bg-jobsicker" type="button">
                          {t('Save changes')}
                        </button>
                      </div>
                    </div>
                  </Modal>
                </div>
              </div>
            </div>
          </div>
        </main>
      </>
    </div>
  )
}
