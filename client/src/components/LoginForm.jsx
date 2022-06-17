import React, {useContext, useState} from 'react';
import {Context} from "../index";
import {observer} from "mobx-react-lite";

const LoginForm = () => {
    const first_name = '', last_name = '';
    const [email, setEmail] = useState( '');
    const [password, setPassword] = useState( '');
    const {store} = useContext(Context);
    const handleClickLogin = (e) => {
        e.preventDefault();
        store.login(email, password)
    }
    return (
        <div>
            <input
                onChange={e => setEmail(e.target.value)}
                value={email}
                type="text"
                placeholder='Введите Email'
            />
            <input
                onChange={e => setPassword(e.target.value)}
                value={password}
                type='password'
                placeholder='Введите пароль'
            />
            <button onClick={handleClickLogin}>Логин</button>
            <button onClick={() => store.registration(first_name, last_name, email, password)}>Регистрация</button>
        </div>
    );

};

export default observer(LoginForm);
