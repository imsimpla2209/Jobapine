import { Button, Form, Input, Modal, Popconfirm, Result, Space } from "antd";
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { DefaultUpload } from "src/Components/CommonComponents/upload/upload";
import { updateProposal, withdrawProposal } from 'src/api/proposal-apis';
import { EComplexityGet, EPaymenType, EStatus } from "src/utils/enum";
import acceptimg from '../../../assets/img/accept.png';
import archiveimg from '../../../assets/img/archive.png';
import pendingimg from '../../../assets/img/pending.png';
import rejectimg from '../../../assets/img/reject.png';
import SubmitProposalFixed from "../SubmitProposalFixed";
import SubmitProposalHourly from "../SubmitProposalHourly";
import { Link } from "react-router-dom";
import { currencyFormatter, randomDate } from "src/utils/helperFuncs";
import RBModal from 'react-bootstrap/Modal';
import FileDisplay from "src/pages/ForumPages/ideas/idea-detail/file-display";

const ProposalDetail = ({ proposal, user, onRefresh }) => {
  const [files, setFiles] = useState([])
  const [isValid, setValid] = useState(true);
  const [answer, setAnswer] = useState<Record<number, string>>({});
  const [open, setOpen] = useState(false);
  const [rate, setrate] = useState(proposal?.expectedAmount || 0);
  const { t, i18n } = useTranslation(['main'])

  const [proposalData, setproposalData] = useState({
    coverLetter: proposal?.description || '',
    proposalImages: [],
  });

  const handlVal = (e) => {
    const val = e.target.value;
    const name = e.target.name;
    const files = e.target.files;

    switch (name) {
      case "coverLetter":
        proposal.coverLetter = val
        setproposalData({ ...proposal, coverLetter: proposal.coverLetter });
        break;
      case "images":
        if (files[0]) {
          proposal.proposalImages.push('');
          setproposalData({ ...proposal, proposalImages: proposal.proposalImages })
        }
        break;
      default:
        break;
    }
  };

  const handleProposal = () => {
    if (proposal?.job?.questions?.length) {
      if (proposal?.job?.questions?.length !== Object.keys(answer)?.length) {
        return toast.error(t('You need to answer this question'))
      }
    }
    if (!proposalData?.coverLetter || proposalData?.coverLetter?.length < 8) {
      return toast.error(t("You need to put some description of your Proposals"))
    }
    toast.promise(
      updateProposal({
        description: proposalData?.coverLetter,
        attachments: proposalData?.proposalImages || [],
        expectedAmount: rate ? (rate / 1000) : proposal?.job?.payment?.amount,
        answers: answer
      }, proposal._id).then(res => {
        setOpen(true)
        setValid(false)
      }).catch(err => {
        console.log('Err', err)
      }),
      {
        loading: 'Submiting...',
        success: <b>Submited!</b>,
        error: <b>Could not Submit.</b>,
      }
    );
  };

  const handlewithdrawProposal = async () => {
    withdrawProposal(proposal._id).then((res) => {
      onRefresh()
    })
  };


  const normFile = (e: any) => {
    // handle event file changes in upload and dragger components
    const fileList = e
    setFiles(fileList)
    return e
  }

  return (
    <main>
      <div className="container px-md-5">
        <p className="h3 py-md-2 mt-4">{t("Submitted proposals")}</p>
        <div className="row">
          <div className="bg-white border" style={{ borderRadius: 16 }}>
            {proposal?.currentStatus === EStatus.ACCEPTED && (
              <img src={acceptimg} alt="ok" style={{
                position: 'absolute',
                top: 24,
                height: 64,
                right: 36,
                zIndex: 10,
              }} />
            )}
            {proposal?.currentStatus === EStatus.REJECTED && (
              <img src={rejectimg} alt="ok" style={{
                position: 'absolute',
                top: 24,
                height: 64,
                right: 36,
                zIndex: 10,
              }} />
            )}
            {proposal?.currentStatus === EStatus.PENDING && (
              <img src={pendingimg} alt="ok" style={{
                position: 'absolute',
                top: 24,
                height: 64,
                right: 36,
                zIndex: 10,
              }} />
            )}
            {proposal?.currentStatus === EStatus.ARCHIVE && (
              <img src={archiveimg} alt="ok" style={{
                position: 'absolute',
                top: 24,
                height: 64,
                right: 36,
                zIndex: 10,
              }} />
            )}
            {proposal?.currentStatus === EStatus.ARCHIVE && (
              <img src={archiveimg} alt="ok" style={{
                position: 'absolute',
                top: 24,
                height: 64,
                right: 36,
                zIndex: 10,
              }} />
            )}
            {
              (proposal?.currentStatus === EStatus.PENDING || proposal?.currentStatus === EStatus.INPROGRESS) ?
                <>
                  <h2 className="h4 border-bottom p-4">{t("Update Proposal settings")}</h2>
                  <div className="ps-4 pt-2">
                    <p className="fw-bold">Propose with a Specialized profile</p>
                  </div>

                  <div className="ps-4 py-2">
                    {user.sickPoints > 2 ? <>
                      <p>
                        {t('This proposal requires')} <strong>1 Sick Points </strong>
                        <span className="upw-c-cn">
                          <i className="fas fa-question-circle" />
                        </span>
                      </p>
                      <p>
                        {t("When you submit this proposal, you'll have")}
                        <strong> {user.sickPoints - 1} Sick Points </strong>{t("remaining")}
                      </p>
                    </>
                      : <p className="fw-bold text-alert">{t("You Don't Have Enough")} Sick Points</p>
                    }

                  </div>
                </>
                : <>
                  <h2 className="h4 border-bottom p-4">{t("This Proposal has been accepted")}</h2>
                  <div className="ps-4 pt-2">
                    <p className="fw-bold">Please wait or connect to client about next process </p>
                  </div>
                </>}
          </div>
        </div>
        <div className="row mt-5">
          <div className="bg-white border" style={{ borderRadius: 16 }}>
            <h2 className="h4 border-bottom p-4">{t('Job details')}</h2>
            <div className="ps-4 pt-2 d-flex flex-md-row flex-column">
              <div className="w-75">
                <p className="fw-bold">{proposal?.job?.title}</p>
                <span>
                  {
                    proposal?.job?.createdAt ? new Date(`${proposal?.job?.createdAt}`).toLocaleString()
                      : randomDate(new Date(2022, 0, 1), new Date()).toLocaleString()
                  }
                </span>
                <div className="mb-3">
                  <span className="bg-cat-cn py-1 px-2 me-3 rounded-pill">
                    <Space size={'middle'}>
                      {
                        proposal?.job?.categories?.map(c => (
                          <Link to="#" key={c?.name} className="advanced-search-link" style={{ fontWeight: 600, fontSize: 16 }}>
                            {c?.name}
                          </Link>
                        ))
                      }
                    </Space>
                  </span>
                </div>
                <div className="mb-3">
                  <p>{proposal?.job?.description}</p>
                  <Link to={`/job/${proposal?.job?._id}`} className="upw-c-cn">
                    {t("View job posting")}
                  </Link>
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
                  <p className="ps-4">{t(EComplexityGet[Number(proposal?.job?.scope?.complexity)])}</p>
                </div>
                <div>
                  <span>
                    <i className="far fa-clock" />
                  </span>
                  <span className="ps-2">
                    <strong>{t("Hours to be determined")}</strong>
                  </span>
                  <p className="ps-4">{t(`${proposal?.job?.payment?.type}`)}</p>
                </div>
                <div>
                  <span>
                    <i className="far fa-calendar-alt" />
                  </span>
                  <span className="ps-2">
                    <strong>{proposal?.job?.scope?.duration} {t('days')}</strong>
                  </span>
                  <p className="ps-4">{t("Job Duration")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row mt-5">
          {/* <div className="col"> */}
          <div className="bg-white border" style={{
            borderRadius: 16,
            pointerEvents: (proposal?.currentStatus === EStatus.PENDING || proposal?.currentStatus === EStatus.INPROGRESS) ? 'auto' : 'none',
          }}>
            {
              (proposal?.currentStatus === EStatus.PENDING || proposal?.currentStatus === EStatus.INPROGRESS) ? <>
                <h2 className="h4 border-bottom p-4">{t("Terms")}</h2>
                <div className="ps-4 pt-2 d-flex flex-md-row flex-column">
                  {
                    proposal?.job?.payment?.type === EPaymenType.WHENDONE
                      ? <SubmitProposalFixed rate={rate} setrate={setrate} />
                      : <SubmitProposalHourly rate={rate} setrate={setrate} currentValue={proposal?.job?.payment?.amount} />
                  }
                </div>
              </> : <>
                <div className="ps-4 pt-2 pe-4 mb-4">
                  <p className="fw-bold">{t('Cover Letter')}</p>
                  <textarea
                    name="coverLetter"
                    className="form-control"
                    rows={8}
                    defaultValue={proposal?.description || ''}
                    onChange={handlVal}
                  />
                </div>
                <p className="fw-bold">{t("Attachments")}</p>
                <div className="d-flex mb-3">
                  {
                    proposal?.proposalImages?.length > 0 &&
                    <div className="bg-white py-lg-4 px-4 border border-1 row pb-sm-3 py-xs-5">
                      <h5 className="fw-bold my-4">Images</h5>
                      <div className="col">
                        {proposal?.proposalImages?.map((img, index) => (
                          <p key={index}><a
                            target="_blank"
                            href={img}
                            className=" mx-1"
                            // style={{ backgroundColor: "#9b9d9f" }}
                            key={index} rel="noreferrer"
                          >
                            {img}
                          </a></p>
                        ))}
                      </div>
                    </div>
                  }
                  {
                    rate && <div>
                      <p className="fw-bold">{t("Hourly Rate")}</p>
                      <div className="mb-3">
                        <p>{currencyFormatter(rate)}</p>
                      </div>
                    </div>
                  }
                </div>
              </>
            }

          </div>

        </div>
        <div className="row mt-5 pb-5" style={{


        }}>
          {
            (proposal?.currentStatus === EStatus.PENDING || proposal?.currentStatus === EStatus.INPROGRESS)
            && <div className="bg-white border" style={{ borderRadius: 16 }}>
              <h2 className="h4 border-bottom p-4">{t("Additional details")}</h2>
              <div className="ps-4 pt-2 pe-4">
                <p className="fw-bold">{t('Cover Letter')}</p>
                <textarea
                  name="coverLetter"
                  className="form-control"
                  rows={8}
                  defaultValue={proposal?.description || ''}
                  onChange={handlVal}
                />
              </div>

              <div className="ps-4 pt-2 pe-4 mt-3">
                {proposal?.job?.questions?.length && <>
                  <p className="fw-bold">{t("Fast Client's Questions")}</p>
                  {proposal?.job?.questions?.map((question, ix) => (
                    <Form.Item label={question + "?"} key={question} required tooltip={t('You need to answer this question')}>
                      <Input defaultValue={proposal?.answers?.[ix]} placeholder={t('You need to answer this question')}
                        onChange={(e: any) => {
                          setAnswer({ ...answer, [ix]: e.target.value })
                        }} />
                    </Form.Item>
                  ))}
                </>}
              </div>

              <div className="mx-4 mt-3 py-2 pb-4">
                <p className="fw-bold">{t("Attachments")}</p>
                <div className="d-flex mb-3">
                  {
                    proposal?.proposalImages?.length > 0 &&
                    <div className="bg-white py-lg-4 px-4 border border-1 row pb-sm-3 py-xs-5">
                      <h5 className="fw-bold my-4">Images</h5>
                      <div className="col">
                        {proposal?.proposalImages?.map((img, index) => (
                          <p key={index}><a
                            target="_blank"
                            href={img}
                            className=" mx-1"
                            // style={{ backgroundColor: "#9b9d9f" }}
                            key={index} rel="noreferrer"
                          >
                            {img}
                          </a></p>
                        ))}
                      </div>
                    </div>}
                </div>

                <div className="mb-3">
                  {
                    proposal?.attachments?.length > 0 &&
                    <div className="bg-white py-lg-4 px-4 border border-1 pb-sm-3 py-xs-5" style={{ width: '100%' }}>
                      <h5 className="fw-bold my-4">Attachments</h5>
                      <FileDisplay files={proposal?.attachments}></FileDisplay>
                    </div>}
                </div>

                <div className="attachments-cn">
                  <p className="pt-2 px-5 text-center">
                    drag or{" "}
                    <label
                      htmlFor="file"
                      className="upw-c-cn me-1"
                      style={{ cursor: "pointer" }}
                    >
                      {t("upload")}
                    </label>
                    {t("Additional project files (optional)")}
                    <DefaultUpload normFile={normFile} files={files}></DefaultUpload>

                  </p>
                </div>
                <p className="my-3">
                  {t("You may attach up to 10 files under the size of")}{" "}
                  <strong>25MB</strong> {t(`each. Include work samples or other documents to support your application. Do not attach your résumé — your JobSickers profile is automatically forwarded tothe client with your proposal.`)}
                </p>
              </div>
              <div className="border-top ps-4 py-4">
                {
                  isValid ? <>
                    <button
                      className="btn shadow-none text-white me-2"
                      onClick={() => handleProposal()}
                      style={{ backgroundColor: "#5b14b8" }}
                    >
                      {t("Update Proposal")}
                    </button>
                    <Popconfirm
                      title={t("WithDraw proposal")}
                      description={t("When you withdraw this proposal, you will be re-charged 1 sickpoint. But in next time re-submit this proposals, maybe your oppotunity is gone")}
                      onConfirm={handlewithdrawProposal}
                      okText={t("Accept")}
                      cancelText="No"
                    >
                      <button
                        type="button"
                        style={{ background: '#56889c' }}
                        className="btn rounded text-white"
                      >
                        {t("WithDraw proposal")}
                      </button>
                    </Popconfirm>
                  </> : <Result
                    title={`${t("You already applied for this Job")} ${t("OR")} ${t("You are Blocked from this one")}`}
                    extra={
                      <Link to={`/proposals`} type="primary" key="console">
                        {t("Review proposal")}
                      </Link>
                    }
                  />
                }

                <Modal
                  open={open}
                  footer={null}
                  className="w-100 w-md-75"
                >
                  <div >
                    <div className="">
                      <h5 className="">
                        {t("Review proposal")}
                      </h5>
                      <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                        onClick={() => setOpen(false)}
                      ></button>
                    </div>
                    <div className="">
                      <div className="pt-2">
                        <div className="w-75">
                          <p className="fw-bold" style={{ fontSize: 19 }}>{proposal?.job?.title}</p>
                          <div className="mb-3">
                            <span className="bg-cat-cn py-1 px-2 rounded-pill">
                              <Space size={'middle'}>
                                {
                                  proposal?.job?.categories?.map(c => (
                                    <Link to="#" key={c?.name} className="advanced-search-link" style={{ fontWeight: 600, fontSize: 16 }}>
                                      {c?.name}
                                    </Link>
                                  ))
                                }
                              </Space>
                            </span>
                          </div>
                          <div className="mb-3">
                            <p>{proposal?.job?.description}</p>
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
                            <p className="ps-4">
                              {t(EComplexityGet[Number(proposal?.job?.scope?.complexity)])}
                            </p>
                          </div>
                          <div>
                            <span>
                              <i className="far fa-clock" />
                            </span>
                            <span className="ps-2">
                              <strong>{t("Hours to be determined")}</strong>
                            </span>
                            <p className="ps-4">{t(`${proposal?.job?.payment?.type}`)}</p>
                          </div>
                          <div>
                            <span>
                              <i className="far fa-calendar-alt" />
                            </span>
                            <span className="ps-2">
                              <strong>{proposal?.job?.scope?.duration} {t('days')}</strong>
                            </span>
                            <p className="ps-4">{t("Job Duration")}</p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <p className="fw-bold">{t("Cover Letter")}</p>
                        <div className="mb-3">
                          <p>{proposal.coverLetter}</p>
                        </div>
                      </div>
                      {
                        rate && <div>
                          <p className="fw-bold">{t("Hourly Rate")}</p>
                          <div className="mb-3">
                            <p>{currencyFormatter(rate)}</p>
                          </div>
                        </div>
                      }
                    </div>
                    <div className="modal-footer">
                      <Popconfirm
                        title={t("WithDraw proposal")}
                        description={t("When you withdraw this proposal, you will be re-charged 1 sickpoint. But in next time re-submit this proposals, maybe your oppotunity is gone")}
                        onConfirm={handlewithdrawProposal}
                        okText={t("Accept")}
                        cancelText="No"
                      >
                        <button
                          type="button"
                          data-bs-dismiss="modal"
                          style={{ background: '#56889c' }}
                          className="btn rounded text-white"
                        >
                          {t("WithDraw proposal")}
                        </button>
                      </Popconfirm>
                    </div>
                  </div>
                </Modal>
              </div>
            </div>
          }
        </div>
      </div>
    </main >
  )
}


export default ProposalDetail