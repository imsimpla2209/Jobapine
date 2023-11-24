import { Button, Card, Divider, Image, Rate, Space, Tag } from 'antd'
import userIcon from 'assets/img/icon-user.svg'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import ShowMore from 'react-show-more-button/dist/module'
import { locationStore } from 'src/Store/commom.store'
import { Level } from 'src/api/constants'
import { useSubscription } from 'src/libs/global-state-hook'
import ImgWithActiveStatus from '../ImgWithActiveStatus'
import { Text } from '../ReviewProposalsCard'
import Progress from 'src/Components/SharedComponents/Progress'
import { pickName } from 'src/utils/helperFuncs'

export default function Saved({ freelancer }) {
  const { t, i18n } = useTranslation(['main'])
  const lang = i18n.language
  const { state: locations } = useSubscription(locationStore)
  const jobDonePercent = (parseInt(freelancer.jobsDone.success) / parseInt(freelancer.jobsDone.number)) * 100
  console.log(freelancer)
  return (
    <Card bodyStyle={{ padding: 16 }}>
      <Space direction="vertical" size={16} className="w-100">
        <Space direction="vertical" align="center" className="w-100" size={16}>
          <Image src={freelancer?.images?.[0]} fallback={userIcon} width={'100%'} />
          <div className="center w-100">
            <Tag color="#0099ff" style={{ fontSize: 20, padding: 8 }}>
              {freelancer?.name}
            </Tag>
          </div>
          <Rate disabled defaultValue={freelancer?.rating || 0} />
        </Space>
        <Divider style={{ margin: 0 }} />
        <Text>
          <b>Intro: </b>
          {freelancer.intro}
        </Text>
        <Text>
          <b>Locations: </b>
          <span className="text-muted d-flex" style={{ gap: 8, flexWrap: 'wrap' }}>
            {freelancer?.currentLocations?.map((l, index) => (
              <div key={l}>
                {index !== 0 && '|'} {locations.find(loc => loc.code === l).name}
              </div>
            ))}
          </span>
        </Text>
        <Text>
          <b>Hourly rate: </b>
          <span className="fw-bold">${freelancer?.hourlyRate}</span>
          <span className="text-muted"> /hr</span>
        </Text>

        <Text strong>{t('Skills and experties:')}</Text>

        {freelancer?.skills?.length
          ? freelancer?.skills?.map((skill, index) => (
              <Space key={index} size={1} className="me-sm-5 " wrap={false}>
                <Button key={index} className="btn text-light btn-sm rounded-pill cats mx-1 my-1">
                  {pickName(skill?.skill, lang)}:
                </Button>
                <Progress done={skill?.level} />
              </Space>
            ))
          : null}
      </Space>
    </Card>
  )
  return (
    <Card style={{ marginBottom: 16 }}>
      <div className="col-1 pt-lg-3">
        <ImgWithActiveStatus avatar={freelancer?.images?.[0]} />
      </div>
      <div className="col-lg-6 pt-lg-3 ">
        <Link
          id="job-title-home-page "
          className="link-dark job-title-hover "
          to={`/freelancer-profile/${freelancer._id}`}
        >
          <p className="fw-bold text-success">{freelancer?.name}</p>
        </Link>
        <a href="#" id="job-title-home-page " className="link-dark">
          <p className="fw-bold ">{freelancer?.intro}</p>
        </a>
        <span className="text-muted d-flex" style={{ gap: 8 }}>
          {freelancer?.currentLocations?.map(l => (
            <div key={l}>{locations.find(loc => loc.code === l).name} |</div>
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
        {freelancer?.skills?.length ? (
          <div className="d-flex justify-content-start">
            {freelancer?.skills?.map((skill, index) => (
              <div className="chip mb-3 ms" key={index}>
                <span> {t(`${Level[skill.level - 1]}`)}</span>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </Card>
  )
}
