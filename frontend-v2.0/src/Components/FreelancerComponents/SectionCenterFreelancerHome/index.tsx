
import { Button, Col, Pagination, Row } from "antd";
import { useCallback, useEffect, useRef, useState } from "react";
import AliceCarousel, { EventObject } from 'react-alice-carousel';
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { EJobFilter, jobLoad, jobsDataStore, refreshStore } from "src/Store/job.store";
import { getJobs, getRcmdJobs } from "src/api/job-apis";
import { useSubscription } from "src/libs/global-state-hook";
import useWindowSize from "src/utils/useWindowSize";
import HeadOfCenterSection from "../HeadOfCenterSection";
import JobItem from "./JobItem";
import "./SectionCenterFreelancerHome.css";
import { CaretLeftOutlined, CaretRightOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";
import Loader from "src/Components/SharedComponents/Loader/Loader";
export default function SectionCenterFreelancerHome({ user }) {
  const { t } = useTranslation(['main']);
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)

  const { state: rcmdJobs, setState: setRcmdJobs } = useSubscription(jobsDataStore)
  const jobLoader = useSubscription(jobLoad)

  const { categories, skills, filter, isFirstLoad, page, pageSize } = jobLoader.state

  const [activeRmcdIndex, setActiveRmcdIndex] = useState(0);

  const rcmdCarousel = useRef<AliceCarousel>(null);


  const handleGetData = useCallback((p?: number | undefined, ps?: number | undefined) => {
    setLoading(true);
    switch (filter) {
      case EJobFilter.RCMD:
        return 
      case EJobFilter.RECENT:
        return getJobs({
          categories,
          skills,
          sortBy: '_id:asc',
          limit: ps || pageSize,
          page: p || page
        })
      default: return getJobs({
        limit: ps || pageSize,
        page: p || page,
        categories,
        skills,
      })
    }
  }, [filter, pageSize, page, categories, skills])

  useEffect(() => {
    if (isFirstLoad && user?._id) {
      getRcmdJobs(user?._id, {
        limit: 28,
        page: 1
      }).then(res => {
        setRcmdJobs(res.data?.results)
        setTotal(res.data?.totalResults)
      }).catch(err => {
        toast.error('something went wrong, ', err)
      }).finally(() => {
        setLoading(false)
        jobLoader.setState({ ...jobLoader.state, isFirstLoad: false })
      })
    }

  }, [user?._id, isFirstLoad, jobLoader, rcmdJobs?.length])

  // useEffect(() => {
  //   if (isFirstLoad && user?._id && user?.favoriteJobs) {
  //     getRcmdJobs(user?._id, {
  //       limit: 36,
  //       page: 1
  //     }).then(res => {
  //       setRcmdJobs(res.data?.results)
  //       setTotal(res.data?.totalResults)
  //     }).catch(err => {
  //       toast.error('something went wrong, ', err)
  //     }).finally(() => {
  //       setLoading(false)
  //       jobLoader.setState({ ...jobLoader.state, isFirstLoad: false })
  //     })
  //   }

  // }, [user?._id, isFirstLoad, setRcmdJobs, jobLoader, rcmdJobs?.length])

  const handleChangePage = useCallback((p: number) => {
    if (p === page) return
    jobLoader.setState({ ...jobLoader.state, page: p })
    handleGetData(p).then(res => {
      setRcmdJobs(res.data?.results)
    }).catch(err => {
      toast.error('something went wrong, ', err)
    }).finally(() => {
      setLoading(false)
    })
  }, [handleGetData, jobLoader, page, setRcmdJobs])

  const handleChangePageSize = useCallback((ps: number) => {
    if (ps === pageSize) return
    jobLoader.setState({ ...jobLoader.state, pageSize: ps })
    handleGetData(undefined, ps).then(res => {
      setRcmdJobs(res.data?.results)
    }).catch(err => {
      toast.error('something went wrong, ', err)
    }).finally(() => {
      setLoading(false)
    })
  }, [handleGetData, jobLoader, pageSize, setRcmdJobs])

  useEffect(() => {
    console.log(rcmdCarousel?.current.state)
  }, [rcmdCarousel])

  const slideRcmdNext = (e) => {
    if (activeRmcdIndex < pageSize - 4) {
      console.log('activeRmcdIndex', activeRmcdIndex + 4)
      rcmdCarousel?.current?.slideTo(activeRmcdIndex + 4)
      setActiveRmcdIndex(activeRmcdIndex + 4)
    }
  }

  const slideRcmdPrev = (e) => {
    if (activeRmcdIndex > 0) {
      console.log('activeRmcdIndex', activeRmcdIndex - 4)
      rcmdCarousel?.current?.slideTo(activeRmcdIndex - 4)
      setActiveRmcdIndex(activeRmcdIndex - 4)
    }
  }

  return (
    <Col className="mb-4 px-lg-3" xs={24} md={18} lg={24}>
      {/* <div className="mb-5 mt-4" style={{
        background: "rgba(255, 255, 255, 0.7)",
        borderRadius: 8, position: 'relative', padding: '4px 12px'
      }}>
        <Row style={{ display: 'flex' }}>
          <h4 className="fw-bold py-1" style={{ margin: 0, color: '#454047' }}>
            {t("Best Matches")}
          </h4>
        </Row>
        {
          !loading ? <Row justify="center" className="mt-1">
            <Col span={24}>
              <AliceCarousel
                autoWidth={false}
                mouseTracking
                activeIndex={activeRmcdIndex}
                items={rcmdJobs?.map((j) => (<JobItem data={j} t={t} user={user} />))}
                paddingRight={activeRmcdIndex === pageSize - 4 ? 0 : 50}
                paddingLeft={activeRmcdIndex === pageSize - 4 ? 50 : 0}
                animationDuration={300}
                responsive={responsive}
                disableDotsControls
                disableButtonsControls
                ref={rcmdCarousel}
              />
            </Col>
            <Button type="primary" style={{
              display: activeRmcdIndex === 0 ? 'none' : 'block', position: 'absolute',
              left: -20, top: '45%', height: 60, width: 60, paddingRight: 6,
              background: "white",
              boxShadow: `rgba(14, 30, 37, 0.12) 0px 2px 4px 0px, rgba(14, 30, 37, 0.32) 0px 2px 16px 0px`
            }} shape="circle"
              size={'large'} onClick={(e) => slideRcmdPrev(e)}>
              <CaretLeftOutlined style={{ fontWeight: 700, fontSize: '30px', color: 'gray' }} />
            </Button>
            <Button type="primary"
              style={{
                display: activeRmcdIndex === pageSize - 4 ? 'none' : 'block', position: 'absolute',
                right: -30, top: '45%', height: 60, width: 60, paddingLeft: 6,
                background: "white",
                boxShadow: "rgba(14, 30, 37, 0.12) 0px 2px 4px 0px, rgba(14, 30, 37, 0.32) 0px 2px 16px 0px"
              }} shape="circle"
              size={'large'} onClick={(e) => slideRcmdNext(e)}>
              <CaretRightOutlined style={{ fontWeight: 700, fontSize: '30px', color: 'gray' }} />
            </Button>
          </Row> : <div className="d-flex justify-content-center align-items-center" style={{ height: "10vh" }}>
            <Loader />
          </div>
        }
      </div> */}
      <div className="mb-5 mt-5" style={{
        background: "rgba(255, 255, 255, 0.7)",
        borderRadius: 8, position: 'relative', padding: '4px 12px'
      }}>
        <Row style={{ display: 'flex' }}>
          <h4 className="fw-bold py-1" style={{ margin: 0, color: '#454047' }}>
            {t("Best Matches")}
          </h4>
        </Row>
        {
          !loading ? <Row justify="center" className="mt-1">
            <Col span={24}>
              <AliceCarousel
                autoWidth={false}
                mouseTracking
                activeIndex={activeRmcdIndex}
                items={rcmdJobs?.map((j) => (<JobItem key={j._id} data={j} t={t} user={user} />))}
                paddingRight={activeRmcdIndex === pageSize - 4 ? 0 : 50}
                paddingLeft={activeRmcdIndex === pageSize - 4 ? 50 : 0}
                animationDuration={300}
                responsive={responsive}
                disableDotsControls
                disableButtonsControls
                ref={rcmdCarousel}
              />
            </Col>
            <Button type="primary" style={{
              display: activeRmcdIndex === 0 ? 'none' : 'block', position: 'absolute',
              left: -20, top: '45%', height: 60, width: 60, paddingRight: 6,
              background: "white",
              boxShadow: `rgba(14, 30, 37, 0.12) 0px 2px 4px 0px, rgba(14, 30, 37, 0.32) 0px 2px 16px 0px`
            }} shape="circle"
              size={'large'} onClick={(e) => slideRcmdPrev(e)}>
              <CaretLeftOutlined style={{ fontWeight: 700, fontSize: '30px', color: 'gray' }} />
            </Button>
            <Button type="primary"
              style={{
                display: activeRmcdIndex === pageSize - 4 ? 'none' : 'block', position: 'absolute',
                right: -30, top: '45%', height: 60, width: 60, paddingLeft: 6,
                background: "white",
                boxShadow: "rgba(14, 30, 37, 0.12) 0px 2px 4px 0px, rgba(14, 30, 37, 0.32) 0px 2px 16px 0px"
              }} shape="circle"
              size={'large'} onClick={(e) => slideRcmdNext(e)}>
              <CaretRightOutlined style={{ fontWeight: 700, fontSize: '30px', color: 'gray' }} />
            </Button>
          </Row> : <div className="d-flex justify-content-center align-items-center" style={{ height: "10vh" }}>
            <Loader />
          </div>
        }
      </div>
      {/* <div style={{
        display: 'flex', justifyContent: 'end',
        background: 'white', alignContent: 'center',
        alignItems: 'center', padding: 16, borderRadius: 10
      }}>
        <Pagination
          className="mt-5"
          total={total}
          pageSize={pageSize}
          current={page}
          showSizeChanger
          showQuickJumper
          responsive

          onChange={(p) => handleChangePage(p)}
          onShowSizeChange={(_, s) => handleChangePageSize(s)}
          showTotal={(total) => `Total ${total} items`}
        />
      </div> */}
    </Col >
  );
}



const responsive = {
  0: { items: 1 },
  568: { items: 2 },
  768: { items: 3 },
  1248: { items: 4 },
};

