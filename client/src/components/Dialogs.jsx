import React, {useContext, useState}from 'react';
import {Button, Container, Navbar} from "react-bootstrap";
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import '../styles/chats.css'
import {useEffect} from "react";


const Dialogs = () => {
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
            <Navbar></Navbar>
            <div>
                <Button onClick={handleClickLogout}>
                    Выйти
                </Button>
            </div>
        </Container>
    );
};

export default observer(Dialogs);
