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


import defaultAvate from 'assets/img/icon-job.svg';
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import JobInfo from "src/Components/AdminComponents/Modal/JobInfo";
import { IJobData } from "src/Store/job.store";
import { getAllJobsforAdmin, getJobs } from "src/api/job-apis";
import { EComplexityGet } from "src/utils/enum";
import { currencyFormatter, randomDate } from "src/utils/helperFuncs";

const { Title } = Typography;

const columns = [
  {
    title: "OVERVIEW",
    dataIndex: "name",
    key: "name",
    width: "17%",
  },
  {
    title: "Payment",
    dataIndex: "function",
    key: "function",
  },

  {
    title: "STATUS",
    key: "status",
    dataIndex: "status",
  },

  {
    title: "SCOPE",
    key: "active",
    dataIndex: "active",
  },
  {
    title: "CREATED DATE",
    key: "JointDate",
    dataIndex: "JointDate",
  },
];


function JobTables() {
  const onChange = (e) => console.log(`radio checked:${e.target.value}`);
  const [jobs, setJobs] = useState([])
  const [seletecJob, setSelectedJob] = useState({})
  const [openModal, setOpenModal] = useState(false)
  const { t } = useTranslation(['main'])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getAllJobsforAdmin().then((res) => {
      setJobs(res.data)
    }).finally(() => {
      setLoading(false)
    })
  }, [])

  const openJobDetailModal = (job) => {
    setSelectedJob(job)
    setOpenModal(true)
  }

  const getJobsData = (jobs) => {
    return jobs?.map((job, ix) => ({
      key: ix,
      name: (
        <>
          <Avatar.Group>
            <div className="avatar-info">
              <Title level={5}>{job.title}</Title>
              <p className="text-truncate">Needed employee: {job?.preferences?.nOEmployee || 1}</p>
              <p>{job?.jobDuration}</p>
            </div>
          </Avatar.Group>{" "}
        </>
      ),
      function: (
        <div className="author-info">
          <Title level={5} style={{ textTransform: 'capitalize' }}>{job?.payment?.type}/{currencyFormatter(job?.payment?.amount)}</Title>
          <p style={{ textTransform: 'capitalize' }}>Budget: {currencyFormatter(job?.budget)}</p>
        </div>
      ),

      status: (
        <Badge count={job?.currentStatus} className="tag-primary"
          style={{ backgroundColor: "#52c41a", textTransform: "capitalize" }}
        >
        </Badge>
      ),
      active: (
        <div className="author-info">
          <Title level={5} style={{ textTransform: 'capitalize' }}>{t(EComplexityGet[job?.scope?.complexity])}</Title>
          <p style={{ textTransform: 'capitalize' }}>{job?.scope?.duration || 'N/A'} Months</p>
          <p style={{ textTransform: 'capitalize' }}>{job?.proposals?.length || 0} Applied Proposals</p>
        </div>
      ),
      JointDate: (
        <div className="ant-employed">
          <span>{job?.createdAt
            ? new Date(`${job?.createdAt}`).toLocaleString()
            : randomDate(new Date(2022, 0, 1), new Date()).toLocaleString()}</span>
          <Button type="primary" shape="round" onClick={() => openJobDetailModal(job)}>Detail</Button>
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
            title="Jobs Management Table"
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
                dataSource={getJobsData(jobs)}
                pagination={{}}
                className="ant-border-space"
                loading={loading}
              />
            </div>
          </Card>
          <Modal
            open={openModal}
            title="Job Details"
            onCancel={() => {
              setOpenModal(false)
              setSelectedJob({})
            }}
            width={1250}
            footer={[
              <Button key="back" onClick={() => {
                setOpenModal(false)
                setSelectedJob({})
              }}>
                Soft Delete
              </Button>,
              <Button key="submit" type="primary" >
                Force Delete
              </Button>,
              <Button
                type="primary"
              >
                Verify Profile
              </Button>,
            ]}
          >
            <JobInfo job={seletecJob as IJobData} />
          </Modal>
        </Col>
      </Row>
    </div>
  );
}

export default JobTables;
