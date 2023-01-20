import React from "react";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import SignIn from "./containers/SignIn";
import { Typography, CssBaseline, Container } from "@mui/material";
import Dashboard from "./containers/Menu";
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'


const Home = (props) => {
    const isLoggedIn = props.isLoggedIn;
    if (isLoggedIn) {
        return <Dashboard />;
    } else
    return <SignIn />;
};

const App = () => {
    return ( 
        <>

        <CssBaseline/>
        <Router>
            <Routes> 
                <Route exact path="/"  element={<Home isLoggedIn={false}/>} />
            </Routes>
        </Router>  
        </>
    );
};

export default App;