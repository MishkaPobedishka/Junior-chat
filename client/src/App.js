import {useContext, useEffect, useState} from "react";
import ChatService from "./services/ChatService";
import Login from "./components/Login";
import {BrowserRouter} from "react-router-dom";
import AppRouter from "./components/AppRouter";

function App() {
    const [users, setUsers] = useState([]);

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
        //store.logout();
    }

  return (
        <div>
            ok
        </div>
  );
}

export default App;
