import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useUserContext } from "../context/UserContext";
import { logoutUser } from "../utils/user";
import { deleteCookie } from "../utils/tools";
import Cookies from "js-cookie";


/**
 * LogoutPage component for logging out a user.
 *
 * @param {Object} props - The component's properties.
 * @param {function} props.setIsLoggedIn - A function to set the user's login status.
 * @returns {JSX.Element} - The rendered LogoutPage component.
 */
const LogoutPage =  ({setIsLoggedIn}) => {
  const userContext =  useUserContext();
  const navigate = useNavigate();

  /**
   * Function to log out the user and navigate to the home page.
   */
  const exit = async () => {
    const isLogout = await logoutUser();
    const csrfToken = Cookies.get("csrftoken");
    if (isLogout || !csrfToken){
      window.localStorage.removeItem("loggedCaseManagerUser");
      deleteCookie("csrftoken");
      userContext.setUser({
        pk: "0",
        username: "",
        email: "",
        firstname: "",
        lastname: "",
      });
      setIsLoggedIn(false);
    }
    navigate('/', { replace: true });
  };

  useEffect(() => {
    exit();

  // eslint-disable-next-line
  }, []);

  return <div>Cargando...</div>;
};

  export default LogoutPage;
