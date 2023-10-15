
import { Space } from 'antd'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import ShowMore from 'react-show-more-button/dist/module'
import { locationStore } from 'src/Store/commom.store'
import { useSubscription } from 'src/libs/global-state-hook'
import { EComplexityGet } from 'src/utils/enum'
import { currencyFormatter, pickName, randomDate } from 'src/utils/helperFuncs'
import StarsRating from '../../SharedComponents/StarsRating/StarsRating'
import JobProposalsNumber from './JobProposalsNumber'

export default function JobCard({ item, saveJob, freelancer, lang }) {
  const { t } = useTranslation(['main'])
  const navigate = useNavigate()
  const locations = useSubscription(locationStore).state;


  return (
    <div style={{ borderRadius: 8, marginBottom: 16 }} className="card-job">
      <div className="list-group-item p-4 card-job">
        <div className="row align-items-center">
          <div className="col-lg-9 pt-lg-2">
            <Link
              to={''}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                navigate(`/job/${item._id}`, { state: `${item._id}` })
              }}
              className="job-title-link fw-bold"
            >
              {item?.title}
            </Link>
          </div>
          <div className="col-lg-3">
            <div className="btn-group float-sm-end">
              <button
                type="button"
                className="btn btn-light dropdown-toggle border border-1 rounded-circle collapsed"
                data-toggle="collapse"
                data-target="#collapse"
                aria-expanded="false"
                aria-controls="collapseTwo"
              >
                <i
                  onClick={
                    (e) => saveJob(e, item._id)
                  }
                  className={`${freelancer?.favoriteJobs?.includes(item._id) ? 'fas fa-heart text-jobsicker' : 'far fa-heart'}`
                  } aria-hidden="true" />

              </button>
            </div>
            <div className="btn-group float-sm-end  px-lg-1">
              <ul className="dropdown-menu">
                <li>
                  <a className="dropdown-item" href="#">
                    RSS
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Atom
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <p style={{ fontSize: "0.9em" }}>
          <span className="text-muted">
            <span className="fw-bold me-2" id="contract-type">
              {item?.payment?.type}
            </span>
            <span className="text-secondary" id="contract-type">
              {currencyFormatter(item?.payment?.amount)} {'/'} {item?.payment?.type}
            </span>
            <span> - </span>
            <span id="experience-level">{t(EComplexityGet[item?.scope?.complexity])}</span>
            <span> - </span>
            <span>Est. Budget: </span>
            <span id="client-budget">{currencyFormatter(item?.budget)}</span> - posted
            <span id="posting-time"> {
              item?.createdAt ? new Date(item?.createdAt * 1000).toLocaleString()
                : randomDate(new Date(2022, 0, 1), new Date()).toLocaleString()
            }</span>
          </span>
        </p>
        <ShowMore
          maxHeight={100}
          button={
            <button
              id="seemorebutton"
              className="advanced-search-link "
              style={{ color: "green", position: "absolute", left: 0 }}
            >
              more
            </button>
          }
        >
          {item?.description}
        </ShowMore>

        <Space size="small">
          <strong>{t("Categories") + ":"}</strong>
          {item?.categories?.map((c, index) => (
            <div key={index}>
              <button
                key={index}
                type="button"
                className="btn text-light btn-sm rounded-pill cats mx-1 my-1"
              >
                {c?.name}
              </button>
            </div>
          ))}
        </Space>

        {/* <Space size="small">
          {item?.reqSkills?.map((skill, index) => (
            <div key={index}>
              <button
                key={index}
                type="button"
                className="btn text-light btn-sm rounded-pill skills mx-1 my-1"
                style={{ backgroundColor: "#9b9d9f" }}
              >
                {pickName(skill?.skill, lang)}
              </button>
            </div>
          ))}
        </Space> */}

        <p style={{ fontSize: "0.9em" }} className="my-lg-1 py-2">
          <span className="text-muted">
            <span>Proposals: </span>
            <span className="fw-bold " id="proposals-numbers">
              <JobProposalsNumber jobID={item?.proposals?.length || 0} />
            </span>
          </span>
        </p>
        <div style={{ fontSize: "0.85em" }} className="my-lg-1 mb-lg-2">
          <span className="fw-bold" style={{ color: item?.client?.paymentVerified ? "#14bff4" : "red" }}>
            <i
              className={`${item?.client?.paymentVerified ? "fas fa-check-circle" : "far fa-times-circle"} me-1`}
              style={{ color: item?.client?.paymentVerified ? "#14bff4" : "red" }}
            />
            {item?.client?.paymentVerified ? t("PaymentVerified") : "Paymentunverified"}
          </span>
          <span className="text-muted">
            <span className="mx-2">
              <StarsRating clientReview={item?.client?.rating} index={1} />
              <StarsRating clientReview={item?.client?.rating} index={2} />
              <StarsRating clientReview={item?.client?.rating} index={3} />
              <StarsRating clientReview={item?.client?.rating} index={4} />
              <StarsRating clientReview={item?.client?.rating} index={5} />
            </span>
            <span className="fw-bold "> {currencyFormatter(item?.client?.spent)} </span>
            <span> spent </span>
          </span>
          <div className="fw-bold text-muted" style={{ display: 'flex', marginTop: 16 }}>
            <i className="fas fa-map-marker-alt" />
            {
              item?.preferences?.locations.map(l => (
                <div key={l} style={{ marginLeft: 8 }}>
                  {locations[Number(l)].name} |
                </div>
              ))
            }
          </div>
        </div>
      </div>

    </div>
  )
}
