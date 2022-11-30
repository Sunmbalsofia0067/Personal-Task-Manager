import { Navigate  } from "react-router-dom";

const CheckAuth = ({
    children,
    redirectPath = '/'
  }) => {

    const token = localStorage.getItem('access_token');

    if (token) {
      return <Navigate to={redirectPath} replace />;
    }
  
    return children;
  };

  export default CheckAuth;