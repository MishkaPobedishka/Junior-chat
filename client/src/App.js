import './App.css';
import LoginForm from "./components/LoginForm";
import {useContext, useEffect, useState} from "react";
import {Context} from "./index";
import {observer} from "mobx-react-lite";
import ChatService from "./services/ChatService";

function App() {
    const {store} = useContext(Context)
    const [users, setUsers] = useState([]);
    useEffect(() => {
        if(localStorage.getItem('token')) {
            store.checkAuth();
        }
    }, []);

    async function getUsers(e) {
        e.preventDefault();
        try {
            const response = await ChatService.fetchChats();
            setUsers(response.data);
        } catch (e) {
            console.log(e);
        }
    }

    const handleClickLogout= (e) => {
        e.preventDefault();
        store.logout();
    }

    if (store.isLoading) {
        return <div>Загрузка...</div>
    }

    if (!store.isAuth) {
        return (
            <LoginForm />
        )
    }
  return (
    <div className="wrapper">
        <form>
            <h1>{store.isAuth ? `Пользователь авторизован ${store.chat.first_name}` : "Авторизуйтесь"}</h1>
            <button onClick={handleClickLogout}>Выйти </button>
            <button onClick={getUsers}>Получить пользователей</button>
        </form>
        {users.map(user =>
            <div key={user.id}>{user.first_name}</div>
        )}
    </div>
  );
}

export default observer(App);
