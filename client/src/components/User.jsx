import React from 'react';
import {Container} from "react-bootstrap";
import '../styles/user.css'

const User = ({first_name, last_name}) => {
    return (
        <div className='wrapper'>
            <Container className='user-main-wrapper'>
                <img
                    className='user-image'
                    src='https://img2.freepng.ru/20180329/zue/kisspng-computer-icons-user-profile-person-5abd85306ff7f7.0592226715223698404586.jpg'
                    alt=''
                />
                <span className='username'>{first_name + ' ' + last_name}</span>
            </Container>
        </div>
    );
};

export default User;
