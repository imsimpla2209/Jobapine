import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import ShowMore from 'react-show-more-button/dist/module'
import { locationStore } from 'src/Store/commom.store'
import { Level } from 'src/api/constants'
import { useSubscription } from 'src/libs/global-state-hook'
import ImgWithActiveStatus from '../ImgWithActiveStatus'
import { StarOutlined } from '@ant-design/icons'
import { Rate } from 'antd'

export default function Saved({ freelancer }) {
  const { t } = useTranslation(['main'])
  const navigate = useNavigate()
  const { state: locations } = useSubscription(locationStore)
  const jobDonePercent = (parseInt(freelancer.jobsDone.success) / parseInt(freelancer.jobsDone.number)) * 100

  return (
    <div>
      <div className="row border bg-white border-1">
        <div className="col-1 pt-lg-3">
          <ImgWithActiveStatus avatar={freelancer?.images?.[0]} />
        </div>
        <div className="col-lg-6 pt-lg-3 ">
          <a
            href="#"
            id="job-title-home-page "
            className="link-dark job-title-hover "
            onClick={() => navigate(`/freelancer-profile/${freelancer._id}`, { replace: true })}
          >
            <p className="fw-bold text-success">{freelancer?.name}</p>
          </a>
          <a href="#" id="job-title-home-page " className="link-dark">
            <p className="fw-bold ">{freelancer?.intro}</p>
          </a>
          <span className="text-muted d-flex">
            {freelancer?.currentLocations?.map(l => (
              <div key={l}>{locations[Number(l)]?.name}, </div>
            ))}
          </span>
          <Rate disabled defaultValue={freelancer?.rating || 0} />
          <div className="row py-3">
            <div className="col">
              <span className="fw-bold">${freelancer?.hourlyRate}</span>
              <span className="text-muted"> /hr</span>
            </div>
            <div className="col">
              <span className="fw-bold">${freelancer?.earned}</span> + <span className="text-muted"> earned</span>
            </div>
            <div className="col">
              <span>
                {' '}
                <svg
                  width="15px"
                  data-name="Layer 1"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 14 14"
                  aria-hidden="true"
                  role="img"
                >
                  <polygon points="7 0 0 0 0 9.21 7 14 14 9.21 14 0 7 0" fill="#1caf9d" />
                </svg>
              </span>
              <span className="text-primary"> {freelancer?.certificate}</span>
            </div>
            <div className="col progress " style={{ width: 50, height: 10, display: 'inline', float: 'left' }}>
              <div
                className="progress-bar bg-primary"
                role="progressbar"
                style={{ width: `${jobDonePercent || 0}%` }}
                aria-valuenow={100}
                aria-valuemin={0}
                aria-valuemax={80}
              >
                <div style={{ fontSize: '0.7em', display: 'start' }}>{`${jobDonePercent || 0}%`}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="col py-3">
          <div className="btn-group float-end ">
            <button
              type="button"
              className="btn btn-light dropdown-toggle border border-1 rounded-circle collapsed"
              data-toggle="collapse"
              data-target="#collapse"
              aria-expanded="false"
              aria-controls="collapseTwo"
            >
              <i className={`${'far fa-heart'}`} aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="row px-5 mx-5">
          <ShowMore
            className=""
            maxHeight={100}
            button={
              <button
                id="seemorebutton"
                className="advanced-search-link "
                style={{ color: 'green', position: 'absolute', left: 0 }}
              >
                more
              </button>
            }
          >
            {freelancer?.overview}
          </ShowMore>
          {freelancer?.skills?.length && (
            <div className="d-flex justify-content-start">
              {freelancer?.skills?.map((skill, index) => (
                <div className="chip mb-3 ms" key={index}>
                  <span> {t(`${Level[skill.level - 1]}`)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
