import React from 'react';
import {Badge, Container} from "react-bootstrap";
import '../styles/dialog.css'

const Dialog = () => {
    return (
        <div className='wrapper'>
            <Container className='dialog-main-wrapper'>
                <img
                    className='dialog-image'
                    src='https://img2.freepng.ru/20180329/zue/kisspng-computer-icons-user-profile-person-5abd85306ff7f7.0592226715223698404586.jpg'
                    alt=''
                />
                <Container className='dialog-info-wrapper'>
                    <span className='dialog-username'>Михаил Карук</span>
                    <p className='dialog-last-message'>Привет, привет</p>
                </Container>
                <Badge className='last-message-count' bg="primary">100</Badge>
            </Container>
        </div>
    );
};

export default Dialog;
