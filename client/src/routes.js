import {ADMIN_ROUTE, CHAT_ROUTE, LOGIN_ROUTE, REGISTRATION_ROUTE} from "./utils/const";
import Login from "./components/Login";
import Registration from "./components/Registration";
import Chats from "./components/Chat";
import Admin from "./components/Admin";

export const publicRoutes = [
    {
        path: LOGIN_ROUTE,
        Component: Login
    },
    {
        path: REGISTRATION_ROUTE,
        Component: Registration
    },
]

export const privateRoutes = [
    {
        path: ADMIN_ROUTE,
        Component: Admin
    },
    {
        path: CHAT_ROUTE,
        Component: Chats
    }
]