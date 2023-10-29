/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState } from "react";
import IncomeMsg from "./IncomeMsg";
import OutgoingMsg from "./OutgoingMsg";
import { createMessage, getMessages } from "src/api/message-api";
import { isEmpty } from "lodash";
import { useSocket } from "src/socket.io";
import { ESocketEvent } from "src/utils/enum";
import Loader from "../Loader/Loader";
import { Button, Drawer } from "antd";
import ProposalCard from "src/Components/FreelancerComponents/ProposalCard";

export default function MesssagesContent({ selectedMessageRoom, userID }: any) {

  const [message, setMessage] = useState("");
  const [error, setErr] = useState("");
  const [messages, setMessages] = useState([]);
  const [el, setEl] = useState<any>();
  const { appSocket } = useSocket();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!isEmpty(selectedMessageRoom)) {
      getMsgs();
    } else {
      setMessages([]);
    }

  }, [selectedMessageRoom]);

  useEffect(() => {
    appSocket.on(ESocketEvent.SENDMSG, (data) => {
      console.log(`Get Message from room: ${selectedMessageRoom?._id}`, data)
      if (data?.to === userID && data?.room === selectedMessageRoom?._id) {
        setMessages([...messages, { ...data, createdAt: new Date(), seen: false },])
      }
    })

    return () => {
      appSocket.off(ESocketEvent.SENDMSG)

    }
  }, [userID, selectedMessageRoom])

  const sendMsg = () => {
    setMessage("")
    const newMsg = {
      from: userID,
      to: selectedMessageRoom?.member?.filter(m => m?._id !== userID)[0]?._id,
      content: message,
      attachments: [],
      room: selectedMessageRoom?._id,
    }
    setMessages([...messages, { ...newMsg, createdAt: new Date(), seen: false }])
    createMessage(newMsg)
  }

  const msgHandler = e => {
    setMessage(e.target.value);
  }

  const getMsgs = () => {
    setLoading(true);
    getMessages({ room: selectedMessageRoom?._id }).then((res) => {
      setMessages(res.data?.results)
    }).catch((err => {
      console.log(err)
      setErr('Cannot load messages');
    })).finally(() => setLoading(false))
  }

  const avatarsList = useMemo(() => {
    console.log('chat room', selectedMessageRoom)
    const avatar = new Map();
    if (!isEmpty(selectedMessageRoom)) {
      selectedMessageRoom?.member?.forEach(m => {
        if (!avatar.get(m?._id)) {
          avatar.set(m?._id, m?.avatar);
        }
      })
    }
    console.log('avatars', avatar)
    return avatar
  }, [selectedMessageRoom])

  return (
    <div className="card bg-white mt-2 mb-5">
      <div className="mesgs position-relative">
        {
          loading ? <Loader></Loader> :
            <div>
              <>
                <Button type="primary" onClick={() => setOpen(true)} style={{
                  position: 'absolute',
                  top: 4,
                  right: 4,
                }}>
                  Open
                </Button>
                <Drawer width={500} title="Basic Drawer" placement="right" onClose={() => setOpen(false)} open={open}>
                  {selectedMessageRoom?.proposal &&
                    <ProposalCard proposal={selectedMessageRoom?.proposal} jobId={selectedMessageRoom?.proposal?.job} ind={1} />
                  }
                </Drawer>
              </>
              <div className="msg_history" ref={setEl}>
                {messages?.map(item =>
                  item.from === userID ?
                    <OutgoingMsg key={item?.content} msg={item} /> :
                    <IncomeMsg key={item?._id} avatar={avatarsList?.get(item?.from)} msg={item} />
                )}
              </div>
              <div className="type_msg">
                <div className="input_msg_write" style={{ padding: '8px 0px' }}>
                  <input

                    type="text"
                    className="form-control write_msg"
                    placeholder="Type a message"
                    value={message}
                    onInput={msgHandler}
                  />
                  <button className="btn msg_send_btn p-1" disabled={!message} onClick={sendMsg}>
                    <i className="fa fa-paper-plane-o" aria-hidden="true"></i>
                  </button>
                </div>
              </div>
            </div>
        }
      </div>
    </div>
  );
}
