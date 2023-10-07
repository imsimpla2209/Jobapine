/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
import { fakeFreelancerState, fakeJobsState } from "Store/fake-state";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import './SearchBarJobsFreelancer.css';


export default function SearchBarJobsFreelancer(props) {
  const { i18n, t } = useTranslation(['main']);
  let lang = i18n.language;
  // const { arr, setarr, itemSearchList, setitemSearchList, setsearchList } = useContext(SearchContext)
  const navigate = useNavigate();
  const user = fakeFreelancerState;
  const jobs = fakeJobsState;
  useEffect(() => {
    // sessionStorage.setItem('searchArray', JSON.stringify(user.searchHistory))
    // dispatch(freelancerDataAction());

  }, []);

  const handle = (e) => {
    // setitemSearchList(e.target.value)
  }

  // useEffect(() => {
  //  itemSearchList === "" && setsearchList([])
  // }, [itemSearchList])

  const searchDatabase = () => {
    // let tempArr = [];
    // jobs.map((e) => e.skills?.includes(itemSearchList) && tempArr.push(e))
    // console.log(tempArr);
    // setsearchList(tempArr)
    // navigate({ pathname: "/search" })
    // if (itemSearchList !== "") {
    //   let arr2 = []
    //   arr != null ? arr2 = [itemSearchList, ...arr] :
    //     arr2 = [itemSearchList]
    //   user.searchHistory != null ?
    //     updateUserData('freelancer', { searchHistory: [...user?.searchHistory, ...arr2] })
    //     : updateUserData('freelancer', { searchHistory: [...arr2] })
    //   sessionStorage.setItem('searchArray', JSON.stringify(arr2))
    //   setarr([...arr2])
    // }
  }
  return (
    <div>
      <div className="col-8 input-group form-outline has-success">
        <input
          onChange={handle}
          value={'itemSearchList'}
          id="input"
          type="search"
          style={{height: "35.5px" , borderRadius : 0 }}
          className={`form-control text-dark bg-white ${lang =='vi' ?"rounded-end" :  "rounded-start"}`}
          placeholder={t("Search For Jobs")}
        />
        <Link onClick={searchDatabase} to={""}>
          <button
            id="search-button"
            type="button"
            style = {{borderRadius : 0 , fontSize:'10px' }}
            className={`btn bg-jobsicker bg-invert search  ${lang =='vi' ?"rounded-start" :  "rounded-end"}`}
          >

            <i className="fas fa-search" style={{lineHeight : '22px'}} />
          </button>
        </Link>
      </div>
      <span className="d-block pt-2">
        <Link to='/Search' className="advanced-search-link" style={{fontSize:'13.5px' , color:'#3CAF24', fontWeight:"600"}}>
          {t("AdvancedSearch")}
        </Link>
      </span>
    </div>

  )
}
