import React, {useContext, useRef, useState} from 'react';
import {Button, Container, Form, Navbar} from "react-bootstrap";
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import '../styles/chats.css'
import {useEffect} from "react";
import Dialog from "./Dialog";
import Message from "./Message";
import {io} from 'socket.io-client';
import uuid from 'react-uuid';

const SOCKET_URL = 'ws://localhost:8900'

const Chat = () => {
    const {store} = useContext(Context);
    const [newMessageText, setNewMessageText] = useState('');
    const scrollRef = useRef();
    const socket = useRef()

    useEffect(() => {
        socket.current = io(SOCKET_URL);
        socket.current.on('getMessage', data => {
            store.setArrivalMessage({
                id: uuid(),
                sender_id: data.senderId,
                dialog_id: data.dialogId,
                text: data.text,
                is_read: data.isRead,
                created_at: Date.now(),
            })
        })

    }, [])

    useEffect(() => {
        console.log('message income');
        store.arrivalMessage && store.arrivalMessage.sender_id === store.currentDialog?.receiver_id &&
            store.setMessages([...store.messages, store.arrivalMessage])
    }, [store.arrivalMessage, store.currentDialog]);

    useEffect(() => {
        store.setNewDialogArray();
    }, [store.arrivalMessage]);


    useEffect(() => {
        socket.current.emit('addUser', store.user.id);
    }, [store.user]);

    useEffect(() => {
        async function fetchDialogs() {
            await store.getDialogs(store.user.id);
        }
        fetchDialogs();
    }, []);

    useEffect(() => {
        async function fetchMessages() {
            await store.getMessages();
        }
        fetchMessages();
    }, [store.currentDialog]);

    const handleClickLogout = (e) => {
        e.preventDefault();
        store.logout();
    }

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (newMessageText) {
            store.sendMessage(newMessageText);
            socket.current.emit('sendMessage', {
                senderId: store.user.id,
                dialogId: store.currentDialog.id,
                receiverId: store.currentDialog.receiver_id,
                text: newMessageText,
                isRead: false,
            })
            setNewMessageText('');
        }
    }

    useEffect(() => {
        scrollRef.current?.scrollIntoView({behavior: "smooth"})
    }, [store.messages])

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
                        {store.user.first_name + ' ' + store.user.last_name}
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
                    {store.dialogs.map((dialog) => (
                        <div key={dialog.id} onClick={() => store.setCurrentDialog(dialog)}>
                            <Dialog
                                key={dialog.id}
                                receiver_name={dialog.receiver_name}
                                last_message={dialog.last_message}
                                missed_messages={dialog.missed_messages}
                            />
                        </div>
                    ))}
                </Container>
                <Container className='messages-wrapper'>
                    {
                        store.currentDialog ?
                            <>
                                <Container className='message-list'>
                                    {store.messages?.map((message) => (
                                        <div ref={scrollRef}>
                                            <Message
                                                key={message.id}
                                                user_message={message.sender_id === store.user.id}
                                                text={message.text}
                                                created_at={message.created_at}
                                            />
                                        </div>
                                    ))}
                                </Container>
                                <Container className='navbar-fixed-bottom chat-message-form'>
                                    <Form.Control
                                        type="text"
                                        placeholder='Введите сообщение'
                                        id="message-text"
                                        className='message-input'
                                        onChange={(e) => setNewMessageText(e.target.value)}
                                        value={newMessageText}
                                    />
                                    <Button
                                        variant='primary'
                                        className='send-message-button'
                                        onClick={handleSendMessage}
                                    >
                                        Отправить
                                    </Button>
                                </Container>
                            </> :
                            <span className='noDialog'>Откройте диалог для начала общения</span>
                    }
                </Container>
            </Container>
        </Container>
    );
};

export default observer(Chat);
