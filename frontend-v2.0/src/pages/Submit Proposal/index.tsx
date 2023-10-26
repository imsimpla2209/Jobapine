/* eslint-disable jsx-a11y/anchor-is-valid */

/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
// import { auth, db, storage } from "../../firebase";
// import firebase from 'firebase/app';
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { freelancerStore, userStore } from "src/Store/user.store";
import { getJob } from "src/api/job-apis";
import { useSubscription } from "src/libs/global-state-hook";
import SubmitProposalFixed from "../../Components/FreelancerComponents/SubmitProposalFixed";
import SubmitProposalHourly from "../../Components/FreelancerComponents/SubmitProposalHourly";
import { Button, Form, Input, Modal, Result, Space, Tag } from "antd";
import { currencyFormatter, pickName, randomDate } from "src/utils/helperFuncs";
import { EComplexityGet, EPaymenType } from "src/utils/enum";
import { DefaultUpload } from "src/Components/CommonComponents/upload/upload";
import { createProposal } from "src/api/proposal-apis";
import toast from "react-hot-toast";

const customizeRequiredMark = (label: React.ReactNode, { required }: { required: boolean }) => (
  <>
    {required ? <Tag color="error">Required</Tag> : <Tag color="warning">optional</Tag>}
    {label}
  </>
);

