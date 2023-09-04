import { Layout, message } from 'antd'
import UnAuthorize from 'next/components/Fobidden/unauthorize'
import { useEffect } from 'react'
import { Navigate, Outlet, Route, Routes, useNavigate } from 'react-router-dom'
import { createGlobalStyle } from 'styled-components'
import { Http, LOCALSTORAGE } from '../api/http'
import { useAuth } from '../hooks/auth-hook'
import AccountManager from './AccountsManager'
import Login from './Auth/Login'
import RoleAccess from './Auth/role-access'
import BackupDataManager from './BackupData'
import CategoryManager from './Categories'
import CategoryDetails from './Categories/category-details'
import DashboardAdmin from './Dashboard'
import DepartmentManager from './Departments'
import DepartmentDetail from './Departments/department-detail'
import EventsPage from './Events'
import EventDetails from './Events/event-details'
import HomePage from './Homepage'
import CreateIdea from './Ideas/create-new-idea'
import EditIdea from './Ideas/edit-idea'
import IdeaDetail from './Ideas/idea-detail'
import UserProfile from './UserProfile'
import OtherProfile from './UserProfile/otherProfile'
import { userCredential, userStore } from './Auth/user-store'
import LayoutAdmin from './layout/admin'
import LayoutCoordinator from './layout/coordinator'
import LayoutManager from './layout/manager'
import LayoutStaff from './layout/staff'

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
        navigate('/login')
        return message.info('You need to login to access this application!')
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
          navigate('/login')
          return message.info('You need to login to access this application!')
        }
      }
    } else {
      navigate('/login')
      return message.info('You need to login to access this application!')
    }
  }, [])

  let routes: any

  if (credential?.tokenVerified) {
    routes = (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/logout" />
        <Route path="/" element={<Navigate to={role ? `/${role}` : '/'} replace />} />

        <Route
          path="/staff"
          element={
            <RoleAccess roles={['staff']}>
              <Layout style={{ minHeight: '100vh' }}>
                <LayoutStaff>
                  <Outlet />
                </LayoutStaff>
              </Layout>
            </RoleAccess>
          }
        >
          <Route path="" element={<HomePage />} />
          <Route path="event" element={<EventsPage />} />
          <Route path="event/:id" element={<EventDetails role="staff" />} />
          <Route path="ideas" element={<HomePage />} />
          <Route path="account" element={<UserProfile />} />
          <Route path="profile" element={<OtherProfile />} />
          <Route path="submit" element={<CreateIdea />} />
          <Route path="departments/:id" element={<DepartmentDetail />} />
          <Route path="idea" element={<IdeaDetail />} />
          <Route path="idea/edit" element={<EditIdea />} />
        </Route>

        <Route
          path="/coordinator"
          element={
            <RoleAccess roles={['coordinator']}>
              <Layout style={{ minHeight: '100vh' }}>
                <LayoutCoordinator>
                  <Outlet />
                </LayoutCoordinator>
              </Layout>
            </RoleAccess>
          }
        >
          <Route path="" element={<HomePage />} />
          <Route path="event" element={<EventsPage />} />
          <Route path="event/:id" element={<EventDetails />} />
          <Route path="ideas" element={<HomePage />} />
          <Route path="account" element={<UserProfile />} />
          <Route path="submit" element={<CreateIdea />} />
          <Route path="idea" element={<IdeaDetail />} />
          <Route path="profile" element={<OtherProfile />} />
          <Route path="departments/:id" element={<DepartmentDetail />} />
        </Route>

        <Route
          path="/admin"
          element={
            <RoleAccess roles={['admin']}>
              <Layout style={{ minHeight: '100vh' }}>
                <LayoutAdmin>
                  <Outlet />
                </LayoutAdmin>
              </Layout>
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
        </Route>

        <Route
          path="/manager"
          element={
            <RoleAccess roles={['manager']}>
              <Layout style={{ minHeight: '100vh' }}>
                <LayoutManager>
                  <Outlet />
                </LayoutManager>
              </Layout>
            </RoleAccess>
          }
        >
          <Route path="" element={<HomePage accessRole={'manager'} />} />
          <Route path="dashboard" element={<DashboardAdmin />} />
          <Route path="categories" element={<CategoryManager />} />
          <Route path="category/:id" element={<CategoryDetails />} />
          <Route path="event" element={<EventsPage />} />
          <Route path="event/:id" element={<EventDetails />} />
          <Route path="ideas" element={<HomePage />} />
          <Route path="submit" element={<CreateIdea />} />
          <Route path="idea" element={<IdeaDetail />} />
          <Route path="ideas" element={<HomePage />} />
          <Route path="account" element={<UserProfile />} />
          <Route path="profile" element={<OtherProfile />} />
        </Route>
        <Route path="*" element={<Navigate to={role ? `/${role}` : '/'} replace />} />
        <Route path="/unauthorize" element={<UnAuthorize></UnAuthorize>}></Route>
      </Routes>
    )
  } else {
    routes = (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={<Navigate to={'/login'} replace />} />
      </Routes>
    )
  }

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
