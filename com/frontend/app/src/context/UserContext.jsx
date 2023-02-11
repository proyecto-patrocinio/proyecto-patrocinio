import { createContext, useState } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [id, setId] = useState(0);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");

    const setUser = (user) => {
        setId(user.pk);
        setUsername(user.username);
        setEmail(user.email);
        setFirstname(user.first_name);
        setLastname(user.last_name);
    };
    return (
        <UserContext.Provider value={{id, username,email,firstname,lastname, setUser}}>
        {children}
        </UserContext.Provider>
    );
}
 