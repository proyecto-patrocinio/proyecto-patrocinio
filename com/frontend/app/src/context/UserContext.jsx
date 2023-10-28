import { createContext, useState , useContext, useEffect} from "react";
import Cookies from "js-cookie";

const UserContext = createContext();

export const useUserContext = () => useContext(UserContext);


export const UserProvider = ({ children }) => {
    const initialState = {
        pk: "0",
        username: "",
        email: "",
        firstname: "",
        lastname: "",
        token: "",
    };
    const [userState, setUserState] = useState( initialState );

    useEffect(() => {
      // Comprobar si el estado del usuario ha cambiado y actualizar la cookie
        if( userState === initialState && Cookies.get("isLoggedIn") === "true"){
          const newDataUser = Cookies.get("user");
          const token = window.localStorage.getItem("loggedCaseManagerUser");
          newDataUser.token = token;
          setUserState(JSON.parse(newDataUser));
        }
      }, []);

      const setUser = (user) => {
        Cookies.set("user", JSON.stringify(user));
        const token = window.localStorage.getItem("loggedCaseManagerUser");
        user.token = token;
        setUserState(user);
      };

    return (
        <UserContext.Provider value={{user: userState, setUser}}>
        {children}
        </UserContext.Provider>
    );
};