export default function SubmitProposal() {
  const { i18n, t } = useTranslation(['main']);
  let lang = i18n.language;
  const { id } = useParams();
  const navigate = useNavigate();
  const [jobData, setJobData] = useState(null)
  const [files, setFiles] = useState([])
  const [open, setOpen] = useState(false);
  const freelancer = useSubscription(freelancerStore).state;
  const user = useSubscription(userStore).state;
  const [isValid, setValid] = useState(true);
  const [proposalData, setproposalData] = useState({
    coverLetter: "",
    proposalImages: [],
  });
  let [rate, setrate] = useState(0);

  useEffect(() => {
    getJob(id).then(res => {
      console.log("load job, ", id);
      setJobData(res.data)
      
    })
  }, []);

  useEffect(() => {
    if (jobData?.appliedFreelancers?.includes(freelancer?._id)) {
      setValid(false)
    }
  }, [freelancer?._id, jobData])

  const normFile = (e: any) => {
    // handle event file changes in upload and dragger components
    const fileList = e
    setFiles(fileList)
    return e
  }

  const handlewithdrawProposal = async () => {
    // try {
    //   await db
    //     .collection("job")
    //     .doc(id)
    //     .collection("proposals")
    //     .where("freelancerId", "==", auth.currentUser.uid)
    //     .get()
    //     .then((res) =>
    //       res.docs.map((e) => {
    //         proposal = e.id;
    //         setProposal(proposal);
    //         db.collection("job")
    //           .doc(id)
    //           .collection("proposals")
    //           .doc(proposal)
    //           .delete();
    //         console.log(proposal);
    //       })
    //     );
    //   await db
    //     .collection("freelancer")
    //     .doc(auth.currentUser.uid)
    //     .collection("jobProposal")
    //     .where("jobId", "==", id)
    //     .get()
    //     .then((res) =>
    //       res.docs.map((e) => {
    //         freelancer = e.id;
    //         setFreelancer(freelancer);
    //         db.collection("freelancer")
    //           .doc(auth.currentUser.uid)
    //           .collection("jobProposal")
    //           .doc(freelancer)
    //           .delete();
    //         console.log(freelancer);
    //       })
    //     );
    // } catch (err) {
    //   console.log(err);
    // }
  };


  const handlVal = (e) => {
    const val = e.target.value;
    const name = e.target.name;
    const files = e.target.files;

    switch (name) {
      case "coverLetter":
        proposalData.coverLetter = val
        setproposalData({ ...proposalData, coverLetter: proposalData.coverLetter });
        break;
      case "images":
        if (files[0]) {
          proposalData.proposalImages.push('');
          setproposalData({ ...proposalData, proposalImages: proposalData.proposalImages })
        }
        break;
      default:
        break;
    }
  };
  const handleRout = () => {
    navigate("/proposals", { state: { id } })
  }

  const handleProposal = () => {
    toast.promise(
      createProposal({
        description: proposalData?.coverLetter,
        attachments: proposalData?.proposalImages || [],
        expectedAmount: rate ? (rate / 1000) : jobData?.payment?.amount,
        job: jobData?._id,
        freelancer: freelancer?._id
      }).then(res => {
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

  return (
    <>
      <main>
        <div className="container px-md-5">
          <p className="h3 py-md-2 mt-4">{t('Submit a proposal')}</p>
          <div className="row">
            <div className="bg-white border" style={{ borderRadius: 16 }}>
              <h2 className="h4 border-bottom p-4">{t("Proposal settings")}</h2>
              <div className="ps-4 pt-2">
                {/* <p className="fw-bold">Propose with a Specialized profile</p> */}
              </div>

              <div className="ps-4 py-2">
                {user.sickPoints > 2 ? <>
                  <p>
                    {t('This proposal requires')} <strong>2 Sick Points </strong>
                    <span className="upw-c-cn">
                      <i className="fas fa-question-circle" />
                    </span>
                  </p>
                  <p>
                    {t("When you submit this proposal, you'll have")}
                    <strong> {user.sickPoints - 2} Sick Points </strong>{t("remaining")}
                  </p>
                </>
                  : <p className="fw-bold text-alert">{t("You Don't Have Enough")} Sick Points</p>
                }

              </div>
            </div>
          </div>
          <div className="row mt-5">
            <div className="bg-white border" style={{ borderRadius: 16 }}>
              <h2 className="h4 border-bottom p-4">{t('Job details')}</h2>
              <div className="ps-4 pt-2 d-flex flex-md-row flex-column">
                <div className="w-75">
                  <p className="fw-bold">{jobData?.title}</p>
                  <span>
                    {
                      jobData?.createdAt ? new Date(`${jobData?.createdAt}`).toLocaleString()
                        : randomDate(new Date(2022, 0, 1), new Date()).toLocaleString()
                    }
                  </span>
                  <div className="mb-3">
                    <span className="bg-cat-cn py-1 px-2 me-3 rounded-pill">
                      <Space size={'middle'}>
                        {
                          jobData?.categories.map(c => (
                            <Link to="#" key={c?.name} className="advanced-search-link" style={{ fontWeight: 600, fontSize: 16 }}>
                              {c?.name}
                            </Link>
                          ))
                        }
                      </Space>
                    </span>
                  </div>
                  <div className="mb-3">
                    <p>{jobData?.description}</p>
                    <Link to={`/job/${id}`} className="upw-c-cn">
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
                    <p className="ps-4">{t(EComplexityGet[Number(jobData?.scope?.complexity)])}</p>
                  </div>
                  <div>
                    <span>
                      <i className="far fa-clock" />
                    </span>
                    <span className="ps-2">
                      <strong>{t("Hours to be determined")}</strong>
                    </span>
                    <p className="ps-4">{t(`${jobData?.payment?.type}`)}</p>
                  </div>
                  <div>
                    <span>
                      <i className="far fa-calendar-alt" />
                    </span>
                    <span className="ps-2">
                      <strong>{jobData?.scope?.duration} {t('days')}</strong>
                    </span>
                    <p className="ps-4">{t("Job Duration")}</p>
                  </div>
                </div>
              </div>
              <div className="mx-4 py-2 border-top pb-4">
                <p className="fw-bold">{t("Skills and experties")}</p>
                <div className="col">
                  {jobData?.reqSkills?.map((skill, index) => (
                    <Space key={index} size={0} className="me-sm-5 " wrap={true}>
                      <Button
                        key={index}
                        className="btn text-light btn-sm rounded-pill cats mx-1 my-1"
                      >
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
              <h2 className="h4 border-bottom p-4">{t("Terms")}</h2>
              <div className="ps-4 pt-2 d-flex flex-md-row flex-column">
                {
                  jobData?.payment?.type === EPaymenType.WHENDONE
                    ? <SubmitProposalFixed rate={rate} setrate={setrate} />
                    : <SubmitProposalHourly rate={rate} setrate={setrate} currentValue={jobData?.payment?.amount} />
                }


                <div className="w-25 m-3 ps-3 d-flex flex-column justify-content-center align-items-center">
                  <svg
                    width="120px"
                    role="img"
                    viewBox="0 0 145 130"
                    xmlns="http://www.w3.org/2000/svg"
                  >
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
              <h2 className="h4 border-bottom p-4">{t("Additional details")}</h2>
              <div className="ps-4 pt-2 pe-4">
                <p className="fw-bold">{t('Cover Letter')}</p>
                <textarea
                  name="coverLetter"
                  className="form-control"
                  rows={8}
                  defaultValue={""}
                  onChange={handlVal}
                />
              </div>

              <div className="ps-4 pt-2 pe-4 mt-3">
                {jobData?.questions?.length && <>
                  <p className="fw-bold">{t("Fast Client's Questions")}</p>
                  {jobData?.questions?.map(question => (
                    <Form.Item label={question + "?"} key={question} required tooltip={t('You need to answer this question')}>
                      <Input placeholder="" />
                    </Form.Item>
                  ))}
                </>}
              </div>

              <div className="mx-4 mt-3 py-2 pb-4">
                <p className="fw-bold">{t("Attachments")}</p>
                <div className="d-flex mb-3">
                  {
                    proposalData?.proposalImages?.length > 0 &&
                    <div className="bg-white py-lg-4 px-4 border border-1 row pb-sm-3 py-xs-5">
                      <h5 className="fw-bold my-4">Images</h5>
                      <div className="col">
                        {proposalData?.proposalImages?.map((img, index) => (
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
                      className="btn shadow-none text-white"
                      onClick={() => handleProposal()}
                      style={{ backgroundColor: "#5b14b8" }}
                    >
                      {t("Submit Proposal")}
                    </button>
                    <button className="btn shadow-none upw-c-cn">{t("Cancel")}</button>
                  </> : <>
                    <Result
                      title={`${t("You already applied for this Job")} ${t("OR")} ${t("You are Blocked from this one")}`}
                      extra={
                        <Link to={`/proposals`} type="primary" key="console">
                          {t("Review proposal")}
                        </Link>
                      }
                    />
                  </>
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
                          <p className="fw-bold" style={{ fontSize: 19 }}>{jobData?.title}</p>
                          <div className="mb-3">
                            <span className="bg-cat-cn py-1 px-2 rounded-pill">
                              <Space size={'middle'}>
                                {
                                  jobData?.categories.map(c => (
                                    <Link to="#" key={c?.name} className="advanced-search-link" style={{ fontWeight: 600, fontSize: 16 }}>
                                      {c?.name}
                                    </Link>
                                  ))
                                }
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
                            <p className="ps-4">
                              {t(EComplexityGet[Number(jobData?.scope?.complexity)])}
                            </p>
                          </div>
                          <div>
                            <span>
                              <i className="far fa-clock" />
                            </span>
                            <span className="ps-2">
                              <strong>{t("Hours to be determined")}</strong>
                            </span>
                            <p className="ps-4">{t(`${jobData?.payment?.type}`)}</p>
                          </div>
                          <div>
                            <span>
                              <i className="far fa-calendar-alt" />
                            </span>
                            <span className="ps-2">
                              <strong>{jobData?.scope?.duration} {t('days')}</strong>
                            </span>
                            <p className="ps-4">{t("Job Duration")}</p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <p className="fw-bold">{t("Cover Letter")}</p>
                        <div className="mb-3">
                          <p>{proposalData.coverLetter}</p>
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
                      <button
                        type="button"
                        style={{ background: '#56889c' }}
                        className="btn rounded text-white"
                        data-bs-dismiss="modal"
                        onClick={handlewithdrawProposal}
                      >
                        {t("WithDraw proposal")}
                      </button>
                      <button
                        onClick={handleRout}
                        className="btn bg-jobsicker"
                        type="button"
                      >
                        {t("Save changes")}
                      </button>
                    </div>
                  </div>
                </Modal>
              </div>
            </div>
          </div>
        </div>
      </main >
    </>
  );
}
