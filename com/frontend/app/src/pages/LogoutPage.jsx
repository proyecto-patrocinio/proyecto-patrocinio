import Cookies from "js-cookie";
import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useUserContext } from "../context/UserContext";
import { logoutUser } from "../utils/user";

const LogoutPage = () => {
  const userContext =  useUserContext();

  const removeCookies = () => {
    Cookies.remove("isLoggedIn");
    Cookies.remove("user");
  };

  logoutUser();
  removeCookies();
  userContext.setUser({
    pk: "0",
    username: "",
    email: "",
    firstname: "",
    lastname: "",
  });

  window.localStorage.removeItem("loggedCaseManagerUser");
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate('/', { replace: true });
    }, 500);
  }, []);

  return <div>Loading...</div>;
}


  export default LogoutPage;