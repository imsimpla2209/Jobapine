import { Card, Empty, Pagination, Row, Spin } from 'antd'
import { useEffect, useState } from 'react'
import Saved from 'src/Components/ClientComponents/SavedComponent'
import { clientStore } from 'src/Store/user.store'
import { filterFreelancers } from 'src/api/freelancer-apis'
import { useSubscription } from 'src/libs/global-state-hook'
import { IFreelancer } from 'src/types/freelancer'

export default function FreelancerListCards({ filterOption, saved }) {
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [listFreelancers, setListFreelancers] = useState<IFreelancer[]>([])
  let {
    state: { favoriteFreelancers },
  } = useSubscription(clientStore)

  const [total, setTotal] = useState(0)

  const getFilteredListFreelancers = async (p = null) => {
    setLoading(true)
    if (saved) {
      filterOption['id'] = favoriteFreelancers
    }
    if (!filterOption?.skills?.length) delete filterOption?.skills
    if (!filterOption?.preferJobType?.length) delete filterOption?.preferJobType
    if (!filterOption?.currentLocations?.length) delete filterOption?.currentLocations

    await filterFreelancers(filterOption, { limit: 10, page: p || page })
      .then(res => {
        setListFreelancers(res.data.results)
        setTotal(res.data.totalResults)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    setPage(1)
    getFilteredListFreelancers()
  }, [filterOption, favoriteFreelancers])

  const handleChangePageJob = (p: number) => {
    if (p === page) return
    setPage(p)
    getFilteredListFreelancers(p)
  }

  return (
    <div style={{ padding: 16 }}>
      {loading ? (
        <Spin />
      ) : listFreelancers?.length ? (
        <>
          {listFreelancers.map(freelancer => (
            <Row style={{ marginBottom: 16 }}>
              <Saved freelancer={freelancer} key={freelancer._id} />
            </Row>
          ))}

          <Card>
            <Pagination
              total={total}
              pageSize={10}
              current={page}
              showSizeChanger={false}
              responsive
              onChange={p => handleChangePageJob(p)}
              showTotal={total => `Total ${total} freelancers`}
            />
          </Card>
        </>
      ) : (
        <Card style={{ minHeight: 'calc(100vh - 100px)' }} bodyStyle={{ alignItems: 'center' }}>
          <Empty description={'No freelancer found'} />
        </Card>
      )}
    </div>
  )
}
