
import { Pagination } from "antd";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { EJobFilter, jobLoad, jobsDataStore, refreshStore } from "src/Store/job.store";
import { getJobs, getRcmdJobs } from "src/api/job-apis";
import { useSubscription } from "src/libs/global-state-hook";
import Loader from "../../SharedComponents/Loader/Loader";
import HeadOfCenterSection from "../HeadOfCenterSection";
import JobCard from "./JobCard";
import "./SectionCenterFreelancerHome.css";

export default function SectionCenterFreelancerHome({ user }) {

  const { i18n, t } = useTranslation(['main']);
  const lang = i18n.language;
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)

  const { state, setState } = useSubscription(jobsDataStore)
  const jobLoader = useSubscription(jobLoad)
  const refresh = useSubscription(refreshStore)

  const { categories, skills, filter, isFirstLoad, page, pageSize } = jobLoader.state

  const handleGetData = useCallback((p?: number | undefined, ps?: number | undefined) => {
    setLoading(true);
    switch (filter) {
      case EJobFilter.RCMD:
        return getRcmdJobs(user?._id, {
          limit: ps || pageSize,
          page: p || page
        }, categories, skills)
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

  }, [filter, user?._id, pageSize, page, categories, skills])

  useEffect(() => {
    console.log('rerender')
    if (isFirstLoad && user?._id) {
      console.log('rerender1')
      handleGetData().then(res => {
        setState(res.data?.results)
        setTotal(res.data?.totalResults)
      }).catch(err => {
        toast.error('something went wrong, ', err)
      }).finally(() => {
        setLoading(false)
        jobLoader.setState({ ...jobLoader.state, isFirstLoad: false })
      })
    }
    if (refresh.state.isRefresh === true) {
      setLoading(true);
      setTimeout(() => {
        setTotal(state?.length)
        refresh.setState(false);
        setLoading(false);
      }, 1200)
    }
  }, [user?._id, filter, categories, skills, isFirstLoad, page, pageSize, setState])

  const handleChangePage = useCallback((p: number) => {
    if (p === page) return
    jobLoader.setState({ ...jobLoader.state, page: p })
    handleGetData(p).then(res => {
      setState(res.data?.results)
    }).catch(err => {
      toast.error('something went wrong, ', err)
    }).finally(() => {
      setLoading(false)
    })
  }, [handleGetData, jobLoader, page, setState])

  const handleChangePageSize = useCallback((ps: number) => {
    if (ps === pageSize) return
    jobLoader.setState({ ...jobLoader.state, pageSize: ps })
    handleGetData(undefined, ps).then(res => {
      setState(res.data?.results)
    }).catch(err => {
      toast.error('something went wrong, ', err)
    }).finally(() => {
      setLoading(false)
    })
  }, [handleGetData, jobLoader, pageSize, setState])

  return (
    <div className="col-lg-8 col-xs-12 mb-4 px-lg-3">
      <HeadOfCenterSection />
      {
        !loading
          ? state?.map((item, index) => (
            <div key={index}>
              <JobCard item={item} freelancer={user} lang={lang} />
            </div>
          ))
          : <div className="d-flex justify-content-center align-items-center" style={{ height: "10vh" }}>
            <Loader />
          </div>
      }

      <div style={{ display: 'flex', justifyContent: 'end' }}>
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
      </div>
    </div >
  );
}