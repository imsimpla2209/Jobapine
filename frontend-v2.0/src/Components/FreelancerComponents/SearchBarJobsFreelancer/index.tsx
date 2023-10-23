/* eslint-disable jsx-a11y/anchor-is-valid */

/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
import { fakeFreelancerState, fakeJobsState } from "Store/fake-state";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import './SearchBarJobsFreelancer.css';
import { AutoComplete, ConfigProvider, Input } from "antd";
import React from "react";
import { miniSearch } from "src/utils/handleData";
import { jobLoad, jobsDataStore, refreshStore } from "src/Store/job.store";
import { useSubscription } from "src/libs/global-state-hook";


export default function SearchBarJobsFreelancer() {
  const { i18n, t } = useTranslation(['main']);
  let lang = i18n.language;
  // const { arr, setarr, itemSearchList, setitemSearchList, setsearchList } = useContext(SearchContext)
  const navigate = useNavigate();

  const { setState } = useSubscription(jobsDataStore)
  const refreshPage = useSubscription(refreshStore).setState
  const jobLoader = useSubscription(jobLoad)

  useEffect(() => {
    // sessionStorage.setItem('searchArray', JSON.stringify(user.searchHistory))
    // dispatch(freelancerDataAction());

  }, []);

  const handle = (e) => {
    // searchText(e.target.value)
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

  const [text, searchText] = useState('')
  const [searchResults, setSearchResults] = useState([])


  const [verify, setverify] = useState(false);
  // firebaseApp.auth().onAuthStateChanged(user => {
  //   if (user) {
  //     var verf = user.emailVerified;
  //     setverify(verf);
  //   }
  // });

  // React.useEffect(() => {
  //   const results = miniSearch.autoSuggest(text, { fuzzy: 0.3 })
  //   setSearchResults(results)
  //   console.log(results)
  // }, [text])

  const handleSearch = React.useCallback((text: string) => {
    const results = miniSearch.autoSuggest(text, { fuzzy: 0.3 })
    setSearchResults(results)

  }, [text])

  const onSelect = React.useCallback((text: string) => {
    let results = miniSearch.search(text, { fuzzy: 0.2, prefix: true });
    setState(results);
    jobLoader.setState({ ...jobLoader.state, pageSize: results?.length, page: 1, categories: [], skills: [], filter: '' })
    refreshPage({ isRefresh: true })
  }, [text, searchResults])

  return (
    <div>
      <ConfigProvider
        theme={{
          components: {
            Select: {
              optionFontSize: 16,
              optionSelectedBg: '#a2eaf2',
              optionLineHeight: 0.7
            },
          },
        }}
      >
        <AutoComplete
          style={{ width: '100%' }}
          status='warning'
          popupMatchSelectWidth={true}
          notFoundContent={`${t('Nothing matches the search')}😏🥱`}
          options={searchResults?.map(s => {
            return {
              value: s.suggestion,
              label: (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    cursor: 'pointer'
                  }}
                >
                  <span>
                    <p style={{ color: "#6600cc" }}>
                      {s.suggestion}
                    </p>
                  </span>
                </div>
              ),
            }
          })}
          onSelect={onSelect}
          onSearch={handleSearch}
          size="large"
        >
          <Input.Search
            onChange={handle}
            value={text}
            id="input"
            size="large"
            type="search"
            // style={{ height: "44px", borderTopLeftRadius: 20, borderBottomLeftRadius: 20, border: '2px solid #ccc', padding: '0 12' }}
            // className={`form-control text-dark bg-white`}
            placeholder={t("Search For Jobs")}
          />
        </AutoComplete>
      </ConfigProvider>
      {/* <div className="col-8 input-group form-outline has-success">
          <Link onClick={searchDatabase} to={""}>
            <button
              id="search-button"
              type="button"
              style={{ borderRadius: 0, height: "44px", fontSize: '10px' }}
              className={`btn bg-jobsicker bg-invert search rounded-end`}
            >

              <i className="fas fa-search" style={{ lineHeight: '22px' }} />
            </button>
          </Link>
        </div> */}
      <span className="d-block pt-2">
        <Link to='/Search' className="advanced-search-link" style={{ fontSize: '17px', color: '#8529cc', fontWeight: "600" }}>
          {t("AdvancedSearch")}
        </Link>
      </span>
    </div>

  )
}
