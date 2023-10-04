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
import TermsPage from "./pages/TermsPage";
import {
    PATH_BOARD, PATH_CONSULTANCY, PATH_CP_CLIENTS,
    PATH_CP_CONSULT, PATH_LOGOUT, PATH_ROOT, PATH_SIGNUP,
    PATH_TERMS 
} from "./utils/constants";
import ControlPanelConsultation from "./pages/ControlConsultionPage";
import ControlPanelClient from "./pages/ControlClientPage";


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
                <Route exact path={PATH_ROOT}           element={getPage(<HomePage/>)} />
                <Route exact path={PATH_SIGNUP}         element={<SignUp/>} />
                <Route exact path={PATH_CONSULTANCY}    element={getPage(<CaseTaker/>)} />
                <Route exact path={PATH_CP_CONSULT}     element={getPage(<ControlPanelConsultation/>)} />
                <Route exact path={PATH_CP_CLIENTS}     element={getPage(<ControlPanelClient/>)} />
                <Route exact path={PATH_LOGOUT}         element={<LogoutPage  setIsLoggedIn={setIsLoggedIn}/> } />
                <Route exact path={PATH_TERMS}          element={<TermsPage/>} />
                <Route exact path={PATH_BOARD + ":id_board/"} element={getPage(<BoardPage/>)} />
            </Routes>
        </Router>  
        </UserProvider>
        </>
    );
};

export default App;