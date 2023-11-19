import { createContext, useState , useContext, useEffect} from "react";
import { getDataUserByToken } from "../utils/user";

const UserContext = createContext();

export const useUserContext = () => useContext(UserContext);


export const UserProvider = ({ children }) => {
    const initialState = {
        pk: "0",
        username: "",
        email: "",
        firstname: "",
        lastname: "",
        "roles": []
    };
    const [userState, setUserState] = useState( initialState );

    useEffect(() => {
      const saveUser = async() => {
        const loggedUserToken = window.localStorage.getItem('loggedCaseManagerUser');
        if( userState === initialState && loggedUserToken){
          const newDataUser = await getDataUserByToken(loggedUserToken);
          setUserState(newDataUser);
      }};
      saveUser();
      }, []);

      const setUser = (user) => {
        setUserState(user);
      };

    return (
        <UserContext.Provider value={{user: userState, setUser}}>
        {children}
        </UserContext.Provider>
    );
};
