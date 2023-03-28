import React, { useContext, useEffect, useState } from "react";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import SignIn from "./pages/SignIn";
import { CssBaseline } from "@mui/material";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import SignUp from "./pages/SignUp"; 
import { UserContext, UserProvider } from "./context/UserContext";
import HomePage from "./pages/HomePage";
import CaseTaker from "./pages/CaseTakerPage";
import Cookies from "js-cookie";


const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    useEffect(() => {
        //TODO: conectar al backend y consultar si removemos la coockie 
        // Comprobar si la cookie existe y establecer el estado de inicio de sesión en consecuencia
        const isLoggedInCookie = Cookies.get("isLoggedIn");
        if(isLoggedInCookie === "true"){
            setIsLoggedIn(true);
        }
    }, []);
  
    const getPage  = ( children) => {
        return (
            <UserProvider>
            {isLoggedIn ? children :<SignIn setIsLoggedIn={setIsLoggedIn} />}
            </UserProvider>
        );
    };

    return ( 
        <>

        <CssBaseline/>
        <Router>
            <Routes> 
                <Route exact path="/"  element={getPage(<HomePage/>)} />
                <Route exact path="/signup/"  element={<SignUp/>} /> 
                <Route exact path="/case-taker/"  element={getPage(<CaseTaker/>)} /> 
                
            </Routes>
        </Router>  
        </>
    );
};

export default App;