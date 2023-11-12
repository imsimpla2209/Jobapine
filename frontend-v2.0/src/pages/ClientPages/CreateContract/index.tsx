/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Form, Input, Space } from 'antd'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { DefaultUpload } from 'src/Components/CommonComponents/upload/upload'
import SubmitProposalFixed from 'src/Components/FreelancerComponents/SubmitProposalFixed'
import SubmitProposalHourly from 'src/Components/FreelancerComponents/SubmitProposalHourly'
import Loader from 'src/Components/SharedComponents/Loader/Loader'
import Progress from 'src/Components/SharedComponents/Progress'
import { createContract } from 'src/api/contract-apis'
import { getSkills } from 'src/api/job-apis'
import { getProposal } from 'src/api/proposal-apis'
import { EComplexityGet, EPaymenType } from 'src/utils/enum'
import { randomDate } from 'src/utils/helperFuncs'

export default function CreateContract() {
  const { id: proposalID } = useParams()
  const { t } = useTranslation(['main'])
  const [jobData, setJobData] = useState(null)
  const [files, setFiles] = useState([])
  const [answer, setAnswer] = useState<Record<number, string>>({})
  const [proposalData, setProposalData] = useState(null)
  let [rate, setrate] = useState(0)

  const [searchParams] = useSearchParams()
  const freelancerID = searchParams.get('freelancerID')

  const [contract, setContract] = useState({
    overview: '',
    jobPaymentType: '',
    agreeAmount: 0,
    startDate: '',
    endDate: '',
  })

  const [skills, setSkills] = useState([])

  useEffect(() => {
    getSkills().then(res => setSkills(res.data))
    getProposal(proposalID).then(res => {
      setJobData(res.data.job)
      setProposalData(res.data)
    })
  }, [proposalID])

  const setDataContract = ({ target }) => {
    const val = target.value
    const name = target.name
    switch (name) {
      case 'jobPaymentType':
        setContract({ ...contract, jobPaymentType: val })
        break
      case 'budget':
        setContract({ ...contract, agreeAmount: parseInt(val) })
        break
      case 'startDate':
        console.log(val)
        setContract({ ...contract, startDate: val })
        break
      case 'endDate':
        setContract({ ...contract, endDate: val })
        break
      default:
        break
    }
  }
  console.log('proposalData', proposalData)
  const startContract = async () => {
    await createContract({
      proposal: proposalID,
      job: jobData.id,
      freelancer: freelancerID,
      client: jobData.client,
      overview: contract.overview,
      startDate: new Date(contract.startDate),
      endDate: new Date(contract.endDate),
      paymentType: jobData.payment.type,
      agreeAmount: jobData.payment.amount,
    })
  }
  const handlVal = e => {
    setContract({ ...contract, overview: e.target.value })
  }

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
                        {skills.find(item => item._id === skill?.skill)?.name}
                      </Button>
                      <Progress done={skill?.level} />
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
              <label className="text-center d-block mt-4">
                Start date:
                <input
                  className="form2-control d-inline w-50 my-3 ms-2"
                  type="date"
                  name="startDate"
                  value={contract.startDate}
                  onInput={setDataContract}
                />
              </label>
              <label className="text-center d-block mt-4">
                End date:
                <input
                  className="form-control d-inline w-50 my-3 ms-2"
                  type="date"
                  name="endDate"
                  value={contract.endDate}
                  onInput={setDataContract}
                />
              </label>
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
                <p className="fw-bold">{t('Overview')}</p>
                <textarea name="coverLetter" className="form-control" rows={8} defaultValue={''} onChange={handlVal} />
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
                <button
                  className="btn shadow-none text-white"
                  style={{ backgroundColor: '#5b14b8' }}
                  onClick={() => startContract()}
                >
                  {t('Create contract')}
                </button>
                <button className="btn shadow-none upw-c-cn">{t('Cancel')}</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
