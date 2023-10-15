/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import BeforeLoginRoutes from '../Routes/BeforeLoginRoutes'
import ClientRoutes from '../Routes/ClientRoutes'
import FreelancerRoutes from './../Routes/FreelancerRoutes'
import Loader from './../Components/SharedComponents/Loader/Loader'
import { createSubscription, useSubscription } from 'src/libs/global-state-hook'

const userStore = createSubscription(null)

export default function LayOut() {
  const { state: userStoreState } = useSubscription(userStore)

  const [usr, setUsr] = useState(null)
  const [usrType, setUsrType] = useState('')

  useEffect(() => {
    // auth.onAuthStateChanged(user => {
    //   if (user) {
    //     setUsr(user);
    //     setUsrType(localStorage.getItem('userType'));
    //   }
    // });
  }, [])
  return <ClientRoutes />

  if (usr) {
    if (usrType === 'freelancer') {
      return <FreelancerRoutes />
    } else if (usrType === 'client') {
      return <ClientRoutes />
    } else {
      return <Loader />
    }
  } else {
    return <BeforeLoginRoutes />
  }
}
