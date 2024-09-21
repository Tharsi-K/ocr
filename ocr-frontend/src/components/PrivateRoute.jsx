import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom';

export default function PrivateRoute({ allowedRoles }) {
    const { currentUser } = useSelector((state) => state.user);

    return currentUser && allowedRoles.includes(currentUser.role) 
        ? <Outlet /> 
        : <Navigate to='/sign-in' />;
}
