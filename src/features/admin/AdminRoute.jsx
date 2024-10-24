import { useSelector } from 'react-redux'
import { selectUser } from '../auth/authSlice'
import { Navigate } from 'react-router-dom'

const AdminRoute = ({ children }) => {
  const user = useSelector(selectUser)

  if (!user || user.role !== 'admin') {
    return <Navigate to="/" />
  }

  return children
}

export default AdminRoute
