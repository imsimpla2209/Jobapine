/* eslint-disable react-hooks/exhaustive-deps */
import AcceptedAlert from "Components/FreelancerComponents/AcceptedAlert";
import FindWorkFreelancerHome from "Components/FreelancerComponents/FindWorkFreelancerHome";
import LeftSidebarFreelancerHome from "Components/FreelancerComponents/LeftSidebarFreelancerHome";
import RightSidebarFreelancerHome from "Components/FreelancerComponents/RightSidebarFreelancerHome";
import SectionCenterFreelancerHome from "Components/FreelancerComponents/SectionCenterFreelancerHome";
import { useTranslation } from "react-i18next";
import { freelancerStore, userStore } from "src/Store/user.store";
import { useSubscription } from "src/libs/global-state-hook";
import Loader from "../../../Components/SharedComponents/Loader/Loader";
import "./HomeFreelancer.css";
import { Col, Row } from "antd";
import HeadOfCenterSection from "src/Components/FreelancerComponents/HeadOfCenterSection";

export default function HomeFreelancer() {

  const { i18n, t } = useTranslation(['main']);
  const lang = i18n.language;
  const user = useSubscription(userStore).state;
  const freelancer = useSubscription(freelancerStore).state;

  return (
    <div >
      {/* <div className="mx-md-5 container-fluid-sm my-lg-4 px-1 pt-1">
        {
          user?.name
            ? <div className="mx-3">
              {
                freelancer?.isProfileVerified === false &&
                <AcceptedAlert widthh="66%" />
              }
              <div className="mx-md-5"><FindWorkFreelancerHome /></div>
              <Row gutter={24} className="mx-md-4">
                <LeftSidebarFreelancerHome freelancer={freelancer} />
                <SectionCenterFreelancerHome user={freelancer} />
                <RightSidebarFreelancerHome lang={lang} user={user} freelancer={freelancer} />
              </Row>
            </div>
            : <div className="d-flex justify-content-center align-items-center" style={{ height: "90vh" }}>
              <Loader />
            </div>
        }
      </div> */}
      <div className="mx-md-5 container-fluid-sm my-lg-4 px-1 pt-1">
        {
          user?.name
            ? <div className="mx-md-4">
              {
                freelancer?.isProfileVerified === false &&
                <AcceptedAlert widthh="66%" />
              }
              
              <Row gutter={24} className="mx-md-5">
                
                <Col xs={0} lg={4} xl={17}>
                  <HeadOfCenterSection />
                  <div className="mx-md-5"><FindWorkFreelancerHome /></div>
                  {/* <LeftSidebarFreelancerHome freelancer={freelancer} /> */}
                </Col>
                <Col xs={0} lg={4} xl={7}>
                  <RightSidebarFreelancerHome lang={lang} user={user} freelancer={freelancer} />
                </Col>
              </Row>
              <Row gutter={24} className="mx-md-5">

                <SectionCenterFreelancerHome user={freelancer} />
              </Row>
            </div>
            : <div className="d-flex justify-content-center align-items-center" style={{ height: "90vh" }}>
              <Loader />
            </div>
        }
      </div>
    </div>
  );
}
