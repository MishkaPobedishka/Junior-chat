import React, {useContext} from 'react';
import {Button, Container, Navbar} from "react-bootstrap";
import {Link} from "react-router-dom";
import {CHAT_ROUTE} from "../utils/const";
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import '../styles/admin.css'

const Admin = () => {
    const {store} = useContext(Context);

    const handleClickLogout = (e) => {
        e.preventDefault();
        store.logout();
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
                                <Link className='admin-link' to={CHAT_ROUTE}>Вернуться в чат</Link >
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
            <Container className='admin-panel-wrapper'>
                admin panel
            </Container>
        </Container>
    );
};

export default observer(Admin);
