import { TwitterOutlined, FacebookOutlined, InstagramOutlined } from "@ant-design/icons"
import { Row, Col, Card, Switch, Button, Descriptions, List, Avatar, Rate, Space } from "antd"
import { t } from "i18next"
import { useEffect, useState } from "react"
import { getClientByOptions } from "src/api/client-apis"
import { getFreelancerByOptions } from "src/api/freelancer-apis"
import { IUser } from "src/types/user"
import { EComplexityGet, EUserType } from "src/utils/enum"
import { currencyFormatter, pickName } from "src/utils/helperFuncs"
import defaultAvate from 'assets/img/icon-user.svg'
import sickPoint from 'assets/img/logo.png'
import { useTranslation } from "react-i18next"
import { useSubscription } from "src/libs/global-state-hook"
import { locationStore } from "src/Store/commom.store"

const pencil = [
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    key={0}
  >
    <path
      d="M13.5858 3.58579C14.3668 2.80474 15.6332 2.80474 16.4142 3.58579C17.1953 4.36683 17.1953 5.63316 16.4142 6.41421L15.6213 7.20711L12.7929 4.37868L13.5858 3.58579Z"
      className="fill-gray-7"
    ></path>
    <path
      d="M11.3787 5.79289L3 14.1716V17H5.82842L14.2071 8.62132L11.3787 5.79289Z"
      className="fill-gray-7"
    ></path>
  </svg>,
];

