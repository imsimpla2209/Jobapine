import {
  Avatar,
  Badge,
  Button,
  Card,
  Col,
  Modal,
  Progress,
  Radio,
  Row,
  Table,
  Typography,
  Upload,
  message,
} from "antd";

import { ToTopOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

// Images
import face2 from "pages/AdminPages/assets/images/face-2.jpg";
import ava2 from "pages/AdminPages/assets/images/logo-atlassian.svg";
import ava6 from "pages/AdminPages/assets/images/logo-invision.svg";
import ava5 from "pages/AdminPages/assets/images/logo-jira.svg";
import ava1 from "pages/AdminPages/assets/images/logo-shopify.svg";
import ava3 from "pages/AdminPages/assets/images/logo-slack.svg";
import pencil from "pages/AdminPages/assets/images/pencil.svg";
import { useEffect, useState } from "react";
import { getUsers } from "src/api/user-apis";
import defaultAvate from 'assets/img/icon-user.svg'
import { randomDate } from "src/utils/helperFuncs";
import UserInfo from "src/Components/AdminComponents/Modal/UserInfo";

const { Title } = Typography;

const formProps = {
  name: "file",
  action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
  headers: {
    authorization: "authorization-text",
  },
  onChange(info) {
    if (info.file.status !== "uploading") {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === "done") {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
};
// table code start
const columns = [
  {
    title: "User",
    dataIndex: "name",
    key: "name",
    width: "22%",
  },
  {
    title: "LAST LOGIN AS",
    dataIndex: "function",
    key: "function",
  },

  {
    title: "STATUS",
    key: "status",
    dataIndex: "status",
  },

  {
    title: "ACTIVE",
    key: "active",
    dataIndex: "active",
  },

  {
    title: "JOINT DATE",
    key: "JointDate",
    dataIndex: "JointDate",
  },
];


// project table start
const project = [
  {
    title: "COMPANIES",
    dataIndex: "name",
    width: "32%",
  },
  {
    title: "BUDGET",
    dataIndex: "age",
  },
  {
    title: "STATUS",
    dataIndex: "address",
  },
  {
    title: "COMPLETION",
    dataIndex: "completion",
  },
];
const dataproject = [
  {
    key: "1",

    name: (
      <Avatar.Group>
        <Avatar className="shape-avatar" src={ava1} size={25} alt="" />
        <div className="avatar-info">
          <Title level={5}>Spotify Version</Title>
        </div>
      </Avatar.Group>
    ),
    age: (
      <div className="semibold">22,600,000 VND</div>
    ),
    address: (
      <div className="text-sm">working</div>
    ),
    completion: (
      <div className="ant-progress-project">
        <Progress percent={30} size="small" />
        <span>
          <Link to="/">
            <img src={pencil} alt="" />
          </Link>
        </span>
      </div>
    ),
  },

  {
    key: "2",
    name: (
      <Avatar.Group>
        <Avatar className="shape-avatar" src={ava2} size={25} alt="" />
        <div className="avatar-info">
          <Title level={5}>Progress Track</Title>
        </div>
      </Avatar.Group>
    ),
    age: (
      <div className="semibold">33,600,000 VND</div>
    ),
    address: (
      <div className="text-sm">working</div>
    ),
    completion: (
      <div className="ant-progress-project">
        <Progress percent={10} size="small" />
        <span>
          <Link to="/">
            <img src={pencil} alt="" />
          </Link>
        </span>
      </div>
    ),
  },

  {
    key: "3",
    name: (
      <Avatar.Group>
        <Avatar className="shape-avatar" src={ava3} size={25} alt="" />
        <div className="avatar-info">
          <Title level={5}> Jira Platform Errors</Title>
        </div>
      </Avatar.Group>
    ),
    age: (
      <div className="semibold">Not Set</div>
    ),
    address: (
      <div className="text-sm">done</div>
    ),
    completion: (
      <div className="ant-progress-project">
        <Progress percent={100} size="small" format={() => "done"} />
        <span>
          <Link to="/">
            <img src={pencil} alt="" />
          </Link>
        </span>
      </div>
    ),
  },

  {
    key: "4",
    name: (
      <Avatar.Group>
        <Avatar className="shape-avatar" src={ava5} size={25} alt="" />
        <div className="avatar-info">
          <Title level={5}> Launch new Mobile App</Title>
        </div>
      </Avatar.Group>
    ),
    age: (
      <div className="semibold">48,600,000 VND</div>
    ),
    address: (
      <div className="text-sm">canceled</div>
    ),
    completion: (
      <div className="ant-progress-project">
        <Progress
          percent={50}
          size="small"
          status="exception"
          format={() => "50%"}
        />
        <span>
          <Link to="/">
            <img src={pencil} alt="" />
          </Link>
        </span>
      </div>
    ),
  },

  {
    key: "5",
    name: (
      <Avatar.Group>
        <Avatar className="shape-avatar" src={ava5} size={25} alt="" />
        <div className="avatar-info">
          <Title level={5}>Web Dev</Title>
        </div>
      </Avatar.Group>
    ),
    age: (
      <div className="semibold">144,600,000 VND</div>
    ),
    address: (
      <div className="text-sm">working</div>
    ),
    completion: (
      <div className="ant-progress-project">
        <Progress percent={80} size="small" />
        <span>
          <Link to="/">
            <img src={pencil} alt="" />
          </Link>
        </span>
      </div>
    ),
  },

  {
    key: "6",
    name: (
      <Avatar.Group>
        <Avatar className="shape-avatar" src={ava6} size={25} alt="" />
        <div className="avatar-info">
          <Title level={5}>Manage Online Store</Title>
        </div>
      </Avatar.Group>
    ),
    age: (
      <div className="semibold">5,600,000 VND</div>
    ),
    address: (
      <div className="text-sm">canceled</div>
    ),
    completion: (
      <div className="ant-progress-project">
        <Progress percent={0} size="small" />
        <span>
          <Link to="/">
            <img src={pencil} alt="" />
          </Link>
        </span>
      </div>
    ),
  },

  {
    key: "7",
    name: (
      <Avatar.Group>
        <Avatar className="shape-avatar" src={ava6} size={25} alt="" />
        <div className="avatar-info">
          <Title level={5}>Rework the banner</Title>
        </div>
      </Avatar.Group>
    ),
    age: (
      <div className="semibold">6,100,000 VND</div>
    ),
    address: (
      <div className="text-sm">canceled</div>
    ),
    completion: (
      <div className="ant-progress-project">
        <Progress percent={0} size="small" />
        <span>
          <Link to="/">
            <img src={pencil} alt="" />
          </Link>
        </span>
      </div>
    ),
  },

  {
    key: "8",
    name: (
      <Avatar.Group>
        <Avatar className="shape-avatar" src={ava6} size={25} alt="" />
        <div className="avatar-info">
          <Title level={5}>Redesign Online Store</Title>
        </div>
      </Avatar.Group>
    ),
    age: (
      <div className="semibold">12,600,000 VND</div>
    ),
    address: (
      <div className="text-sm">canceled</div>
    ),
    completion: (
      <div className="ant-progress-project">
        <Progress percent={0} size="small" />
        <span>
          <Link to="/">
            <img src={pencil} alt="" />
          </Link>
        </span>
      </div>
    ),
  },
  {
    key: "9",
    name: (
      <Avatar.Group>
        <Avatar className="shape-avatar" src={ava6} size={25} alt="" />
        <div className="avatar-info">
          <Title level={5}>Marketing Online Store</Title>
        </div>
      </Avatar.Group>
    ),
    age: (
      <div className="semibold">5,600,000 VND</div>
    ),
    address: (
      <div className="text-sm">canceled</div>
    ),
    completion: (
      <div className="ant-progress-project">
        <Progress percent={0} size="small" />
        <span>
          <Link to="/">
            <img src={pencil} alt="" />
          </Link>
        </span>
      </div>
    ),
  },
];

function Tables() {
  const onChange = (e) => console.log(`radio checked:${e.target.value}`);
  const [users, setUsers] = useState([])
  const [seletecUser, setSelectedUser] = useState({})
  const [openModal, setOpenModal] = useState(false)

  useEffect(() => {
    getUsers({ limit: 1000 }).then((res) => {
      setUsers(res.data.results?.filter(user => user.role === 'user'))
    })
  }, [])

  const openUserDetailModal = (user) => {
    setSelectedUser(user)
    setOpenModal(true)
  }

  const getUsersData = (users) => {
    return users?.map((user, ix) => ({
      key: ix,
      name: (
        <>
          <Avatar.Group>
            <Avatar
              className="shape-avatar"
              shape="square"
              size={40}
              src={user?.avatar || defaultAvate}
            ></Avatar>
            <div className="avatar-info">
              <Title level={5}>{user.name}</Title>
              <p>{user?.email || 'No Email'}</p>
              <p>{user?.phone || 'No phone'}</p>
            </div>
          </Avatar.Group>{" "}
        </>
      ),
      function: (
        <div className="author-info">
          <Title level={5} style={{ textTransform: 'capitalize' }}>{user?.lastLoginAs}</Title>
          <p style={{ textTransform: 'capitalize' }}>{user?.role}</p>
        </div>
      ),

      status: (
        <Badge count={ix % 2 === 0 ? "Online" : "Offline"} className="tag-primary"
          style={{ backgroundColor: ix % 2 === 0 ? "#52c41a" : "grey" }}
        >
        </Badge>
      ),
      active: (
        <Badge count={user?.isActive ? "Active" : "Inactive"} className="tag-primary"
          style={{ backgroundColor: ix % 2 === 0 ? "purple" : "#f5222d" }}
        >
        </Badge>
      ),
      JointDate: (
        <div className="ant-employed">
          <span>{user?.createdAt
            ? new Date(`${user?.createdAt}`).toLocaleString()
            : randomDate(new Date(2022, 0, 1), new Date()).toLocaleString()}</span>
          <Button type="primary" shape="round" onClick={() => openUserDetailModal(user)}>Detail</Button>
        </div>
      ),

    }))
  };

  return (
    <div className="tabled">
      <Row gutter={[24, 0]}>
        <Col xs="24" xl={24}>
          <Card
            bordered={false}
            className="criclebox tablespace mb-24"
            title="Users Table"
            extra={
              <Radio.Group onChange={onChange} defaultValue="a">
                <Radio.Button value="a">All</Radio.Button>
                <Radio.Button value="b">ONLINE</Radio.Button>
              </Radio.Group>
            }
          >
            <div className="table-responsive">
              <Table
                columns={columns}
                dataSource={getUsersData(users)}
                pagination={{}}
                className="ant-border-space"
              />
            </div>
          </Card>
          <Modal
            open={openModal}
            title="User Details"
            onCancel={() => {
              setOpenModal(false)
              setSelectedUser({})
            }}
            width={1250}
            footer={[
              <Button key="back" onClick={() => {
                setOpenModal(false)
                setSelectedUser({})
              }}>
                Notify
              </Button>,
              <Button key="submit" type="primary" >
                Direct Message
              </Button>,
              <Button
                key="link"
                href="https://google.com"
                type="primary"
              >
                Verify Profile
              </Button>,
            ]}
          >
            <UserInfo user={seletecUser} />
          </Modal>
          <Card
            bordered={false}
            className="criclebox tablespace mb-24"
            title="Job Management Table"
            extra={
              <Radio.Group onChange={onChange} defaultValue="all">
                <Radio.Button value="all">All</Radio.Button>
                <Radio.Button value="online">Open</Radio.Button>
                <Radio.Button value="online">Working</Radio.Button>
                <Radio.Button value="store">Done</Radio.Button>
                <Radio.Button value="store">Cancel</Radio.Button>
                <Radio.Button value="store">Pending</Radio.Button>
              </Radio.Group>
            }
          >
            <div className="table-responsive">
              <Table
                columns={project}
                dataSource={dataproject}
                pagination={false}
                className="ant-border-space"
              />
            </div>
            <div className="uploadfile pb-15 shadow-none">
              <Upload {...formProps}>
                <Button
                  type="dashed"
                  className="ant-full-box"
                  icon={<></>}
                >
                  Load More
                </Button>
              </Upload>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Tables;
