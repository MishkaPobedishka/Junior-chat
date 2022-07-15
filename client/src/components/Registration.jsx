import React, {useState, useContext} from 'react';
import {Button, Container, Form} from "react-bootstrap";
import {observer} from "mobx-react-lite";
import '../styles/registration.css'
import '../styles/controls.css'
import {Context} from "../index";


const Registration = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const {store} = useContext(Context);

    const handleClickRegistration = async (e) => {
        store.setRegistrationError('');
        e.preventDefault();
        await store.registration(firstName, lastName, email, password)
    }
    return (
        <Container fluid className='registrationContainer'>
            <Form>
                <Form.Group className="mb-3" controlId="formBasicFirstName">
                    <Form.Label>Имя</Form.Label>
                    <Form.Control
                        className='controlRegistrationSize'
                        type="text"
                        placeholder="Введите имя"
                        onChange={e => setFirstName(e.target.value)}
                        value={firstName}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicLastName">
                    <Form.Label>Фамилия</Form.Label>
                    <Form.Control
                        className='controlRegistrationSize'
                        type="text"
                        placeholder="Введите фамилию"
                        onChange={e => setLastName(e.target.value)}
                        value={lastName}
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        className='controlRegistrationSize'
                        type="email"
                        placeholder="Введите email"
                        onChange={e => setEmail(e.target.value)}
                        value={email}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        className='controlRegistrationSize'
                        type="password"
                        placeholder="Введите пароль"
                        onChange={e => setPassword(e.target.value)}
                        value={password}
                    />
                    {store.registrationError !== '' &&
                        <Form.Label className='text-center api-error'>{store.registrationError}</Form.Label>
                    }
                </Form.Group>
                    <Button
                        className='controlRegistrationButton'
                        variant="primary"
                        type="submit"
                        onClick={handleClickRegistration}
                    >
                        Регистрация
                    </Button>
            </Form>
        </Container>
    );
};

export default observer(Registration);
