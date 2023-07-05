import React, { useContext, useEffect, useState } from "react";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import SignIn from "./pages/SignIn";
import { CssBaseline } from "@mui/material";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import SignUp from "./pages/SignUp"; 
import { UserProvider } from "./context/UserContext";
import HomePage from "./pages/HomePage";
import CaseTaker from "./pages/CaseTakerPage";
import Cookies from "js-cookie";
import BoardPage from "./pages/BoardPage";
import LogoutPage from "./pages/LogoutPage";


const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    useEffect(() => {
        //TODO: conectar al backend (crear/obtener token?) y consultar si removemos la cookie 
        // Comprobar si la cookie existe y establecer el estado de inicio de sesión en consecuencia
        const isLoggedInCookie = Cookies.get("isLoggedIn");
        if(isLoggedInCookie === "true"){
            setIsLoggedIn(true);
        }
        else{
            setIsLoggedIn(false);
        }
    }, []);

    const getPage  = (children) => {
        return (
            <div>
            {isLoggedIn ? children :<SignIn setIsLoggedIn={setIsLoggedIn} />}
            </div>
        );
    };

    return ( 
        <>

        <CssBaseline/>
        <UserProvider>
        <Router>
            <Routes> 
                <Route exact path="/"  element={getPage(<HomePage/>)} />
                <Route exact path="/signup/"  element={<SignUp/>} /> 
                <Route exact path="/case-taker/"  element={getPage(<CaseTaker/>)} />
                <Route exact path="/board/:id_board/" element={getPage(<BoardPage/>)} />
                <Route exact path="/logout/" element={<LogoutPage  setIsLoggedIn={setIsLoggedIn}/> } />
            </Routes>
        </Router>  
        </UserProvider>
        </>
    );
};

export default App;