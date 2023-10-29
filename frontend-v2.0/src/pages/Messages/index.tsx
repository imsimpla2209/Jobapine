import React, { useState } from "react";
import "../../assets/style/style.css";
import "./Messages.css";
import MesssagesContent from "Components/SharedComponents/MessagesContent/MesssagesContent";
import MessagesLeftSide from "Components/SharedComponents/MesssagesLeftSide/MessagesLeftSide";
import { freelancerStore, userStore } from "src/Store/user.store";
import { useSubscription } from "src/libs/global-state-hook";

export default function Messages() {
  const freelancer = useSubscription(freelancerStore)
  const user = useSubscription(userStore)
  const [selectedMessageRoom, setSelectedMessageRoom] = useState({})

  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <aside className="col-3 d-none-md">
            <MessagesLeftSide
              freelancerID={freelancer?.state?._id}
              userID={user?.state?._id || user?.state?.id}
              selectedMessageRoom={selectedMessageRoom}
              setSelectedMessageRoom={setSelectedMessageRoom}
            />
          </aside>
          <div className="col-sm-12 col-md-9">
            <MesssagesContent
              userID={user?.state?._id || user?.state?.id}
              selectedMessageRoom={selectedMessageRoom}
            />
          </div>
        </div>
      </div>
    </>
  );
}
