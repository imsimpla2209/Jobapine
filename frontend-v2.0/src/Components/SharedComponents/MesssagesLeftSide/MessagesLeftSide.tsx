/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */

import { Tag } from 'antd'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import { getMessageRooms, updateMessageRoom } from 'src/api/message-api'
import { useSocket } from 'src/socket.io'
import { ESocketEvent } from 'src/utils/enum'
import { timeAgo } from 'src/utils/helperFuncs'
import styled from 'styled-components'

export enum EMSGTags {
  CHAT = 'chat',
  CONTACT = 'contact',
}

export default function MessagesLeftSide({ freelancerID, userID, selectedMessageRoom, setSelectedMessageRoom }: any) {
  const { t } = useTranslation(['main'])
  const [tab, setTab] = useState(EMSGTags.CHAT)
  const { appSocket } = useSocket()

  const [searchParams] = useSearchParams()
  const proposalId = searchParams.get('proposalId')
  const [messageRooms, setMessageRooms] = useState<any[]>([])

  useEffect(() => {
    setSelectedMessageRoom(messageRooms.find(message => message.proposal._id === proposalId))
  }, [proposalId, messageRooms])

  useEffect(() => {
    // App socket
    appSocket.on(ESocketEvent.SENDMSG, data => {
      console.log('Get Message:', data)
      if (data?.to === userID) {
        setMessageRooms(
          messageRooms?.map(mr => {
            if (mr?._id === data?.room) {
              console.log('found here')
              return {
                ...mr,
                seen: false,
                createdAt: new Date(),
              }
            }
            return mr
          })
        )
      }
    })

    // The listeners must be removed in the cleanup step, in order to prevent multiple event registrations
    return () => {
      appSocket.off(ESocketEvent.SENDMSG)
    }
  }, [userID])

  useEffect(() => {
    const member = [`${userID}`]
    getMessageRooms({ member, sortBy: 'updatedAt:desc' })
      .then(res => {
        setMessageRooms(res.data.results)
      })
      .catch(err => {
        console.log('Get MSG ERROR: ', err)
      })
  }, [userID])

  useEffect(() => {
    if (freelancerID) {
      // db.collection("freelancer").doc(freelancerID).get().then(doc => setFreelancer(doc.data()));
    }
  }, [])

  const onSeen = _id => {
    setMessageRooms(
      messageRooms?.map(m => {
        if (m?._id === _id) {
          return { ...m, seen: true }
        }
        return m
      })
    )
    updateMessageRoom({ seen: true }, _id)
  }

  return (
    <div className="card bg-white mt-2">
      <div className="card-header" style={{ height: 100 }}>
        <div className="row">
          <div className="col-3">
            <div className="dropdown">
              <button
                className="btn mx-auto btn-md border-gray btn-circle btn-wite m-0 p-0"
                type="button"
                id="dropdownMenuButton1"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={16}
                  height={16}
                  fill="currentColor"
                  className="bi bi-gear-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z" />
                </svg>
              </button>
              <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                <li>
                  <a className="dropdown-item" href="#">
                    Action
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Another action
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Something else here
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-6 d-flex justify-content-center">
            <div className="btn-group border-gray rounded " role="group" aria-label="Basic radio toggle button group">
              <input
                type="radio"
                className="btn-check"
                name="btnradio"
                id="btnradio1"
                autoComplete="off"
                onClick={() => setTab(EMSGTags.CHAT)}
                defaultChecked
              />
              <label className="btn btn-outline-jobsicker" htmlFor="btnradio1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={16}
                  height={16}
                  fill="currentColor"
                  className="bi bi-chat-left-text-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4.414a1 1 0 0 0-.707.293L.854 15.146A.5.5 0 0 1 0 14.793V2zm3.5 1a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1h-9zm0 2.5a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1h-9zm0 2.5a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5z" />
                </svg>
              </label>
              <input
                type="radio"
                className="btn-check"
                name="btnradio"
                id="btnradio2"
                autoComplete="off"
                onClick={() => setTab(EMSGTags.CHAT)}
              />
              <label className="btn btn-outline-jobsicker" htmlFor="btnradio2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={16}
                  height={16}
                  fill="currentColor"
                  className="bi bi-person-lines-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-5 6s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zM11 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5zm.5 2.5a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1h-4zm2 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1h-2zm0 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1h-2z" />
                </svg>
              </label>
            </div>
          </div>
          <div className="col-3">
            <button
              className="btn mx-auto btn-md border-gray btn-circle btn-wite m-0 p-0"
              type="button"
              id="dropdownMenuButton1"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={18}
                height={18}
                fill="currentColor"
                className="bi bi-plus"
                viewBox="0 0 16 16"
              >
                <path
                  stroke="black"
                  strokeWidth=".9"
                  d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div className="card-body">
        <div className="row">
          <div className="input-group col-12">
            <span className="input-group-text bg-white" id="basic-addon1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={16}
                height={16}
                fill="currentColor"
                className="bi bi-search"
                viewBox="0 0 16 16"
              >
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"></path>
              </svg>
            </span>
            <input
              type="search"
              className="form-control"
              placeholder="Search"
              aria-label="Input group example"
              aria-describedby="basic-addon1"
            />
          </div>
          <div className="overflow-auto" style={{ maxHeight: 480 }}>
            <div className="btn-group btn-startdate col-12 w-100">
              <button
                type="button"
                className="btn border border-gray py-0 dropdown-toggle text-start mt-3 "
                data-bs-toggle="dropdown"
                data-bs-display="static"
                aria-expanded="false"
              >
                Start date
              </button>
              <ul className="dropdown-menu dropdown-menu-end dropdown-menu-lg-start">
                <li>
                  <button className="dropdown-item" type="button">
                    Action
                  </button>
                </li>
                <li>
                  <button className="dropdown-item" type="button">
                    Another action
                  </button>
                </li>
                <li>
                  <button className="dropdown-item" type="button">
                    Something else here
                  </button>
                </li>
              </ul>
            </div>
            <ul className="list-group list-group-flush">
              {messageRooms?.length ? (
                <>
                  {messageRooms?.map(mr => (
                    <li key={mr?._id} className="list-group-item">
                      <Wrapper
                        className="row message-item"
                        style={{
                          backgroundColor: selectedMessageRoom?._id === mr?._id ? '#ffe0fb' : '',
                        }}
                        onClick={() => {
                          if (selectedMessageRoom?._id === mr?._id) {
                            onSeen(mr?._id)
                          } else {
                            onSeen(mr?._id)
                            setSelectedMessageRoom(mr)
                          }
                        }}
                      >
                        <div className="col-2">
                          <div className="img_cont_msg">
                            <img
                              src={
                                mr?.image ||
                                'https://simpletexting.com/wp-content/uploads/2022/05/text-messages-not-sending.jpeg'
                              }
                              className="rounded-circle user_img_msg"
                            ></img>
                          </div>
                        </div>
                        <div className="col-10">
                          <span className="msg-uname">
                            {mr?.member
                              ?.filter(m => m?._id !== userID)
                              .map(m => (
                                <span key={m?._id}>{m?.name}</span>
                              ))}{' '}
                          </span>
                          <p className="smallmsg float-end">{timeAgo(mr?.updatedAt, t)}</p>
                          <span className="d-md-flex justify-content-between align-items-center w-100 d-none">
                            <span className="topic text-muted">{t('Single Direct Message')}</span>
                            <span className="">
                              {mr?.seen ? (
                                <Tag color="#108ee9">{t('Seen')}</Tag>
                              ) : (
                                <Tag color="#87d068">{t('Unseen')}</Tag>
                              )}
                            </span>
                          </span>
                          <br />
                        </div>
                      </Wrapper>
                    </li>
                  ))}
                </>
              ) : (
                <></>
              )}

              {/* <li className="list-group-item d-flex justify-content-between align-items-center">
									s<span className="badge bg-jobsicker rounded-pill">2</span>
								</li>
								<li className="list-group-item d-flex justify-content-between align-items-center">
									A third list item
									<span className="badge bg-jobsicker rounded-pill">1</span>
								</li> */}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

const Wrapper = styled.div`
  cursor: pointer;
  padding: 5px;
  &:hover {
    background: #ffe0fb;
  }
`
