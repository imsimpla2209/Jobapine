import { ClockCircleFilled } from '@ant-design/icons'
import { Space } from 'antd'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import ShowMore from 'react-show-more-button/dist/module'
import { useAuth } from 'src/Components/Providers/AuthProvider'
import { locationStore } from 'src/Store/commom.store'
import { clientStore } from 'src/Store/user.store'
import { useSubscription } from 'src/libs/global-state-hook'
import { EComplexityGet } from 'src/utils/enum'
import { currencyFormatter, randomDate } from 'src/utils/helperFuncs'

export default function ClientJobCard({ item, client, lang }) {
  const { t } = useTranslation(['main'])
  const locations = useSubscription(locationStore).state
  const { authenticated } = useAuth();
  const setState = useSubscription(clientStore).setState
  console.log(item)
  return (
    <div style={{ borderRadius: 12, marginBottom: 16, pointerEvents: authenticated ? "auto" : "none" }} >
      <div className="list-group-item px-4 py-2" style={{ border: '1px solid #ccc', background: '#fffcff' }}>
        <div className="row align-items-center">
          <div className="col-lg-9 pt-lg-2">
            <Link to={`/job-details/${item?._id || item?.id}`} className="job-title-link fw-bold">
              {item?.title}
            </Link>
          </div>
          <div className="col-lg-3">
            <div className="btn-group float-sm-end mt-2">
              {(client?.id || client?._id) === item?.client?._id && (
                <div className="d-block col-sm-1 col-xs-3 btn-group z-3 ">
                  <button
                    type="button"
                    className="btn btn-light dropdown-toggle border border-1 rounded-circle"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <i className="fas fa-ellipsis-h " />
                  </button>
                  <ul className="dropdown-menu" style={{ zIndex: 100 }}>
                    <li>
                      <Link className="dropdown-item" to={`/review-proposal/${item?._id}`}>
                        View Proposals
                      </Link>
                    </li>
                    <li>
                      <button className="dropdown-item" onClick={() => {}}>
                        Make Private
                      </button>
                    </li>

                    <li>
                      <Link className="dropdown-item" to={`/job-details/${item?._id}`}>
                        View Job posting
                      </Link>
                    </li>

                    <li>
                      <button className="dropdown-item" onClick={() => {}}>
                        Remove posting
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
        <p className="text-muted" style={{ fontSize: '0.8em', lineHeight: 0.5 }}>
          <span>
            <ClockCircleFilled />{' '}
          </span>
          <span className="fw-bold me-1">{t('posted')}</span>
          <span id="posting-time">
            {' '}
            {item?.createdAt
              ? new Date(`${item?.createdAt}`).toLocaleString()
              : randomDate(new Date(2022, 0, 1), new Date()).toLocaleString()}
          </span>
        </p>
        <div>
          <p style={{ fontSize: '0.9em', marginBottom: '2px' }}>
            <span className="text-muted">
              <span className="fw-bold me-1" id="contract-type">
                {t(item?.payment?.type)}:
              </span>
              <span className="text-secondary" id="contract-type">
                {currencyFormatter(item?.payment?.amount)} {'/'} {item?.payment?.type}
              </span>
              <span> - </span>
              <span className="fw-bold me-1">{t('Complexity')}:</span>
              <span id="experience-level">{t(EComplexityGet[item?.scope?.complexity || 0])}</span>
              <span> - </span>
              <span className="fw-bold me-1">{t('Est. Budget')}</span>
              <span id="client-budget">{currencyFormatter(item?.budget)}</span>
            </span>
          </p>
        </div>

        <div style={{ marginBottom: 4 }}>
          <ShowMore
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
            <span className="text-muted fw-bold me-1" style={{ fontSize: '0.9em' }}>
              {t('Description')}:
            </span>
            <span style={{ fontSize: '1em' }}>{item?.description}</span>
          </ShowMore>
        </div>

        <Space size="small" wrap>
          <div className="fw-bold me-1 text-muted" style={{ fontSize: '0.9em' }}>
            {t('Categories') + ':'}
          </div>
          {item?.categories?.map((c, index) => (
            <div key={index}>
              <button key={index} type="button" className="btn text-light btn-sm rounded-pill cats mx-1">
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

        <p style={{ fontSize: '0.9em' }} className="my-lg-1 fw-bold me-1 text-muted">
          <span className="text-muted">
            <span>Proposals: </span>
            <span className="fw-bold " id="proposals-numbers">
              {item?.proposals?.length || 0}
            </span>
          </span>
        </p>
        <div style={{ fontSize: '0.85em' }} className="my-lg-1 mb-lg-2">
          <span className="text-muted">
            <span className="fw-bold text-muted" style={{ display: 'flex', marginTop: 2 }}>
              <i className="fas fa-map-marker-alt" />
              {item?.preferences?.locations.filter(l => locations?.find(s => s.code === l.toString())).map(l => (
                <span key={l} style={{ marginLeft: 8 }}>
                  {locations?.find(s => s.code === l.toString())?.name} |
                </span>
              ))}
            </span>
          </span>
        </div>
      </div>
    </div>
  )
}
