import { Navigate  } from "react-router-dom";

const ProtectedRoute = ({
    children,
    redirectPath = '/login'
  }) => {

    const token = localStorage.getItem('access_token');

    if (!token) {
      return <Navigate to={redirectPath} replace />;
    }
  
    return children;
  };

  export default ProtectedRoute;