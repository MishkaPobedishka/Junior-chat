import React, {useContext, useRef, useState} from 'react';
import {Button, Container, Form, Modal, Navbar} from "react-bootstrap";
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import '../styles/chats.css'
import {useEffect} from "react";
import Dialog from "./Dialog";
import Message from "./Message";
import {ADMIN_ROUTE} from "../utils/const";
import User from "./User";
import {Link} from "react-router-dom";

const Chat = () => {
    const {store} = useContext(Context);
    const [newMessageText, setNewMessageText] = useState('');
    const [modalShow, setModalShow] = useState(false);
    const scrollRef = useRef();

    useEffect(() => {
        store.fetchSocketAnswers();
    }, [])

    useEffect(() => {
        store.arrivalMessage && store.arrivalMessage.sender_id === store.currentDialog?.receiver_id &&
            store.setMessages([...store.messages, store.arrivalMessage])
    }, [store.arrivalMessage, store.currentDialog]);

    useEffect(()=> {
        async function setDialogNewData() {
            await store.setNewDialogArray();
        }
        setDialogNewData();
    }, [store.arrivalMessage]);

    useEffect(() => {
        async function fetchFilteredDialogs() {
            await store.getDialogs();
        }
        fetchFilteredDialogs();
    }, [store.dialogFilter])

    useEffect(() => {
        store.addUserToSocket();
    }, [store.user]);

    useEffect(() => {
        async function fetchDialogs() {
            await store.getDialogs();
            store.setAdmin(store.user.is_admin);
            store.setBlocked(store.user.is_blocked);
            if(store.user.is_blocked)
                await store.getBlockInfo();
            store.requestUsers();
        }
        fetchDialogs();
    }, []);

    useEffect(() => {
        async function fetchMessages() {
            await store.getMessages();
            await store.setMessagesReaded(false);
        }
        fetchMessages();
    }, [store.currentDialog]);

    const handleClickLogout = (e) => {
        e.preventDefault();
        store.logout();
    }

    const handleKeyDown = async (e) => {
        if (e.key === 'Enter') {
            await handleSendMessage(e);
            setNewMessageText('');
        }
    }

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (newMessageText) {
            await store.sendMessage(newMessageText);
            store.sendMessageToSocket(newMessageText);
            setNewMessageText('');
        }
    }

    const handleGetNewDialogUsers = async (e) => {
        e.preventDefault();
        await store.getNewDialogUsers();
        setModalShow(true);
    }

    const handleAddNewDialog = async (user) => {
        store.setNewDialogUser(user);
        setModalShow(false);
        await store.addNewDialog();
        const sendedDialog = store.getAddedDialog();
        store.sendDialogToSocket(sendedDialog);
    }

    useEffect(() => {
        scrollRef.current?.scrollIntoView()
    }, [store.messages])

    function MyVerticallyCenteredModal(props) {
        return (
            <Modal
                {...props}
                size="md"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Выберите пользователя
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container className='users'>
                        {store.addDialogUsers.map((user) => (
                            <div key = {user.id} onClick={() => handleAddNewDialog(user)}>
                                <User
                                    key = {user.id}
                                    first_name = {user.first_name}
                                    last_name = {user.last_name}
                                />
                            </div>
                        ))}
                    </Container>
                </Modal.Body>
            </Modal>
        );
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
                        {store.user.first_name + ' ' + store.user.last_name}
                    </Navbar.Brand>
                    <Container className='buttons'>
                        {store.isAdmin &&
                            <Button variant="success" size='lg' className='admin-button'>
                                <Link className='admin-link' to={ADMIN_ROUTE}>Войти в админку</Link >
                            </Button>
                        }
                        <Button variant="danger" size='lg' className='exit-button'
                            onClick={handleClickLogout}
                        >
                            Выйти
                        </Button>
                    </Container>
                </Container>
            </Navbar>
            <Container fluid className={store.user.is_blocked ? 'chat-wrapper blocked-wrapper' : 'chat-wrapper'}>
            {store.user.is_blocked ?
                <>
                    <span className='blocked'>Вы были заблокированы администратором {store.blockInfo?.userName}</span>
                    <span className='blocked'>Для уточнения обратитесь на данную почту{store.blockInfo?.userEmail}</span>
                </>
                :
                <>
                    <Container className='dialogs-wrapper'>
                        <div className='input-wrapper'>
                            <input
                                placeholder='Найти диалог'
                                className='dialog-input'
                                onChange={(e) => store.setDialogFilter(e.target.value)}
                                onKeyDown={handleKeyDown}
                                value={store.dialogFilter}>
                            </input>
                            <Button variant='light'
                                    className='filter-button'
                                    onClick={() => {store.setDialogFilter('')}}
                            >
                                x
                            </Button>
                        </div>
                        <div className='dialog-list'>
                            {store.dialogs.map((dialog) => (
                                <div key={dialog.id} onClick={() => {
                                    store.setCurrentDialog(dialog)
                                    store.setDialogFilter('');
                                }}>
                                    <Dialog
                                        key={dialog.id}
                                        receiver_name={dialog.receiver_name}
                                        last_message={dialog.last_message}
                                        missed_messages={dialog.missed_messages}
                                        online={dialog.online}
                                    />
                                </div>
                            ))}
                        </div>
                        <Button variant='primary' className='add-dialog' onClick={handleGetNewDialogUsers}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2.5 -2.5 24 24" width="30" fill="currentColor">
                                <path d="M12.238 5.472L3.2 14.51l-.591 2.016 1.975-.571 9.068-9.068-1.414-1.415zM13.78 3.93l1.414 1.414 1.318-1.318a.5.5 0 0 0 0-.707l-.708-.707a.5.5 0 0 0-.707 0L13.781 3.93zm3.439-2.732l.707.707a2.5 2.5 0 0 1 0 3.535L5.634 17.733l-4.22 1.22a1 1 0 0 1-1.237-1.241l1.248-4.255 12.26-12.26a2.5 2.5 0 0 1 3.535 0z"></path>
                            </svg>
                        </Button>{' '}
                    </Container>
                    <Container className='messages-wrapper'>
                        {
                            store.currentDialog ?
                                <>
                                    <Container className='message-list'>
                                        {store.messages?.map((message) => (
                                            <div key={message.id} ref={scrollRef}>
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
                                            onKeyDown={handleKeyDown}
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
                    <MyVerticallyCenteredModal
                        show={modalShow}
                        onHide={() => setModalShow(false)}
                    />
                </>
            }
            </Container>
        </Container>
    );
};

export default observer(Chat);
