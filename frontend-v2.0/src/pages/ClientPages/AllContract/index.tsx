/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { clientStore } from 'src/Store/user.store'
import { getContracts } from 'src/api/contract-apis'
import { useSubscription } from 'src/libs/global-state-hook'
import OneContract from './OneContract'

export default function AllContracts() {
  const { t } = useTranslation(['main'])
  const [contracts, setContracts] = useState([])
  const {
    state: { id: clientId },
  } = useSubscription(clientStore, ['id'])

  useEffect(() => {
    getContracts({ client: clientId }).then(res => setContracts(res.data.results))
  }, [])

  return (
    <div className="bg-gray">
      <div className="container">
        <div className="row px-5">
          <h4 className="col-12 mt-5">{t('Contracts')}</h4>
          <div className="card mt-4 mb-5">
            {/* <div className="card-header bg-white p-3">
                {data && <SearchContract />}
              </div> */}
            <div className="card-body row">
              <div className="col-12 card-list">
                {contracts?.length ? (
                  contracts.map((contract, index) => {
                    return <OneContract contract={contract} key={index} ind={index} />
                  })
                ) : (
                  <p className="h3 py-5">You haven't started any contracts yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
