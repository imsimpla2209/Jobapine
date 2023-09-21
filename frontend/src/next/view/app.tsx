import { Layout } from 'antd'
import UnAuthorize from 'next/components/fobidden/unauthorize'
import { useEffect } from 'react'
import { Navigate, Outlet, Route, Routes, useNavigate } from 'react-router-dom'
import { createGlobalStyle } from 'styled-components'
import { Http, LOCALSTORAGE } from '../api/http'
import { useAuth } from '../hooks/auth-hook'
import AccountManager from './accounts-manager'
import Login from './auth/login'
import RoleAccess from './auth/role-access'
import { userCredential, userStore } from './auth/user-store'
import BackupDataManager from './backup-data'
import CategoryManager from './categories'
import CategoryDetails from './categories/category-details'
import DashboardAdmin from './dashboard'
import DepartmentManager from './departments'
import DepartmentDetail from './departments/department-detail'
import EventsPage from './events'
import EventDetails from './events/event-details'
import CreateIdea from './ideas/create-new-idea'
import EditIdea from './ideas/edit-idea'
import IdeaDetail from './ideas/idea-detail'
import LayoutAdmin from './layout/admin'
import LayoutManager from './layout/manager'
import LayoutStaff from './layout/staff'
import UserProfile from './user-profile'
import OtherProfile from './user-profile/otherProfile'
import HomePage from './home-page'
import WorkerList from './worker/worker-list'
import JobList from './hire/job-list'
import JobDetails from './hire/job-details'
import WorkerDetails from './worker/worker-details'

export default function App() {
  const navigate = useNavigate()
  const { login, logout, token, tokenVerified, userId, role } = useAuth()
  const credential = JSON.parse(localStorage.getItem(LOCALSTORAGE.CREDENTIALS))

  useEffect(() => {
    userCredential.updateState({
      userId: userId,
      isLoggedIn: tokenVerified,
      token: token,
      login: login,
      logout: logout,
    })

    if (credential) {
      if (credential?.token === '' || !credential?.token) {
      } else {
        if (credential?.tokenVerified === true && credential?.userId) {
          userCredential.updateState({
            userId: credential.userId,
            isLoggedIn: credential.tokenVerified,
            token: credential.token,
          })

          const updateUserInfo = async () => {
            await Http.get(`/api/v1/users/getProfile/${credential.userId}`)
              .then(res => {
                userStore.updateState({ ...res.data.userInfo, loading: false })
              })
              .catch(err => {
                console.error(err.message)
                navigate('/')
              })
          }
          updateUserInfo()
        } else {
        }
      }
    } else {
    }
  }, [])

  const routes = (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/logout" />
      <Route
        path="/"
        element={
          <LayoutAdmin>
            <Outlet />
          </LayoutAdmin>
        }
      >
        <Route path="" element={<HomePage />} />
      </Route>

      <Route
        path="/admin"
        element={
          <RoleAccess roles={['admin']}>
            <LayoutAdmin>
              <Outlet />
            </LayoutAdmin>
          </RoleAccess>
        }
      >
        <Route path="accounts-manager" element={<AccountManager />} />
        <Route path="account" element={<UserProfile />} />
        <Route path="departments" element={<DepartmentManager />} />
        <Route path="departments/:id" element={<DepartmentDetail />} />
        <Route path="" element={<HomePage />} />
        <Route path="ideas" element={<HomePage />} />
        <Route path="idea" element={<IdeaDetail />} />
        <Route path="event" element={<EventsPage role="admin" />} />
        <Route path="event/:id" element={<EventDetails />} />
        <Route path="profile" element={<OtherProfile />} />
        <Route path="backup" element={<BackupDataManager />} />
        <Route path="dashboard" element={<DashboardAdmin />} />
      </Route>

      <Route
        path="/worker"
        element={
          <LayoutStaff>
            <Outlet />
          </LayoutStaff>
        }
      >
        <Route path="" element={<JobList />} />
        <Route path="details" element={<JobDetails />} />
      </Route>

      <Route
        path="/hire"
        element={
          <LayoutManager>
            <Outlet />
          </LayoutManager>
        }
      >
        <Route path="" element={<WorkerList />} />
        <Route path="details" element={<WorkerDetails />} />
        <Route path="profile" element={<OtherProfile />} />
      </Route>
      <Route path="*" element={<Navigate to={role ? `/${role}` : '/'} replace />} />
      <Route path="/unauthorize" element={<UnAuthorize></UnAuthorize>}></Route>
    </Routes>
  )

  return (
    <>
      <GlobalStyle />
      {routes}
    </>
  )
}

const GlobalStyle = createGlobalStyle`
  & {
    .d-flex{
      display: flex;
    }
    .center{
      display: flex;
      align-items: center;
      justify-content:center;
    }
    .w-100{
      width:100%;
    }
    .h-100{
      height:100%;
    }
    .ellipsis{
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
`
