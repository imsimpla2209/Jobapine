/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */

import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { userStore } from "src/Store/user.store";
import { logout } from "src/api/auth-apis";
import { useSubscription } from "src/libs/global-state-hook";
import img from "../../../assets/img/icon-user.svg";
import LanguageList from "../../SharedComponents/LanguageBtn/LanguageList";


export default function NavLargScreen() {

  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { i18n, t } = useTranslation(['main']);
  const lang = i18n.language;
  const user = useSubscription(userStore).state;

  const handleLogout = () => {
    logout().then((res) => {
      console.log(res);
      navigate("/login");
      window.location.reload();
      localStorage.removeItem('userType');
      localStorage.removeItem('expiredIn');
      toast.success('Bye', {
        icon: '👋'
      })
    })
      .catch((error) => {
        console.log(error.message);
      });
  }

  return (
    <>
      <div className="navbar-expand" id="navbarNav-id">
        <ul className="navbar-nav align-items-center">
          <li className="nav-item hov-cn ">
            <NavLink
              className={
                `nav-link
                ${pathname === "/saved-jobs" || pathname === "/proposals" ? "active" : ""}`
              }

              to="/find-work"
            >
              {t("FindWork")}
            </NavLink>
            <ul className={`dropdown-menu findWork-cn`} style={{ marginTop: "-8px" }}>
              <div className="nav-dd-cn"></div>
              <li>
                <Link className={`dropdown-item  `} to="/find-work">
                  {t("FindWork")}
                </Link>
              </li>
              <li>
                <Link className={`dropdown-item  `} to="/saved-jobs">
                  {t("Saved Jobs")}
                </Link>
              </li>
              <li>
                <Link className={`dropdown-item  `} to="/proposals">
                  {t("Proposals")}
                </Link>
              </li>
              <li>
                <Link className={`dropdown-item  `} to={`/profile/$42000`}>
                  {t("Profile")}
                </Link>
              </li>
              {/* <li>
                <Link className="dropdown-item" to="/my-stats">
                  My Stats
                </Link>
              </li> */}
            </ul>
          </li>
          <li className="nav-item hov-cn mx-3">
            <NavLink
              className={
                `nav-link
                
                ${pathname === "/all-contract" || pathname === "/offers" ? "active" : ""}`
              }

              to="/my-jobs"
            >
              {t("My Jobs")}
            </NavLink>
            <ul className={`dropdown-menu myJobs-cn`} style={{ marginTop: "-8px" }}>
              <div className="nav-dd-cn"></div>
              <li>
                <Link className={`dropdown-item  `} to="/my-jobs">
                  {t("My Jobs")}
                </Link>
              </li>
              <li>
                <Link className={`dropdown-item  `} to="/all-contract">
                  {t("Contracts")}
                </Link>
              </li>
              <li>
                <Link className={`dropdown-item  `} to="/offers">
                  {t("Offers")}
                </Link>
              </li>
            </ul>
          </li>
          <li className="nav-item hov-cn">
            <NavLink className={`nav-link reports-cn `}

              to="/overview">
              {t("My Reports")}
            </NavLink>
            <ul className={`dropdown-menu Reports-cn`} style={{ marginTop: "-8px" }}>
              <div className="nav-dd-cn"></div>
              <li>
                <Link className={`dropdown-item  `} to="/overview">
                  {t("Overview")}
                </Link>
              </li>
              {/* <li>
                <Link className={`dropdown-item  `} to="/my-reports">
                  {t("My Reports")}
                </Link>
              </li> */}
              <li>
                <Link className={`dropdown-item  `} to="/life-time-billing">
                  {t("Lifetime Billings by Client")}
                </Link>
              </li>
              {/* <li>
                <Link className={`dropdown-item  `} to="/connects-history">
                  {t("Connects History")}
                </Link>
              </li> */}
              {/* <li>
                <Link className={`dropdown-item  `} to="/transaction-history">
                  {t("Transaction History")}
                </Link>
              </li> */}
              {/* <li><a className="dropdown-item" href="#">Certificate of Earnings</a></li> */}
            </ul>
          </li>
          {/* <li className="nav-item me-5">
            <NavLink className={`nav-link  `} to="/messages">
              {t("Messages")}
            </NavLink>
          </li> */}
          {/* <li className="nav-item">
            <a className="nav-link" href="#">
              <i className="fas fa-question fs-5"></i>
            </a>
          </li> */}
          <li className="nav-item ms-5 me-3">
            <NavLink className="nav-link" to="/messages">
              <i
                className="far fa-paper-plane fs-5"
                style={{ transform: "scaleX(-1)" }}
              ></i>
            </NavLink>
          </li>
          <li className="nav-item me-2">
            <NavLink to="/notifications" className="nav-link">
              <i className="far fa-bell fs-5"></i>
            </NavLink>
          </li>
          <li className="ms-1 me-3">
            <LanguageList />
          </li>
          <li className="dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="navbarDropdownMenuLink"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <img style={{ height: "40px", width: "40px", border: '1px solid #ccc' }} className="rounded-circle bg-white" src={user.avatar ? user.avatar : img} alt="" />
              </a>
            <ul
              style={{
                border: '1px solid #ccc'
              }}
              id="acc-id"
              className="dropdown-menu shadow"
              aria-labelledby="navbarDropdownMenuLink"
            >
              <div className="nav-dd-acc-cn"></div>
              <li className="px-4 py-3">
                <div
                  id="acc-btns-id"
                  className="btn-group w-100"
                  role="group"
                  aria-label="Basic example"
                >
                  <button type="button" className={`btn ${lang === 'vi' && "fs-5 "}`}>
                    {t("Online")}
                  </button>
                  <span style={{ padding: "0 1px" }}></span>
                  <button type="button" className={`btn invisible-cn `} >
                    {t("Invisible")}
                  </button>
                </div>
              </li>
              <li>
                <NavLink className={`dropdown-item px-4 ${lang === 'vi' && "text-end"}`} to="/find-work">
                  <div className="d-flex align-items-center">
                    <span style={{ marginLeft: "-5px" }}>
                      <img style={{ height: "30px", width: "30px" }} className="rounded-circle bg-white" src={user.avatar ? user.avatar : img} alt="" />
                    </span>
                    <div className="acc-cn ms-2">
                      <p className={``} >{user?.name}</p>
                      <p className={``} >{t("Freelancer")}</p>
                    </div>
                  </div>
                </NavLink>
              </li>
              <li>
                <NavLink
                  className={`dropdown-item px-4 mb-1 ${lang === 'vi' && "text-end"}`}
                  to="/home"
                >
                  <div className="d-flex align-items-center">
                    <span style={{ marginLeft: "-5px" }}>
                      <i className={`fa fa-user-circle fs-3 ${lang === 'vi' && "px-3"}`}></i>
                    </span>
                    <div className="acc-cn ms-2">
                      <p className={``} >{t("Name")}</p>
                      <p className={``} >{t("Client")}</p>
                    </div>
                  </div>
                </NavLink>
              </li>
              <li>
                <Link className={`dropdown-item px-4 ${lang === 'vi' && "fs-6 text-end"}`} to="settings">
                  <span>
                    <i className={`fa fa-cog ${lang === 'vi' && "px-3 fs-5"}`}></i>
                  </span>
                  <span className="ps-2">{t("Settings")}</span>
                </Link>
              </li>
              <li>
                <button className={`dropdown-item px-4 ${lang === 'vi' && "fs-6 text-end"}`} onClick={handleLogout}>
                  <span>
                    <i className={`fas fa-sign-out-alt ${lang === 'vi' && "px-3 fs-5"}`}></i>
                  </span>
                  <span className="ps-2">{t("Log Out")}</span>
                </button>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </>
  );
}
