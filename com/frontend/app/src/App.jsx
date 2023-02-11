import React from "react";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import SignIn from "./pages/SignIn";
import { Typography, CssBaseline, Container } from "@mui/material";
import Dashboard from "./containers/Dashboard";
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import SignUp from "./pages/SignUp"; 
import { UserProvider } from "./context/UserContext";
import Board from "./pages/Board";


const Home = (props) => {
    const isLoggedIn = props.isLoggedIn;
    if (isLoggedIn) {
        return <Dashboard />;
    } else
    return (
        <UserProvider>
            <SignIn />
        </UserProvider>
    );
};

const App = () => {
    return ( 
        <>

        <CssBaseline/>
        <Router>
            <Routes> 
                <Route exact path="/"  element={<Home isLoggedIn={false}/>} />
                <Route exact path="/signup/"  element={<SignUp/>} />
                <Route exact path="/board/"  element={<Board/>} />
            </Routes>
        </Router>  
        </>
    );
};

export default App;