import { Button, Empty, Row, Spin } from 'antd'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Saved from 'src/Components/ClientComponents/SavedComponent'
import { filterFreelancers, getFreelancers } from 'src/api/freelancer-apis'
import { IFreelancer } from 'src/types/freelancer'

export default function FreelancerListCards({ filterOption, saved }) {
  const { t } = useTranslation(['main'])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [listFreelancers, setListFreelancers] = useState<IFreelancer[]>([])
  const getAllListFreelancers = async () => {
    setLoading(true)
    if (saved) {
    } else {
      await getFreelancers({ limit: 10, page: page })
        .then(res => {
          if (res.data.results?.length) {
            setListFreelancers([...listFreelancers, ...res.data.results])
          } else {
            setPage(0)
          }
        })
        .finally(() => setLoading(false))
    }
  }

  const getFilteredListFreelancers = async () => {
    setLoading(true)
    if (!filterOption?.skills?.length) delete filterOption?.skills
    if (!filterOption?.preferJobType?.length) delete filterOption?.preferJobType
    if (!filterOption?.currentLocations?.length) delete filterOption?.currentLocations

    await filterFreelancers(filterOption, { limit: 10, page: page })
      .then(res => {
        setListFreelancers(res.data.results)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    page > 0 && getAllListFreelancers()
  }, [page])

  useEffect(() => {
    setPage(1)
    getFilteredListFreelancers()
  }, [filterOption])

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

          {page ? (
            <Row
              align="middle"
              style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 10 }}
            >
              <Button
                type="primary"
                style={{
                  width: 300,
                  padding: 4,
                  color: 'white',
                  background: 'linear-gradient(92.88deg, #455eb5 9.16%, #5643cc 43.89%, #673fd7 64.72%)',
                }}
                onClick={() => setPage(page + 1)}
              >
                {t('Load more')}
              </Button>
            </Row>
          ) : null}
        </>
      ) : (
        <Empty description={'No freelancer found'} />
      )}
    </div>
  )
}
