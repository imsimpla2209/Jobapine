/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import IncomeMsg from "./IncomeMsg";
import OutgoingMsg from "./OutgoingMsg";

export default function MesssagesContent() {

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [el, setEl] = useState<any>();

  useEffect(() => {
    getMsgs();
    return () => {
      
    }
  }, []);

  const getMsgs = () => {
    // unSubscribe = db.collection("messages").doc("IpWoNPxWvjnEnXymHpY6").onSnapshot(Msgs => {
    //   Msgs.data().messages && setMessages([...Msgs.data().messages]);
    //   el && (el.scrollTop = el.scrollHeight - el.clientHeight);
    // });
  }

  const msgHandler = e => {
    setMessage(e.target.value);
  }

  const sendMsg = () => {
    // db.collection("messages")
    //   .doc("IpWoNPxWvjnEnXymHpY6")
    //   .update({ freelancerAuthID: auth.currentUser?.uid, messages: [...messages, { Msg: message, time: new Date(), uid: auth.currentUser?.uid }] })
    //   .then(() => {
    //     console.log("sent message")
    //     getMsgs();
    //   })
    //   .catch(err => console.log(err));
    setMessage("");
  }


  return (
    <div className="card bg-white mt-2 mb-5">
      <div className="mesgs">
        <div className="msg_history" ref={setEl}>
          {/* {messages?.map(item =>
            item.uid === auth.currentUser.uid ?
              <OutgoingMsg msg={item} /> :
              <IncomeMsg msg={item} />
          )} */}
        </div>
        <div className="type_msg">
          <div className="input_msg_write">
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
    </div>
  );
}
