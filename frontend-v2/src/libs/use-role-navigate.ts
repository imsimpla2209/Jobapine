import { userStore } from 'pages/AdminPages/auth/user-store'
import { useSubscription } from './global-state-hook'
import { useNavigate } from 'react-router-dom'

export default function useRoleNavigate() {
  const navigate = useNavigate()
  const {
    state: { role },
  } = useSubscription(userStore, ['role'])

  const roleBasedNavigate = endPoint => navigate(role ? `/${role}${endPoint}` : endPoint)

  return roleBasedNavigate
}
