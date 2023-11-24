/* eslint-disable jsx-a11y/anchor-is-valid */

/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import img from "../../../assets/img/icon-user.svg";
import { Progress } from "antd";
import { FormOutlined } from "@ant-design/icons";

export default function RightSidebarFreelancerHome({ lang, user, freelancer }) {

  const { t } = useTranslation(['main']);

  useEffect(() => {

  }, []);

  return (
    <div className="col d-none d-lg-block" style={{ width: '300' }}>
      <div style={{
        background: 'white',
        border: '1.4px solid #ccc',
        height: 'auto',
        borderRadius: '12px',
        padding: 8,
        width: '100%',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
        }}>
          <img
            src={user?.avatar ? user?.avatar : img}
            alt=""
            className="rounded-circle d-inline border"
            width="50px"
            height="50px"
          />
          <h5 className="d-inline ps-1 text-wrap" style={{
            wordBreak: 'break-all'
          }}>{`@${user.name}.`}</h5>
        </div>
        <div className="my-lg-1 text-center">
          <Link to={`/profile/me`} className="advanced-search-link">
            <i className="fas fa-eye"> </i> {t("View Profile")}
          </Link>
        </div>
        {/* <div className="my-lg-1 fw-bold">
        <p>{t("Visibility")}</p>
      </div>
      <div className="my-lg-1 ">
        <i className="fas fa-globe"> </i>
        <span> {t("Public")}</span>

      </div> */}
        <div style={{
          marginTop: 16
        }}>
          <Link to={`/create-profile`} className="advanced-search-link">
            <FormOutlined /><span> {t("CompleteProfile")}</span>
          </Link>

        </div>
        <div style={{ height: 'auto', display: "inline" }}>
          <Progress percent={freelancer?.profileCompletion || 0} status="active" strokeColor={{ from: '#803ade', to: '#fc2389' }} />
        </div>
      </div>
      <div style={{
        background: '#fdf5ff',
        border: '1.4px solid #ccc',
        height: 'auto',
        borderRadius: '12px',
        padding: 8,
        width: '100%',
        marginTop: 24,

      }}>
        <div className="mt-lg-1">
          <p className="text-muted" style={{ margin: 0 }}>{t("Availability")}</p>
        </div>
        <div className="mb-lg-1">
          <i className="far fa-clock me-2 mb-3" />
          <span>
            {lang === 'vi' ? freelancer?.available ? "đang rảnh" : "éo rảnh lắm" : freelancer?.available ? "available" : "not available"}
          </span>
        </div>
        <h5 className="mb-lg-2 display-inline-block ">Proposals</h5>
        <ul
          className="list-group sidebar-homebage-ul mb-lg-3 d-lg-block"
          style={{ fontSize: "0.9em" }}
        >
          <li
            className="list-group-item sidebar-homebage-ul-li "
            aria-current="true"
          >
            <Link
              to={`/proposals`}
              className=" list-group-item-action advanced-search-link"
              aria-current="true"
            >
              {freelancer?.proposals?.length} {t('NumberofProposals')}
            </Link>
          </li>
        </ul>
        <h5 className="display-inline-block lh-1">Sick Points</h5>
        <ul
          className="list-group sidebar-homebage-ul mb-lg-3 d-lg-block"
          style={{ fontSize: "0.9em" }}
        >
          <li
            className="list-group-item sidebar-homebage-ul-li"
            aria-current="true"
          >
            <a
              href="#"
              className=" list-group-item-action advanced-search-link"
              aria-current="true"
            >
              {t("AvalableSicks")}: {user.sickPoints}
            </a>

          </li>
          <li
            className="list-group-item sidebar-homebage-ul-li"
            aria-current="true"
          >
            <a
              href="#"
              className=" list-group-item-action advanced-search-link border border-secondary p-1 rounded"
              aria-current="true"
            >
              {t("Buy SickPoints")}
            </a>

          </li>
        </ul>
      </div>
    </div>
  );
}
