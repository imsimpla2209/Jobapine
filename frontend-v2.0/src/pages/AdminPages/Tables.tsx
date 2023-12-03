import {
  Avatar,
  Badge,
  Button,
  Card,
  Col,
  Modal,
  Radio,
  Row,
  Table,
  Typography
} from "antd";


// Images
import defaultAvate from 'assets/img/icon-user.svg';
import { useEffect, useState } from "react";
import UserInfo from "src/Components/AdminComponents/Modal/UserInfo";
import { getUsers } from "src/api/admin-apis";
import { EUserType } from "src/utils/enum";
import { randomDate } from "src/utils/helperFuncs";

const { Title } = Typography;

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

function Tables() {
  const onChange = (e) => console.log(`radio checked:${e.target.value}`);
  const [users, setUsers] = useState<any>({})
  const [seletecUser, setSelectedUser] = useState<any>({ user: {}, type: '' })
  const [openModal, setOpenModal] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getUsers().then((res) => {
      setUsers(res.data)
    }).finally(() => {
      setLoading(false)
    })
  }, [])

  const openUserDetailModal = (user, type) => {
    setSelectedUser({ user, type })
    setOpenModal(true)
  }

  const getUsersData = (users, type) => {
    return users?.map((user, ix) => ({
      key: ix,
      name: (
        <>
          <Avatar.Group>
            <Avatar
              className="shape-avatar"
              shape="square"
              size={40}
              src={user?.user?.avatar || defaultAvate}
            ></Avatar>
            <div className="avatar-info">
              <Title level={5}>{user?.user.name}</Title>
              <p>{user?.user?.email || 'No Email'}</p>
              <p>{user?.user?.phone || 'No phone'}</p>
            </div>
          </Avatar.Group>{" "}
        </>
      ),
      function: (
        <div className="author-info">
          <Title level={5} style={{ textTransform: 'capitalize' }}>{user?.user?.lastLoginAs}</Title>
          <p style={{ textTransform: 'capitalize' }}>{user?.user?.role}</p>
        </div>
      ),

      status: (
        <Badge count={ix % 2 === 0 ? "Online" : "Offline"} className="tag-primary"
          style={{ backgroundColor: ix % 2 === 0 ? "#52c41a" : "grey" }}
        >
        </Badge>
      ),
      active: (
        <Badge count={user?.user?.isActive ? "Active" : "Inactive"} className="tag-primary"
          style={{ backgroundColor: ix % 2 === 0 ? "purple" : "#f5222d" }}
        >
        </Badge>
      ),
      JointDate: (
        <div className="ant-employed">
          <span>{user?.user?.createdAt
            ? new Date(`${user?.user?.createdAt}`).toLocaleString()
            : randomDate(new Date(2022, 0, 1), new Date()).toLocaleString()}</span>
          <Button type="primary" shape="round" onClick={() => openUserDetailModal(user, type)}>Detail</Button>
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
            title="Client List"
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
                dataSource={getUsersData(users?.clients, EUserType.CLIENT)}
                pagination={{}}
                className="ant-border-space"
                loading={loading}
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
            <UserInfo user={seletecUser.user} type={seletecUser.type} />
          </Modal>
        </Col>
      </Row>

      <Row gutter={[24, 0]}>
        <Col xs="24" xl={24}>
          <Card
            bordered={false}
            className="criclebox tablespace mb-24"
            title="Freelancers List"
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
                dataSource={getUsersData(users?.freelancers, EUserType.FREELANCER)}
                pagination={{}}
                className="ant-border-space"
                loading={loading}
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
            <UserInfo user={seletecUser.user} type={seletecUser.type} />
          </Modal>
        </Col>
      </Row>
    </div>
  );
}

export default Tables;
