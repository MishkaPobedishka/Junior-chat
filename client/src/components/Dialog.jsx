import React from 'react';
import {Badge, Container} from "react-bootstrap";
import '../styles/dialog.css'

const Dialog = ({receiver_name, last_message, missed_messages, online}) => {
    return (
        <div className='wrapper'>
            <Container className='dialog-main-wrapper'>
                <div className='brand-wrapper'>
                    <img
                        className='dialog-image'
                        src='https://img2.freepng.ru/20180329/zue/kisspng-computer-icons-user-profile-person-5abd85306ff7f7.0592226715223698404586.jpg'
                        alt=''
                    />
                    <div className= {online ? 'circle circle-online' : 'circle circle-offline'}></div>
                </div>
                <Container className='dialog-info-wrapper'>
                    <span className='dialog-username'>{receiver_name}</span>
                    <p className='dialog-last-message'>{last_message}</p>
                </Container>
                {missed_messages !== 0 &&
                    <Badge className='last-message-count' bg="primary">{missed_messages}</Badge>
                }
            </Container>
        </div>
    );
};

export default Dialog;
