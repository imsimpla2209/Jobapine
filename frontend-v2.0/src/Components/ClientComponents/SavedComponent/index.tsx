import { Button, Card, Divider, Image, Rate, Space, Tag } from 'antd'
import userIcon from 'assets/img/icon-user.svg'
import { useTranslation } from 'react-i18next'
import Progress from 'src/Components/SharedComponents/Progress'
import { locationStore } from 'src/Store/commom.store'
import { useSubscription } from 'src/libs/global-state-hook'
import { formatMoney } from 'src/utils/formatMoney'
import { pickName } from 'src/utils/helperFuncs'
import { Text } from '../ReviewProposalsCard'

export default function Saved({ freelancer }) {
  const { t, i18n } = useTranslation(['main'])
  const lang = i18n.language
  const { state: locations } = useSubscription(locationStore)

  return (
    <Card bodyStyle={{ padding: 16 }}>
      <Space direction="horizontal" size={16} className="w-100" align="start">
        <Space direction="vertical" align="start" size={16}>
          <Image
            src={freelancer?.user?.avatar}
            fallback={userIcon}
            width={'200'}
            style={{ width: 200, borderRadius: 20 }}
          />
          <Divider style={{ margin: 0 }} />

          <div className="center w-100">
            <Tag color="#0099ff" style={{ fontSize: 20, padding: 8 }}>
              {freelancer?.user?.name}
            </Tag>
          </div>
          <Rate disabled defaultValue={freelancer?.rating || 0} />
        </Space>{' '}
        <Space direction="vertical" align="start" className="w-100" size={16}>
          <Text>
            <b>Intro: </b>
            <span className="text-muted"> {freelancer.intro}</span>
          </Text>
          <Text className="w-100 d-flex" style={{ gap: 8 }}>
            <b>Locations: </b>
            <span className="text-muted d-flex" style={{ gap: 8, flexWrap: 'wrap' }}>
              {freelancer?.currentLocations?.map((l, index) => (
                <div key={l}>
                  {index !== 0 && '|'} {locations.find(loc => loc.code === l)?.name}
                </div>
              ))}
            </span>
          </Text>
          <Text>
            <b>Earned: </b>
            <span className="text-muted fw-bold">{formatMoney(freelancer?.earned) || 0} VND</span>
          </Text>

          {freelancer?.skills?.filter(skill => skill?.skill)?.length ? (
            <>
              <Text strong>{t('Skills and experties:')}</Text>
              {freelancer?.skills?.map((skill, index) =>
                skill?.skill ? (
                  <Space key={index} size={1} className="me-sm-5 " wrap={false}>
                    <Button className="btn text-light btn-sm rounded-pill cats mx-1 my-1">
                      {pickName(skill?.skill, lang)}:
                    </Button>
                    <Progress done={skill?.level} />
                  </Space>
                ) : null
              )}
            </>
          ) : null}
        </Space>
      </Space>
    </Card>
  )
}
