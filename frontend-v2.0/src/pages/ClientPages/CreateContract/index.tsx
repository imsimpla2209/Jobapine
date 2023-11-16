/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Form, Input, InputNumber, Select, Space, message } from 'antd'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { DefaultUpload } from 'src/Components/CommonComponents/upload/upload'
import Loader from 'src/Components/SharedComponents/Loader/Loader'
import Progress from 'src/Components/SharedComponents/Progress'
import { createContract } from 'src/api/contract-apis'
import { getSkills } from 'src/api/job-apis'
import { getProposal } from 'src/api/proposal-apis'
import { defaultPaymenType } from 'src/utils/constants'
import { EComplexityGet } from 'src/utils/enum'
import { randomDate } from 'src/utils/helperFuncs'

export default function CreateContract() {
  const { id: proposalID } = useParams()
  const { t } = useTranslation(['main'])
  const [jobData, setJobData] = useState(null)
  const [files, setFiles] = useState([])
  const [answer, setAnswer] = useState<Record<number, string>>({})
  const [proposalData, setProposalData] = useState(null)
  const [searchParams] = useSearchParams()
  const freelancerID = searchParams.get('freelancerID')

  const [contract, setContract] = useState({
    overview: '',
    paymentType: '',
    agreeAmount: 0,
    startDate: '',
    endDate: '',
  })

  const [skills, setSkills] = useState([])
  const navigate = useNavigate()
  useEffect(() => {
    getSkills().then(res => setSkills(res.data))
    getProposal(proposalID).then(res => {
      setJobData(res.data.job)
      setProposalData(res.data)
      setContract({
        ...contract,
        agreeAmount: res.data?.expectedAmount || 0,
        paymentType: res.data?.job?.payment?.type,
      })
    })
  }, [proposalID])

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
      .then(res => {
        if (res) {
          message.success('Created contract successfully')
          navigate('')
        }
      })
      .catch(e => console.error(e))
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
                        {jobData?.categories?.map(c => (
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
            <div className="bg-white border" style={{ borderRadius: 16 }}>
              <h2 className="h4 border-bottom p-4">{t('Terms')}</h2>
              <Form layout="horizontal" labelCol={{ span: 4 }} wrapperCol={{ span: 14 }} style={{ padding: 16 }}>
                <Form.Item label="Start date:">
                  <input
                    className="form-control d-inline w-50 "
                    type="date"
                    name="startDate"
                    value={contract.startDate}
                    onInput={e => setContract({ ...contract, startDate: (e.target as any).value })}
                  />
                </Form.Item>
                <Form.Item label="End date:">
                  <input
                    className="form-control d-inline w-50 "
                    type="date"
                    name="endDate"
                    value={contract.endDate}
                    onInput={e => setContract({ ...contract, endDate: (e.target as any).value })}
                  />
                </Form.Item>

                <Form.Item label="Payment amount:">
                  <InputNumber
                    min={0}
                    addonBefore={'$'}
                    addonAfter={
                      <Select
                        defaultValue={contract?.paymentType || 'PerHour'}
                        style={{ width: 120 }}
                        onChange={val => {
                          setContract({ ...contract, paymentType: val })
                        }}
                        options={defaultPaymenType}
                      />
                    }
                    defaultValue={contract?.agreeAmount || 0}
                    value={contract?.agreeAmount || 0}
                    onChange={val => setContract({ ...contract, agreeAmount: val })}
                  />
                </Form.Item>
              </Form>
            </div>
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
