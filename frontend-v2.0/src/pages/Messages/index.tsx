import MesssagesContent from 'Components/SharedComponents/MessagesContent/MesssagesContent'
import MessagesLeftSide from 'Components/SharedComponents/MesssagesLeftSide/MessagesLeftSide'
import { useState } from 'react'
import { freelancerStore, userStore } from 'src/Store/user.store'
import { useSubscription } from 'src/libs/global-state-hook'
import '../../assets/style/style.css'
import './Messages.css'

export default function Messages() {
  const freelancer = useSubscription(freelancerStore)
  const user = useSubscription(userStore)
  const [selectedMessageRoom, setSelectedMessageRoom] = useState({})

  return (
    <>
      <div className="container-fluid">
        <div className="row pt-4">
          <aside className="col-12 col-md-3">
            <MessagesLeftSide
              freelancerID={freelancer?.state?._id}
              userID={user?.state?._id || user?.state?.id}
              selectedMessageRoom={selectedMessageRoom}
              setSelectedMessageRoom={setSelectedMessageRoom}
            />
          </aside>
          <div className="col-sm-12 col-md-9">
            <MesssagesContent userID={user?.state?._id || user?.state?.id} selectedMessageRoom={selectedMessageRoom} />
          </div>
        </div>
      </div>
    </>
  )
}
