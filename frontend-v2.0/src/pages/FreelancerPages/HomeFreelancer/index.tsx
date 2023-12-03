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

export default function HomeFreelancer() {

  const { i18n, t } = useTranslation(['main']);
  const lang = i18n.language;
  const user = useSubscription(userStore).state;
  const freelancer = useSubscription(freelancerStore).state;

  return (
    <div >
      <div className="container-xxl container-fluid-sm my-lg-4 px-1 pt-1">
        {
          user?.name
            ? <div className="mx-3">
              {
                freelancer?.isProfileVerified === false &&
                <AcceptedAlert widthh="66%" />
              }
              <FindWorkFreelancerHome />
              <div className="row gx-2">
                <LeftSidebarFreelancerHome freelancer={freelancer} />
                <SectionCenterFreelancerHome user={freelancer} />
                <RightSidebarFreelancerHome lang={lang} user={user} freelancer={freelancer} />
              </div>
            </div>
            : <div className="d-flex justify-content-center align-items-center" style={{ height: "90vh" }}>
              <Loader />
            </div>
        }
      </div>
    </div>
  );
}
