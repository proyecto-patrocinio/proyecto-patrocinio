import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useUserContext } from "../context/UserContext";
import { logoutUser } from "../utils/user";
import { deleteCookie } from "../utils/tools";

const LogoutPage =  ({setIsLoggedIn}) => {
  const userContext =  useUserContext();
  const navigate = useNavigate();

  const exit = async () => {
    window.localStorage.removeItem("loggedCaseManagerUser");
    logoutUser();
    deleteCookie("csrftoken");
    userContext.setUser({
      pk: "0",
      username: "",
      email: "",
      firstname: "",
      lastname: "",
    });
    setIsLoggedIn(false);
    navigate('/', { replace: true });
  };

  useEffect(() => {
    exit();
  }, []);

  return <div>Loading...</div>;
};

  export default LogoutPage;
