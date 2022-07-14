import React, {useContext, useEffect} from 'react';
import {Button, Card, Col, Container, Navbar, Row} from "react-bootstrap";
import {Link} from "react-router-dom";
import {CHAT_ROUTE} from "../utils/const";
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import '../styles/admin.css'

const Admin = () => {
    const {store} = useContext(Context);

    useEffect(() => {
        async function fetchAdminUsers() {
            await store.getAdminUsers();
        }
        fetchAdminUsers();
    }, []);


    const handleClickLogout = (e) => {
        e.preventDefault();
        store.logout();
    }

    const handleBlockUser = async (user, blockStatus) => {
        await store.blockUser(user, blockStatus);
    }

    const handleDeleteUser = async (user) => {
        await store.deleteUser(user);
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
                <Row xs={1} md={2} lg={3} className='row-wrapper'>
                    {store.adminUsers.map((user) => (
                        <Col className="g-4 h-25">
                            <Card key={user.id}>
                                <Container className='card-wrapper'>
                                    <Card.Body>
                                        <Card.Title className='text-center'>{user.first_name + ' ' + user.last_name}</Card.Title>
                                        <Card.Text className='text-center'>
                                            email: {user.email}
                                        </Card.Text>
                                        <Container className='button-wrapper'>
                                            {user.is_blocked ?
                                                <Button variant='warning' onClick={
                                                    () => handleBlockUser(user, false)
                                                }>Разблокировать</Button>
                                                :
                                                <Button variant='warning' onClick={
                                                    () => handleBlockUser(user, true)
                                                }>Заблокировать</Button>
                                            }

                                            <Button variant='danger' onClick={
                                                () => handleDeleteUser(user)
                                            }>Удалить</Button>
                                        </Container>
                                    </Card.Body>
                                </Container>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>
        </Container>
    );
};

export default observer(Admin);
