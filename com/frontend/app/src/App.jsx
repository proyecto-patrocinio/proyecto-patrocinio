import React, {useEffect, useState } from "react";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import SignIn from "./pages/SignIn";
import { CssBaseline } from "@mui/material";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import SignUp from "./pages/SignUp"; 
import { UserProvider } from "./context/UserContext";
import HomePage from "./pages/HomePage";
import CaseTaker from "./pages/CaseTakerPage";
import BoardPage from "./pages/BoardPage";
import LogoutPage from "./pages/LogoutPage";
import TermsPage from "./pages/TermsPage";
import {
    PATH_BOARD, PATH_CONFIRM_EMAIL, PATH_CONSULTANCY, PATH_CP_CLIENTS,
    PATH_CP_CONSULT, PATH_FORGET_PASSWORD, PATH_LOGOUT, PATH_ROOT, PATH_SIGNUP,
    PATH_TERMS 
} from "./utils/constants";
import ControlPanelConsultation from "./pages/ControlConsultionPage";
import ControlPanelClient from "./pages/ControlClientPage";
import { getDataUserByToken } from "./utils/user";
import EmailConfirmationPage from "./pages/EmailConfirmationPage";
import ForgetPasswordPage from "./pages/ForgetPasswordPage";
import ChangePasswordPage from "./pages/ChangePasswordPage";


const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    /**
     * Check for a user token in local storage.
     * If a token exists, attempt to retrieve user data using the token.
     */
    useEffect(() => {
        const tokenUser = window.localStorage.getItem('loggedCaseManagerUser');
        setIsLoggedIn(!!tokenUser); // fast show page.
        // reconfirm the token user with API (Check if this is valid)
        if (!tokenUser) {
            setIsLoggedIn(false);
        } else {
            getDataUserByToken(tokenUser).then( (user) => {
                if(user){
                    setIsLoggedIn(true);
                }
                else{
                    setIsLoggedIn(false);
                }
            });
    };
    }, []);

    const getPage  = (children) => {
        return (
            <div>
            {isLoggedIn ? children :<SignIn setIsLoggedIn={setIsLoggedIn} />}
            </div>
        );
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
        <CssBaseline/>
        <UserProvider>
        <Router>
            <Routes>
                <Route exact path={PATH_ROOT}           element={getPage(<HomePage/>)} />
                <Route exact path={PATH_SIGNUP}         element={<SignUp/>} />
                <Route exact path={PATH_CONFIRM_EMAIL}  element={<EmailConfirmationPage/>} />
                <Route exact path={PATH_FORGET_PASSWORD}  element={<ForgetPasswordPage/>} />
                <Route exact path={PATH_FORGET_PASSWORD + ":uid/:token/"}  element={<ChangePasswordPage/>} />
                <Route exact path={PATH_CONSULTANCY}    element={getPage(<CaseTaker/>)} />
                <Route exact path={PATH_CP_CONSULT}     element={getPage(<ControlPanelConsultation/>)} />
                <Route exact path={PATH_CP_CLIENTS}     element={getPage(<ControlPanelClient/>)} />
                <Route exact path={PATH_LOGOUT}         element={<LogoutPage  setIsLoggedIn={setIsLoggedIn}/> } />
                <Route exact path={PATH_TERMS}          element={<TermsPage/>} />
                <Route exact path={PATH_BOARD + ":id_board/"} element={getPage(<BoardPage/>)} />
            </Routes>
        </Router>  
        </UserProvider>
        </LocalizationProvider>
    );
};

export default App;