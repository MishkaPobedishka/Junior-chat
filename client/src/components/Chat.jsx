import React, {useContext, useState}from 'react';
import {Button, Container, Form, Navbar} from "react-bootstrap";
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import '../styles/chats.css'
import {useEffect} from "react";
import Dialog from "./Dialog";
import Message from "./Message";


const Chat = () => {
    const {store} = useContext(Context);
    const [data, setData] = useState();
    useEffect(() => {
        async function fetchData() {
            const response = await store.getDialogs();
            setData(store.dialogs);
            console.log(store.dialogs);
        }
        fetchData();
    }, []);
    const handleClickLogout = (e) => {
        e.preventDefault();
        store.logout()
    }
    return (
        <Container className='wrapper'>
            <Navbar bg="primary" variant="dark" className='navbar-size'>
                <Container fluid className='navbar-wrapper'>
                    <Navbar.Brand>
                        <img
                            src="https://img2.freepng.ru/20180329/zue/kisspng-computer-icons-user-profile-person-5abd85306ff7f7.0592226715223698404586.jpg"
                            width="50"
                            height="50"
                            className="d-inline-block brand"
                            alt="React Bootstrap logo"
                        />{' '}
                        Валентина Губина
                    </Navbar.Brand>
                    <Button variant="danger" size='lg'
                            onClick={handleClickLogout}
                    >
                        Выйти
                    </Button>
                </Container>
            </Navbar>
            <Container fluid className='chat-wrapper'>
                <Container className='dialogs-wrapper'>
                    <input placeholder='Найти диалог' className='dialog-input'></input>
                    <Dialog/>
                    <Dialog/>
                    <Dialog/>
                    <Dialog/>
                </Container>
                <Container className='messages-wrapper'>
                    <Container className='message-list'>
                        <Message/>
                        <Message own={true}/>
                        <Message own={true}/>
                        <Message/>
                        <Message/>
                        <Message own={true}/>
                        <Message own={true}/>
                        <Message/>
                        <Message/>
                        <Message own={true}/>
                        <Message own={true}/>
                        <Message/>
                        <Message/>
                        <Message own={true}/>
                        <Message own={true}/>
                        <Message/>
                    </Container>
                    <Container className='navbar-fixed-bottom chat-message-form'>
                        <Form.Control
                            type="text"
                            placeholder='Введите сообщение'
                            id="message-text"
                            className='message-input'
                        />
                        <Button variant='primary' className='send-message-button'>Отправить</Button>
                    </Container>
                </Container>
            </Container>
        </Container>
    );
};

export default observer(Chat);