const UserInfo = ({ user, type }: any) => {
  const { t, i18n } = useTranslation(['main'])
  const locations = useSubscription(locationStore).state;

  return (
    <Row gutter={[24, 0]} style={{ background: "#f3edf5", paddingTop: 24 }}>
      <Col span={24} md={8} className="mb-24 ">
        <Card
          bordered={false}
          className="header-solid h-full"
          title={<h6 className="font-semibold m-0">{t("Platform Setting")}</h6>}
        >
          <ul className="list settings-list">
            <li>
              <h6 className="list-header text-sm text-muted">ACCOUNT ABILITY</h6>
            </li>
            <li>
              <Switch defaultChecked />
              <span>Active</span>
            </li>
            <li>
              <Switch />
              <span>Email Receive</span>
            </li>
            <li>
              <Switch defaultChecked />
              <span>Apply For Jobs</span>
            </li>
            <li>
              <Switch defaultChecked />
              <span>Invite Message</span>
            </li>
            <li>
              <h6 className="list-header text-sm text-muted m-0">
                APPLICATION
              </h6>
            </li>
            <li>
              <Switch defaultChecked />
              <span>2FA Verification</span>
            </li>
            <li>
              <Switch defaultChecked />
              <span>System Notifications</span>
            </li>
            <li>
              <Switch defaultChecked />
              <span>Tracking Behaviour</span>
            </li>
          </ul>
        </Card>
      </Col>
      <Col span={24} md={8} className="mb-24">
        <Card
          bordered={false}
          title={<h6 className="font-semibold m-0">Profile Information</h6>}
          className="header-solid h-full card-profile-information"
          extra={<Button type="link">{pencil}</Button>}
          bodyStyle={{ paddingTop: 0, paddingBottom: 16, fontSize: 14 }}
        >
          <Descriptions title={<>
            <Avatar shape="square"
              size={80}
              src={user?.user?.avatar || defaultAvate}>

            </Avatar> <span style={{ textTransform: 'capitalize' }}>
              {user?.user?.name}
            </span>
          </>} >
            <Descriptions.Item label="User Name" span={3} style={{ textTransform: 'capitalize' }}>
              {user?.user?.username}
            </Descriptions.Item>
            <Descriptions.Item label="Role" span={3} style={{ textTransform: 'capitalize' }}>
              {user?.user?.role}
            </Descriptions.Item>
            <Descriptions.Item label="Mobile" span={3}>
              {user?.user?.phone || 'No Phone'} - <span className="text-muted ms-1">{user?.user?.isPhoneVerified ? ` ${t("Verified")}✅` : `${t("Not Verified")} ⛔`}</span>
            </Descriptions.Item>
            <Descriptions.Item label="Email" span={3}>
              {user?.user?.email || 'No Email'} - <span className="text-muted ms-1">{user?.user?.isEmailVerified ? ` ${t("Verified")}✅` : `${t("Not Verified")} ⛔`}</span>
            </Descriptions.Item>
            <Descriptions.Item label={"Balance 💳"} span={3}> {currencyFormatter(user?.user?.balance)} </Descriptions.Item>
            <Descriptions.Item label={"Sick Points"} span={3}> {user?.user?.sickPoints || 0}</Descriptions.Item>
            <Descriptions.Item label={"Plan"} span={3}> {user?.user?.plan || 'Free'}</Descriptions.Item>
            <Descriptions.Item label="Social" span={3}>
              <a href="#" className="mx-5 px-5">
                {<TwitterOutlined />}
              </a>
              <a href="#" className="mx-5 px-5">
                {<FacebookOutlined style={{ color: "#344e86" }} />}
              </a>
              <a href="#" className="mx-5 px-5">
                {<InstagramOutlined style={{ color: "#e1306c" }} />}
              </a>
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </Col>
      <Col span={24} md={8} className="mb-24">
        {
          type === EUserType.FREELANCER ? <Card
            bordered={false}
            title={<h6 className="font-semibold m-0">{user?.lastLoginAs} Profile</h6>}
            className="header-solid h-full card-profile-information"
            extra={<Button type="link">{pencil}</Button>}
            bodyStyle={{ paddingTop: 0, paddingBottom: 16 }}
          >
            <p className="text-dark">
              {" "}
              {user?.intro || `Hi, I’m Alec Thompson, Decisions: If you can’t decide, the answer
            is no. If two equally difficult paths, choose the one more painful
            in the short term (pain avoidance is creating an illusion of
            equality)`}.{" "}
            </p>
            <hr className="my-25" />
            <Descriptions>
              <Descriptions.Item label="Skills" span={3}>
                {user?.skills?.map((skill, index) => (
                  <Space key={index} size={1} className="me-sm-5 " wrap={true}>
                    {index + 1}. {pickName(skill?.skill, i18n.language)}
                  </Space>
                ))}
              </Descriptions.Item>
              {/* <Descriptions.Item label="Earned" span={3}>
              2,300,000.00 VND
            </Descriptions.Item> */}
              <Descriptions.Item label="Number of WIP Jobs" span={3}>
                {user?.jobsDone?.number || 0}
              </Descriptions.Item>
              <Descriptions.Item label="Expected Salary" span={3}>
                {currencyFormatter(user?.expectedAmount)} \ {t(user?.expectedPaymentType)}
              </Descriptions.Item>
              <Descriptions.Item label="Location" span={3}>
                {
                  user?.currentLocations?.filter(l => locations?.find(s => s.code === l.toString())?.name).map(l => (
                    <span key={l} style={{ marginLeft: 8 }}>
                      {locations?.find(s => s.code === l.toString())?.name}
                    </span>
                  ))
                }
              </Descriptions.Item>
              <Descriptions.Item label="Online Expertise Level" span={3}>
                {t(EComplexityGet[user?.expertiseLevel])}
              </Descriptions.Item>
              <Descriptions.Item label="Rating" span={3}>
                <Rate disabled={true} value={user.rating} />
              </Descriptions.Item>
            </Descriptions>
            <div className="mt-4 border  rounded-2 p-2" style={{ color: "black", fontSize: 14}}>
              <div><strong>{t('Education')}</strong></div>
              <div><strong>- School: </strong>{user?.education?.school}</div>
              <div><strong>- Major: </strong>{user?.education?.areaOfStudy}</div>
              <div><strong>- Degree: </strong>{user?.education?.degree}</div>
              <div><strong>- Graduation Year: </strong>{user?.education?.gradYear ? new Date(user?.education?.gradYear).toLocaleString("vi-VN", {
                    weekday: "short",
                    year: "numeric",
                    month: "2-digit",
                    day: "numeric"
                  }) : 2019}</div>
            </div>
            <div className="mt-4" style={{ color: "black", fontSize: 14}}>
              <div><strong>{t('History Works')}</strong></div>
              {user?.historyWork?.map((e, ix) =>
                <div className="border rounded p-2" key={ix}>
                  <strong>{ix + 1}. </strong><span>{e?.jobName}</span> - 
                  <span>{e?.jobTitle}</span> - 
                  {e?.stillWork ? <span>Still Work</span> : null}
                </div>
              )}
            </div>
          </Card> : <></>
        }
      </Col>
    </Row>)
}

export default UserInfo
