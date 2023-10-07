/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/alt-text */
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import img from "../../../assets/img/icon-user.svg";
import ReviewProposalsPageHeader from "./../ReviewProposalsPageHeader";
import { Link } from "react-router-dom";
import Loader from './../../SharedComponents/Loader/Loader';

export default function ReviewProposalsCard() {

  const { id } = useParams();
  const [proposals, setProposals] = useState([]);
  const [freelancer, setFreelancer] = useState([]);

  useEffect(() => {
    const arr = []
    // db.collection("job")
    //   .doc(id)
    //   .collection("proposals")
    //   .get().then(res => {
    //     res.docs.map(async proposal => {
    //       if (proposal.exists) {
    //         console.log(proposal.data().freelancerId);
    //         proposals.push(proposal.data());
    //         await db.collection("freelancer")
    //           .doc(proposal.data().freelancerId)
    //           .get()
    //           .then(doc => {
    //             if (doc.exists) {
    //               arr.push(doc.data());
    //               console.log(doc.data())
    //               setFreelancer([...arr]);
    //             }
    //           });
    //       }
    //     });
    //     setProposals([...proposals]);
    //   });
  }, []);

  const sendMSG = freelancerDocID => {
    console.log(freelancerDocID);
  };

  return (
    <>
      <ReviewProposalsPageHeader proposals={proposals.length} />
      {console.log(freelancer[0])}
      {
        proposals.length > 0
          ?
          proposals.map((proposal, index) => {
            return (
              freelancer[index]
                ?
                <div className="row border bg-white border-1 ms-0 pt-2" key={index}>
                  <div className="col-1 pt-lg-3">
                    <img
                      className="circle"
                      src={
                        freelancer[index]?.profilePhoto
                          ? freelancer[index]?.profilePhoto
                          : img
                      }
                      style={{ width: "70px", height: "70px" }}
                    />
                  </div>
                  <div className="col-lg-6 pt-lg-3 ">
                    <Link
                      to={`/freelancer-profile/${freelancer[index]?.authID}`}
                      id="job-title-home-page "
                      className="link-dark job-title-hover fw-bold text-success"
                    >
                      {freelancer[index]?.firstName +
                        " " +
                        freelancer[index]?.lastName[0].toUpperCase() +
                        "."}
                    </Link>
                    <p id="job-title-home-page" className="link-dark my-1">
                      <span className="text-muted">Title: </span>
                      <span className="fw-bold">{freelancer[index]?.title}</span>
                    </p>
                    <p>
                      <span className="text-muted">Country: </span>
                      <span className="fw-bold">{freelancer[index]?.location?.country}</span>

                    </p>
                    <div className="row py-3">
                      <div className="col">
                        <span className="text-muted">
                          Hourly Rate:
                      </span>
                        <span className="fw-bold"> {freelancer[index]?.hourlyRate} /hr</span>
                      </div>
                      <div className="col">
                        <span className="text-muted">earned: </span>
                        <span className="fw-bold">
                          {freelancer[index]?.totalEarnings}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col py-3">
                    <div className="btn-group float-end "></div>
                    <div className="btn-group float-start">
                      <ul className="dropdown-menu ">
                        <li>
                          <a className="dropdown-item" href="#">
                            Candidate will not be notified
                              </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="col py-3">
                    <Link
                      to={''}
                      className="btn bg-white btn-outline-secondary"
                      onClick={() => sendMSG(freelancer[index]?.authID)}
                    >
                      <span className="text-success fw-bold">Messages</span>
                    </Link>
                  </div>
                  <div className="col py-3">
                    <Link
                      type="button"
                      className="btn bg-jobsicker px-5"
                      to={''}
                    >
                      Hire
                        </Link>
                  </div>
                  <div className="col-lg-1 pt-lg-3"></div>
                  <div className="col-lg-10 pt-lg-3 mx-3">
                    <p>
                      <span className="text-muted">Specialized in:</span>
                      <span className="fw-bold"> {freelancer[index]?.jobCategory}</span>
                    </p>
                    <p>
                      <span className="text-muted">Proposed bid:</span>
                      <span className="fw-bold"> {proposal?.budget}</span>
                    </p>
                    <p id="Cover-Letter">
                      <span className="text-muted">Cover Letter - </span>
                      <span className="fw-bold">{proposal.coverLetter}</span>
                    </p>
                  </div>
                </div>
                :
                index === 0 && <Loader />
            )
          })

          :
          <div className="row border bg-white border-1 ms-0 py-3">
            <p className="text-muted text-center h1">No proposals</p>
          </div>
      }
    </>
  );
}
