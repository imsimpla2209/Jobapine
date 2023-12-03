/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import { useAuth } from 'src/Components/Providers/AuthProvider'
import AdminRoutesWithSeparateCss from 'src/Routes/AdminRoutesWithoutCss'
import { categoryStore, locationStore, skillStore } from 'src/Store/commom.store'
import { getAllCategories } from 'src/api/category-apis'
import { getSkills } from 'src/api/job-apis'
import { useSubscription } from 'src/libs/global-state-hook'
import { useSocket } from 'src/socket.io'
import { ESocketEvent } from 'src/utils/enum'
import BeforeLoginRoutes from '../Routes/BeforeLoginRoutes'
import ClientRoutes from '../Routes/ClientRoutes'
import Loader from './../Components/SharedComponents/Loader/Loader'
import FreelancerRoutes from './../Routes/FreelancerRoutes'

export default function LayOut() {
  const { authenticated, loading, id } = useAuth()
  const [usrType, setUsrType] = useState('')
  const { setState } = useSubscription(locationStore)
  const { appSocket } = useSocket()

  useEffect(() => {
    if (authenticated) {
      setUsrType(localStorage.getItem('userType') || '')
      appSocket.emit(ESocketEvent.USER_CONNECTED, { socketId: appSocket.id, userId: id })
    }
    return () => {
      appSocket.emit(ESocketEvent.USER_DISCONNECTED, { socketId: appSocket.id, userId: id })
    }
  }, [authenticated])

  useEffect(() => {
    getSkills().then(res => skillStore.updateState(res.data))
    getAllCategories().then(res => categoryStore.updateState(res.data))

    fetch('https://raw.githubusercontent.com/sunrise1002/hanhchinhVN/master/dist/tinh_tp.json') //eslint-disable-line
      .then(response => response.json())
      .then(responseJson => {
        setState(
          Object.values(responseJson).map((loc: any) => {
            return {
              name: loc.name,
              code: loc.code,
            }
          })
        )
      })
      .catch(error => {
        console.error(error)
      })
  }, [])

  if (!loading) {
    if (authenticated) {
      if (usrType === 'Freelancer') {
        return <FreelancerRoutes />
      } else if (usrType === 'Client') {
        return <ClientRoutes />
      } else if (usrType === 'admin') {
        return <AdminRoutesWithSeparateCss />
      } else {
        return (
          <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
            <Loader />
          </div>
        )
      }
    } else {
      return <BeforeLoginRoutes />
    }
  } else {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Loader />
      </div>
    )
  }
}
