import Cookies from "js-cookie";
import { useEffect } from "react";
import { Navigate, redirect } from "react-router-dom";
import { Route, Routes, useNavigate } from 'react-router-dom';

const LogoutPage = () => {

    //TODO: Eliminar token(?) en backend
    //TODO: Eliminar usercontext
  const removeCookies = () => {
    Cookies.remove("isLoggedIn");
    Cookies.remove("user");
  };

  removeCookies();
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate('/', { replace: true });
    }, 1000);
  }, []);

  return <div>Loading...</div>;
}


  export default LogoutPage;