import React from 'react';
import {Container} from "react-bootstrap";
import '../styles/message.css'

const Message = ({own}) => {
    return (
        <Container className={own ? 'message own' : 'message'}>
            <Container className={own ? 'message-top own' : 'message-top'}>
                <img
                    className='message-image'
                    src='https://img2.freepng.ru/20180329/zue/kisspng-computer-icons-user-profile-person-5abd85306ff7f7.0592226715223698404586.jpg'
                    alt=''
                />
                <p className='message-text'>Привет Привет Привет Привет Привет Привет Привет Привет Привет Привет Привет Привет Привет Привет</p>
            </Container>
            <Container className='send-time'>19:32</Container>
        </Container>
    );
};

export default Message;
