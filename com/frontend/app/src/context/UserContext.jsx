import { createContext, useState } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [id, setId] = useState(0);
    return (
        <UserContext.Provider value={{id, setId}}>
        {children}
        </UserContext.Provider>
    );
}