import {makeAutoObservable} from "mobx";
import AuthService from "../services/AuthService";
import axios from "axios";
import {API_URL} from "../http";
import ChatService from "../services/ChatService";

export default class Store{
    user = {};
    dialogs = [];
    messages = [];
    lastMessage = '';
    arrivalMessage = null;
    currentDialog = null;
    isAuth = false;
    isLoading = false;
    constructor() {
        makeAutoObservable(this);
    }

    setAuth(bool) {
        this.isAuth = bool;
    }

    setUser(user) {
        this.user = user;
    }

    setLoading(bool) {
        this.isLoading = bool;
    }

    setDialogs(dialogs) {
        this.dialogs = dialogs;
    }

    setCurrentDialog(currentDialog) {
        this.currentDialog = currentDialog;
    }

    setMessages(messages) {
        this.messages = messages;
    }

    setArrivalMessage(arrivalMessage) {
        this.arrivalMessage = arrivalMessage;
    }

    async login(email, password) {
        try {
            const response = await AuthService.login(email, password);
            localStorage.setItem('token', response.data.accessToken);
            this.setAuth(true);
            this.setUser(response.data.user)
        } catch (e) {
            console.log(e.response?.data?.message);
        }
    }

    async registration(first_name, last_name,email, password) {
        try {
            const response = await AuthService.registration(first_name, last_name,email, password);
            localStorage.setItem('token', response.data.accessToken);
            this.setAuth(true);
            this.setUser(response.data.user)
        } catch (e) {
            console.log(e.response?.data?.message);
        }
    }

    async logout() {
        try {
            const response = await AuthService.logout();
            localStorage.removeItem('token');
            this.setAuth(false);
            this.setUser({})
        } catch (e) {
            console.log(e.response?.data?.message);
        }
    }

    async checkAuth() {
        this.setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/refresh`, {withCredentials: true})
            localStorage.setItem('token', response.data.accessToken);
            this.setAuth(true);
            this.setUser(response.data.user)
        } catch (e) {
            console.log(e.response?.data?.message);
        } finally {
            this.setLoading(false);
        }
    }

    async getDialogs() {
        try {
            const response = await ChatService.getDialogs(this.user.id);
            this.setDialogs(response.data.dialogs);
        } catch (e) {
            console.log(e.response?.data?.message);
        }
    }

    async getMessages() {
        try {
            if(this.currentDialog) {
                const response = await ChatService.getMessages(this.currentDialog.id);
                this.setMessages(response.data);
            }
        } catch (e) {
            console.log(e.response?.data?.message);
        }
    }

    async sendMessage(newMessageText) {
        try {
            const response = await ChatService.sendMessage(this.user.id, this.currentDialog.id, newMessageText)
            this.setMessages([...this.messages, response.data])
        } catch (e) {
            console.log(e.response?.data?.message);
        }
    }

    openDialog(dialogId, missed_messages) {

    }
}