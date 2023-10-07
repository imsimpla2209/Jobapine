/* eslint-disable react-hooks/exhaustive-deps */
import { fakeJobsState } from "Store/fake-state";
import { useEffect } from "react";
import JobPostsHeader from "../../../Components/ClientComponents/JobPostsHeader";
import Loader from "../../../Components/SharedComponents/Loader/Loader";
import JobPostLi from "./../../../Components/ClientComponents/JobPostLi";
import JobPostsFilters from "./../../../Components/ClientComponents/JobPostsFilters";

export default function AllJobPosts() {
  const jobs = fakeJobsState;
  useEffect(() => {
    console.log(jobs);
  }, []);
  return (
    <div className="bg-light py-3">
      <div className="container px-5">
        <JobPostsHeader />
        {/* <div className="row border border-1 py-4  bg-white">
          <SearchJobPosts />
        </div> */}
        <div
          className="row border border-1 py-4  bg-light collapse"
          id="collapseExample"
        >
          <JobPostsFilters />
        </div>
        <div className="row border border-1 py-4 bg-white">
          {
            jobs?.length > 0 ?
              jobs?.map((job, ind) => (
                <JobPostLi job={job?.data} id={job?.docID} key={job?.docID} index={ind} />
              ))
              : <Loader />
          }
        </div>
        {/* <div className="row border border-1 py-4  bg-white">
          <JobPostingsPagination />
        </div> */}
      </div>
    </div>
  );
}
