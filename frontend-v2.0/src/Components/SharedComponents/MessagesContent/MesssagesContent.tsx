/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useRef, useState } from "react";
import IncomeMsg from "./IncomeMsg";
import OutgoingMsg from "./OutgoingMsg";
import { createMessage, getMessages } from "src/api/message-api";
import { isEmpty } from "lodash";
import { useSocket } from "src/socket.io";
import { ESocketEvent } from "src/utils/enum";
import Loader from "../Loader/Loader";
import { Button, Drawer, FloatButton, Skeleton } from "antd";
import ProposalCard from "src/Components/FreelancerComponents/ProposalCard";
import { useTranslation } from "react-i18next";
import { ArrowDownOutlined } from "@ant-design/icons";

export default function MesssagesContent({ selectedMessageRoom, userID }: any) {
  const { t } = useTranslation(['main'])
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const setElRef = useRef<HTMLDivElement>(null);
  const { appSocket } = useSocket();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!isEmpty(selectedMessageRoom)) {
      setLoading(true);
      setPage(1);
      setTotal(0);
      getMsgs().finally(() => setTimeout(() => setLoading(false), 500));
    } else {
      setMessages([]);
    }

  }, [selectedMessageRoom]);

  const scrollToBottom = () => {
    setElRef.current?.scrollIntoView({
      behavior: "smooth", block: 'nearest', inline: 'end'
    })
  }

  useEffect(() => {
    setElRef.current?.scrollIntoView({
      block: 'nearest', inline: 'end'
    })
  }, [loading]);

  useEffect(() => {
    appSocket.on(ESocketEvent.SENDMSG, (data) => {
      if (data?.to === userID && data?.room === selectedMessageRoom?._id) {
        console.log(`Get Message from room: ${selectedMessageRoom?._id}`, data)
        setMessages([...messages, { ...data, createdAt: new Date(), seen: false },])
        scrollToBottom()
      }
    })

    return () => {
      appSocket.off(ESocketEvent.SENDMSG)

    }
  }, [userID, selectedMessageRoom, messages])

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
    scrollToBottom()
  }

  const msgHandler = e => {
    setMessage(e.target.value);
  }

  const getMsgs = (p = 1, firstLoad = true) => {
    return getMessages({ room: selectedMessageRoom?._id, sortBy: 'createdAt:desc', limit: 15, page: p }).then((res) => {
      if (!firstLoad) {
        setMessages([...res.data?.results?.reverse(), ...messages])
      } else {
        setMessages(res.data?.results?.reverse())
        setTotal(res.data?.totalPages)
      }
    }).catch((err => {
      console.log(err)
    }))
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

  const handleKeyDown = async (event) => {
    if (event.key === 'Enter') {
      sendMsg()
    }
  }

  const getMoreMSG = async (p) => {
    setPage(prev => prev + 1);
    getMsgs(p, false)
  }

  return (
    <div className="card bg-white mt-2 mb-5">
      <div className="mesgs position-relative h-100" style={{ borderRadius: 20 }}>
        <Skeleton loading={loading} active avatar >
          {
            !isEmpty && <Button type="primary" onClick={() => setOpen(true)} style={{
              position: 'absolute',
              top: 10,
              right: 26,
              zIndex: 100
            }}>
              {t("View Message Information")}
            </Button>
          }
          <Drawer width={500} title={t("Single Direct Message")} placement="right" onClose={() => setOpen(false)} open={open}>
            {selectedMessageRoom?.proposal &&
              <ProposalCard proposal={selectedMessageRoom?.proposal}
                isInMSG={true}
                jobId={selectedMessageRoom?.proposal?.job} ind={0} />
            }
          </Drawer>
          <div className="msg_history" style={{ height: '70vh' }} >
            {page < total && <Button size={'middle'} onClick={() => getMoreMSG(page + 1)}>{t("Load More Messages")}</Button>}
            {messages?.map(item =>
              item.from === userID ?
                <OutgoingMsg key={item?.createdAt} avatar={avatarsList?.get(userID)} msg={item} /> :
                <IncomeMsg key={item?._id} avatar={avatarsList?.get(item?.from)} msg={item} />
            )}
            <div ref={setElRef}></div>
          </div>
          <Button type="dashed" shape="circle" style={{
            position: 'absolute',
            bottom: 100,
            right: 32,
            zIndex: 100
          }} icon={<ArrowDownOutlined style={{ fontSize: 18 }} />} onClick={() => scrollToBottom()} />
          <div className="type_msg">
            <div className="input_msg_write" style={{ padding: '8px 0px' }}>
              <input
                onKeyDown={handleKeyDown}
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

        </Skeleton>
        <Skeleton loading={loading} active avatar />
        <Skeleton loading={loading} active avatar />
        <Skeleton loading={loading} active avatar />
        <Skeleton loading={loading} active avatar />
        <Skeleton loading={loading} active avatar />
      </div>
    </div>
  );
}
