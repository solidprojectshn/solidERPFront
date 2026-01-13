import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ children, permissionsNeeded }) => {
    const {
        isAuthenticated,
        permissions
    } = useSelector((store) => store.auth);

    if (!isAuthenticated) {
        return <Navigate to="/" replace />
    }
    
    if (permissionsNeeded && !permissionsNeeded?.some(element => permissions.includes(element))) {
        return <Navigate to="/dashboard" replace />
    }
    return children
};

export default PrivateRoute;