import { Button, Layout, Row, Spin } from 'antd'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getFreelancers } from 'src/api/freelancer-apis'
import Saved from '../../../Components/ClientComponents/SavedComponent'
import './Freelancer.css'

export default function FreelancerList() {
  const { t } = useTranslation(['main'])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [listFreelancers, setListFreelancers] = useState([])

  const getAllListFreelancers = async () => {
    setLoading(true)
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

  useEffect(() => {
    getAllListFreelancers()
  }, [page])

  return (
    <>
      {loading ? (
        <Spin />
      ) : (
        <Layout>
          {listFreelancers.map(freelancer => (
            <Saved freelancer={freelancer} key={freelancer._id} />
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
        </Layout>
      )}
    </>
  )
}
