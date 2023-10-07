/* eslint-disable react-hooks/exhaustive-deps */
import AcceptedAlert from "Components/FreelancerComponents/AcceptedAlert";
import FindWorkFreelancerHome from "Components/FreelancerComponents/FindWorkFreelancerHome";
import LeftSidebarFreelancerHome from "Components/FreelancerComponents/LeftSidebarFreelancerHome";
import RightSidebarFreelancerHome from "Components/FreelancerComponents/RightSidebarFreelancerHome";
import SectionCenterFreelancerHome from "Components/FreelancerComponents/SectionCenterFreelancerHome";
import { fakeFreelancerState } from "Store/fake-state";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import Loader from "../../../Components/SharedComponents/Loader/Loader";
import "./HomeFreelancer.css";

export default function HomeFreelancer() {

  const { i18n, t } = useTranslation(['main']);
  let lang = i18n.language;
  const user = fakeFreelancerState;

  useEffect(() => {
    // dispatch(freelancerDataAction(user));
  }, [lang]);

  return (
    <div dir={lang === 'vi' ? 'rtl' : 'ltr'} >
      <div className="container-md container-fluid-sm my-lg-4 px-3 pt-1">
        {
          user.firstName
            ? <div className="mx-3">
              {
                user.accepted === false &&
                <AcceptedAlert widthh="66%" />
              }
              <FindWorkFreelancerHome />
              <div className="row">
                <LeftSidebarFreelancerHome />
                <SectionCenterFreelancerHome />
                <RightSidebarFreelancerHome lang={lang} />
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
