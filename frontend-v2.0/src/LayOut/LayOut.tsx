/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import BeforeLoginRoutes from "../Routes/BeforeLoginRoutes";
import ClientRoutes from "../Routes/ClientRoutes";
import FreelancerRoutes from "./../Routes/FreelancerRoutes";
import Loader from "./../Components/SharedComponents/Loader/Loader";
import { useAuth } from "src/Components/Providers/AuthProvider";
import { locationStore } from "src/Store/commom.store";
import { useSubscription } from "src/libs/global-state-hook";

export default function LayOut() {
  const { authenticated, loading } = useAuth();
  const [usrType, setUsrType] = useState("");
  const { setState } = useSubscription(locationStore);


  useEffect(() => {
    if (authenticated) {
      setUsrType(localStorage.getItem('userType'));
    }
  }, [authenticated])

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/sunrise1002/hanhchinhVN/master/dist/tinh_tp.json') //eslint-disable-line
      .then((response) => response.json())
      .then((responseJson) => {
        setState(Object.values(responseJson).map((loc: any) => {
          return {
            name: loc.name,
            code: loc.code,
          }
        }));
      })
      .catch((error) => {
        console.error(error);
      });
  }, [])

  if (!loading) {
    if (authenticated) {
      if (usrType === "Freelancer") {
        return <FreelancerRoutes />
      } else if (usrType === "Client") {
        return <ClientRoutes />
      } else {
        return <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
          <Loader />
        </div>
      }
    } else {
      return <BeforeLoginRoutes />
    }
  }
  else {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <Loader />
      </div>
    )
  }
}