import React from 'react';
import {Container} from "react-bootstrap";
import '../styles/message.css'
import {format} from 'timeago.js';

const Message = ({user_message, text, created_at}) => {
    return (
        <Container className={user_message ? 'message own' : 'message'}>
            <Container className={user_message ? 'message-top own' : 'message-top'}>
                <img
                    className='message-image'
                    src='https://img2.freepng.ru/20180329/zue/kisspng-computer-icons-user-profile-person-5abd85306ff7f7.0592226715223698404586.jpg'
                    alt=''
                />
                <p className='message-text'>{text}</p>
            </Container>
            <Container className='send-time'>{format(created_at)}</Container>
        </Container>
    );
};

export default Message;
