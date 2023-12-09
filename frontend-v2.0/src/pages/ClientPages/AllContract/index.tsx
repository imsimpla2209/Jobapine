/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { clientStore } from 'src/Store/user.store'
import { getContracts } from 'src/api/contract-apis'
import { useSubscription } from 'src/libs/global-state-hook'
import OneContract from './OneContract'
import { Card } from 'antd'

export default function AllContracts() {
  const { t } = useTranslation(['main'])
  const [contracts, setContracts] = useState([])
  const {
    state: { id: clientId },
  } = useSubscription(clientStore, ['id'])

  useEffect(() => {
    clientId && getContracts({ client: clientId }).then(res => setContracts(res.data.results))
  }, [clientId])

  return (
    <div style={{ padding: '40px 100px' }}>
      <Card title={t('Contracts')}>
        {/* <div className="card-header bg-white p-3">
                {data && <SearchContract />}
              </div> */}

        {contracts?.length ? (
          contracts.map((contract, index) => {
            return (
              <div className="card mt-3 mb-3 px-4">
                <OneContract contract={contract} key={index} />
              </div>
            )
          })
        ) : (
          <p className="h3 py-5">You haven't started any contracts yet.</p>
        )}
      </Card>
    </div>
  )
}
