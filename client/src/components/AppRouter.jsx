import React from 'react';
import {Route, Routes, Navigate, Link} from "react-router-dom";
import {Context} from "../index";
import {useContext, useEffect} from "react";
import {observer} from "mobx-react-lite";
import {privateRoutes, publicRoutes} from "../routes";
import {CHAT_ROUTE, LOGIN_ROUTE, REGISTRATION_ROUTE} from "../utils/const";
import {Spinner} from "react-bootstrap";
import '../styles/loader.css'

const AppRouter = () => {
    const {store} = useContext(Context)

    useEffect(async () => {
        if (localStorage.getItem('token')) {
            await store.checkAuth();
        }
    }, []);

    if (store.isLoading) {
        return (
            <div className='loader-wrapper'>
                <Spinner className='loader' animation="border" variant="primary" />
            </div>
        )
    }

    return store.isAuth ?
        (
            <Routes>
                {privateRoutes.map(({path, Component}) =>
                    <Route key={path} path={path} element={<Component/>} exact={true}/>
                )}
                <Route path='*' element={<Navigate to={CHAT_ROUTE}/>}/>
            </Routes>
        )
        :
        (
            <Routes>
                {publicRoutes.map(({path, Component}) =>
                    <Route key={path} path={path} element={<Component/>} exact={true}/>
                )}
                <Route path='*' element={<Navigate to={LOGIN_ROUTE}/>}/>
            </Routes>
        )
};

export default observer(AppRouter);
