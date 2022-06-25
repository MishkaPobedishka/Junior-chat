import React from 'react';
import entryPhoto from '../images/EntryPhoto.png'
import '../styles/login.css'
import {Button, Container, Form} from "react-bootstrap";
import LoginForm from "./LoginForm";

const textMuted = ''

const Login = () => {
    return (
        <Container fluid className='mt- d-flex flex-row justify-content-center loginContainer'>
            <img className='loginPhoto' src={entryPhoto} alt={'poster'}/>
            <LoginForm/>
        </Container>
    );
};

export default Login;
