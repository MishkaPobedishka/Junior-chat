import React, {useContext, useState} from 'react';
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import {Button, Form} from "react-bootstrap";
import '../styles/login.css'
import '../styles/controls.css'
import {Link} from "react-router-dom";
import {REGISTRATION_ROUTE} from "../utils/const";

const LoginForm = () => {
    const [email, setEmail] = useState( '');
    const [password, setPassword] = useState( '');
    const [messageLogin, setMessageLogin] = useState('');
    const {store} = useContext(Context);
    const handleClickLogin = async (e) => {
        e.preventDefault();
        await store.login(email, password)
    }
    return (
        <Form className='loginForm'>
            <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                    className='controlSize'
                    onChange={e => setEmail(e.target.value)}
                    value={email}
                    type="email"
                    placeholder="Введите свой email" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Пароль</Form.Label>
                <Form.Control
                    className='controlSize'
                    onChange={e => setPassword(e.target.value)}
                    value={password}
                    type="password"
                    placeholder="Введите свой пароль" />
                <Form.Text className="text-muted">
                    {messageLogin}
                </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3">
                <Button
                    className='mb-3 controlLoginButton'
                    variant="primary"
                    type="submit"
                    onClick={handleClickLogin}
                >
                    Войти
                </Button>
            </Form.Group>
            <Form.Group className='registrationBlock'>
            <p>Не зарегистрированы?</p>
                    <Link to={REGISTRATION_ROUTE}>&nbsp;Зарегистрируйтесь сейчас</Link>
            </Form.Group>
        </Form>
    );

};

export default observer(LoginForm);
