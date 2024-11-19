import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const PrivateRoute = ({children, ...rest}) => {
    const {user} = useContext(AuthContext);
    return user ? children : <Navigate to="/login" />;
}

export default PrivateRoute;
