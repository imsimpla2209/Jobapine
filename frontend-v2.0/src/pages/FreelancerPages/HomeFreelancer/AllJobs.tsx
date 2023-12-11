/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */

import { Card, Col, Divider, Pagination, Result, Row, Tag } from 'antd'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import JobItem, { ESize } from 'src/Components/FreelancerComponents/SectionCenterFreelancerHome/JobItem'
import Loader from 'src/Components/SharedComponents/Loader/Loader'
import { locationStore } from 'src/Store/commom.store'
import { clientStore, freelancerStore } from 'src/Store/user.store'
import { getJobs } from 'src/api/job-apis'
import { useSubscription } from 'src/libs/global-state-hook'
import styled from 'styled-components'
import SearchBarJobsFreelancer from '../../../Components/FreelancerComponents/SearchBarJobsFreelancer'

export interface IFilterOptions {
  complexity?: any[]
  categories?: any[]
  skills?: any[]
  locations?: any[]
  type?: any[]
  currentStatus?: any[]
  duration?: any
  budget?: any
  amount?: any
  proposals?: any
  nOEmployee?: any
}

export default function AllJobs() {
  const { i18n, t } = useTranslation(['main'])
  const [searchData, setsearchData] = useState([])
  const [text, searchFilterText] = useState('')
  const [total, setTotal] = useState(0)
  const freelancer = useSubscription(freelancerStore).state
  const [filterOption, setfilterOption] = useState<IFilterOptions>({})
  const [searchResults, setsearchResults] = useState([])
  const [refresh, onRefresh] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [pageSize, setPageSize] = useState(20)
  const [page, setPage] = useState(1)

  const handleSearh = useCallback(
    (p?: number, ps?: number) => {
      setLoading(true)
      setPage(p || page)
      setPageSize(ps || pageSize)
      if (searchResults?.length > 0) {
        console.log(page, pageSize, pageSize, page, searchResults?.slice((page - 1) * pageSize, pageSize * page))
        setTotal(searchResults?.length)
        setsearchData(searchResults?.slice((page - 1) * pageSize, pageSize * page))
        setLoading(false)
      } else {
        getJobs({
          limit: ps || pageSize,
          page: p || page,
        })
          .then(res => {
            setsearchData(res.data?.results)
            setTotal(res.data?.totalResults)
          })
          .catch(err => {
            console.log('advanced search err', err)
          })
          .finally(() => {
            setLoading(false)
          })
      }
    },
    [page, pageSize, filterOption, searchResults]
  )

  useEffect(() => {
    if (searchResults?.length > 0) {
      handleSearh()
    }
  }, [searchResults])

  useEffect(() => {
    handleSearh()
  }, [])

  return (
    <div className="container-md container-fluid-sm ">
      <div className="row" style={{ paddingTop: 20 }}>
        <div className="col-lg-12 col-xs-12">
          <div>
            <div className="row justify-content-center">
              <div className="col-8">
                <SearchBarJobsFreelancer
                  textSearch={text}
                  setSearchText={searchFilterText}
                  getSearchResults={setsearchResults}
                />
              </div>
            </div>

            <Divider style={{ marginTop: 16 }} />
          </div>
          <>
            {loading ? (
              <div className="d-flex justify-content-center align-items-center" style={{ height: '10vh' }}>
                <Loader />
              </div>
            ) : (
              <div className="mt-3">
                {searchData.length === 0 ? (
                  <div className="col-12 bg-white">
                    <Result
                      status="404"
                      title="Oops, sorry mah bro"
                      subTitle={
                        <>
                          <h3 className="fw-bold text-center py-2 pt-5 " style={{ color: '#124C82' }}>
                            {t('There are no results that match your search')}
                          </h3>

                          <h6 className="text-center " style={{ color: '#124C82' }}>
                            {t('Please try adjusting your search keywords or filters')}
                          </h6>
                        </>
                      }
                      // extra={<Button type="primary">Back Home</Button>}
                    />
                  </div>
                ) : (
                  <>
                    <Row wrap>
                      {searchData?.map((item, ix) => (
                        <Col
                          span={6}
                          key={ix}
                          style={{
                            height: 'auto',
                          }}
                        >
                          <JobItem data={item} t={t} freelancer={freelancer} size={ESize.Medium} />
                        </Col>
                      ))}
                    </Row>
                    <Card style={{ marginBottom: 20 }}>
                      <Pagination
                        total={total}
                        pageSize={pageSize}
                        current={page}
                        showSizeChanger={false}
                        responsive
                        onChange={p => handleSearh(p)}
                        onShowSizeChange={(_, s) => handleSearh(null, s)}
                        showTotal={total => `Total ${total} items`}
                      />
                    </Card>
                  </>
                )}
              </div>
            )}
          </>
        </div>
      </div>
    </div>
  )
}

export const FilterTag = styled(Tag)`
  color: #ffffff;
  font-size: 17px;
  font-weight: 500;
  padding: 8px 12px;
  border-radius: 32px;
  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
  text-shadow: rgba(0, 0, 0, 0.25) 0 3px 8px;
`
