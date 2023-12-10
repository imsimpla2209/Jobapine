/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */

import { BellFilled, MailFilled } from '@ant-design/icons'
import { Avatar, Badge, Divider, Dropdown, MenuProps, Space } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { userStore } from 'src/Store/user.store'
import { logout } from 'src/api/auth-apis'
import { getNotifies } from 'src/api/message-api'
import { useSubscription } from 'src/libs/global-state-hook'
import { Title } from 'src/pages/ClientPages/JobDetailsBeforeProposols'
import { useSocket } from 'src/socket.io'
import { ESocketEvent } from 'src/utils/enum'
import { pickName, timeAgo } from 'src/utils/helperFuncs'
import img from '../../../assets/img/icon-user.svg'
import notiIcon from '../../../assets/img/notifyicon.png'
import LanguageList from '../../SharedComponents/LanguageBtn/LanguageList'

export default function NavLargScreen() {
  const { t, i18n } = useTranslation(['main'])
  const navigate = useNavigate()
  const user = useSubscription(userStore).state
  const [notifies, setNotifies] = useState([])
  const [unSeen, setUnSeen] = useState([])
  const [unSeenMSG, setUnSeenMSG] = useState(0)
  const { appSocket } = useSocket()
  const lang = i18n.language

  const handleLogout = () => {
    logout()
      .then(res => {
        navigate('/login')
        window.location.reload()
        localStorage.removeItem('userType')
        localStorage.removeItem('expiredIn')
        toast.success('Bye', {
          icon: '👋',
        })
      })
      .catch(error => {
        console.log(error.message)
      })
  }

  useEffect(() => {
    getNotifies(user?.id).then(res => {
      setNotifies(res.data.results)
      setUnSeen(res.data.results?.filter(n => !n?.seen) || [])
    })
  }, [])

  useEffect(() => {
    // App socket
    appSocket.on(ESocketEvent.SENDNOTIFY, data => {
      console.log('Get Notify:', data)
      if (data?.to === user?.id) {
        setNotifies(prev => [{ ...data, createdAt: new Date() }, ...prev])
        setUnSeen(prev => [...prev, data])
      }
    })

    // The listeners must be removed in the cleanup step, in order to prevent multiple event registrations
    return () => {
      appSocket.off(ESocketEvent.SENDNOTIFY)
    }
  }, [notifies, unSeen])

  useEffect(() => {
    appSocket.on(ESocketEvent.SENDMSG, data => {
      console.log(data.to, data?.to === user?.id)
      if (data?.to === user?.id) {
        console.log('Get MSG:', data)
        setUnSeenMSG(prev => prev + 1)
      }
    })

    return () => {
      appSocket.off(ESocketEvent.SENDMSG)
    }
  }, [unSeenMSG])

  const items = useMemo(() => {
    return notifies?.slice(0, 5)?.map((s, ix) => {
      return {
        label: (
          <div className="row" style={{ width: 400 }}>
            <img className="col-2" height={36} width={36} src={s.image || notiIcon} alt="sss" />
            <Link
              className="col-7 text-wrap text-truncate"
              style={{ color: s?.seen ? 'black' : '#6600cc' }}
              to={s?.path || '#'}
            >
              {pickName(s?.content, lang)}
            </Link>
            <p className="col-3">{timeAgo(s?.createdAt, t)}</p>
          </div>
        ),
        key: ix,
      }
    }) as MenuProps['items']
  }, [notifies])

  const onSeenNotify = e => {
    if (e) {
      setUnSeen([])
    }
  }

  return (
    <div className="navbar-expand" id="navbarNav-id" style={{ padding: '10px 0px' }}>
      <ul className="navbar-nav align-items-center">
        <li className="nav-item hov-cn">
          <NavLink className="nav-link" to="/home">
            {t('Jobs')}
          </NavLink>
          <ul className="dropdown-menu text-break" style={{ marginTop: '-8px' }}>
            <div className="nav-dd-cn"></div>
            <li>
              <Link className="dropdown-item" to="/home">
                {t('My Jobs')}
              </Link>
            </li>
            <li>
              <Link className="dropdown-item text-break" to="/all-job-posts">
                {t('All Jobs')}
              </Link>
            </li>
            <li>
              <Link className="dropdown-item" to="/all-contracts">
                {t('Contracts')}
              </Link>
            </li>
            <li>
              <Link className="dropdown-item" to="/post-job">
                {t('Post a job')}
              </Link>
            </li>
            <li>
              <Link className="dropdown-item" to="/invitations">
                {t('Invitations')}
              </Link>
            </li>
          </ul>
        </li>
        <li className="nav-item hov-cn ms-3">
          <NavLink className="nav-link" to="/freelancer">
            {t('Freelancer')}
          </NavLink>
          <ul className="dropdown-menu" style={{ marginTop: '-8px' }}>
            <div className="nav-dd-cn"></div>
            <li>
              <Link className="dropdown-item" to="/freelancer">
                {t('All freelancers')}
              </Link>
            </li>
            <li>
              <Link className="dropdown-item" to="/saved-freelancer">
                {t('Favourite freelancers')}
              </Link>
            </li>
            <li>
              <Link className="dropdown-item" to="/freelancer/my-hires">
                {t('My Hires')}
              </Link>
            </li>
          </ul>
        </li>
        <li className="nav-item hov-cn">
          <NavLink className="nav-link" to="/transaction-history">
            {t('Reports')}
          </NavLink>
        </li>
        <li className="nav-item ms-5 me-3">
          <Badge count={unSeenMSG || 0} color={'purple'} status="processing">
            <NavLink
              className=""
              onClick={() => setUnSeenMSG(0)}
              style={{ padding: '10px 10px', borderRadius: 100, background: '#f5f0fa' }}
              to="/messages"
            >
              <MailFilled style={{ fontSize: 18 }} />
            </NavLink>
          </Badge>
        </li>
        <li className="nav-item me-3">
          <Badge count={unSeen?.length || 0} color={'purple'} status="processing">
            <Dropdown
              menu={{ items }}
              trigger={['click']}
              overlayStyle={{
                overflowY: 'auto',
                maxHeight: '100vh',
              }}
              onOpenChange={e => onSeenNotify(e)}
              arrow={{ pointAtCenter: true }}
              dropdownRender={menu => (
                <div
                  style={{
                    padding: 18,
                    height: '70%',
                    borderRadius: 10,
                    background: 'white',
                    marginLeft: 24,
                    boxShadow:
                      'rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px',
                  }}
                >
                  <h3>{t('Notification')}</h3>
                  {React.cloneElement(menu as React.ReactElement, { style: { boxShadow: 'none' } })}
                  <Divider style={{ margin: 0 }} />
                  <Space style={{ padding: 8 }}>
                    <Link to="/notifications" className="nav-link" type="primary">
                      {t('View all')}
                    </Link>
                  </Space>
                </div>
              )}
            >
              <NavLink
                to="/notifications"
                style={{ padding: 10, borderRadius: 100, background: '#f5f0fa' }}
                onClick={e => {
                  e.preventDefault()
                  e.stopPropagation()
                }}
                className=""
              >
                <BellFilled style={{ fontSize: 18 }} />
              </NavLink>
            </Dropdown>
          </Badge>
        </li>
        <li className="nav-item me-3">
          <LanguageList />
        </li>

        <Dropdown
          placement="bottomRight"
          menu={{
            items: [
              {
                label: (
                  <Title level={5} style={{ margin: 0 }}>
                    <i className="fa fa-cog" style={{ marginRight: 8 }}></i>
                    {t('Settings')}
                  </Title>
                ),
                key: '0',
                onClick: () => navigate('/settings'),
              },
              {
                label: (
                  <Title level={5} style={{ margin: 0 }}>
                    <i className="fas fa-sign-out-alt" style={{ marginRight: 8 }}></i>
                    {t('Log Out')}
                  </Title>
                ),
                onClick: handleLogout,
                key: '1',
              },
            ],
          }}
          trigger={['click']}
        >
          <a
            className="nav-link dropdown-toggle"
            href="#"
            id="navbarDropdownMenuLink"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <Avatar size="large" className="rounded-circle bg-white" src={user.avatar ? user.avatar : img} alt="" />
          </a>
        </Dropdown>
      </ul>
    </div>
  )
}
