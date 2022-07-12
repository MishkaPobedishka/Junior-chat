import {makeAutoObservable} from "mobx";
import AuthService from "../services/AuthService";
import axios from "axios";
import {API_URL} from "../http";
import ChatService from "../services/ChatService";

export default class Store{
    user = {};
    addDialogUsers = [];
    newDialogUser = null;
    dialogs = [];
    messages = [];
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

    setAddDialogUsers(users) {
        this.addDialogUsers = users;
    }

    setNewDialogUser(user) {
        this.newDialogUser = user;
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
            await AuthService.logout();
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
            this.setLastMessage(newMessageText);
            const response = await ChatService.sendMessage(this.user.id, this.currentDialog.id, newMessageText)
            this.setMessages([...this.messages, response.data])
        } catch (e) {
            console.log(e.response?.data?.message);
        }
    }

    setLastMessage(newMessageText) {
        this.dialogs = this.dialogs.map(dialog => {
            if(this.currentDialog.id === dialog.id)
                dialog.last_message = newMessageText;
            return dialog;
        })
    }

    getSendedMessageId() {
        const lastMessage = this.messages.slice(-1);
        return lastMessage[0].id;
    }

    getAddedDialog() {
        const dialog = this.dialogs[this.dialogs.length-1];
        return {
            id: dialog.id,
            user_id: dialog.user_id,
            receiver_id: dialog.receiver_id,
            receiver_name: dialog.receiver_name,
            last_message: dialog.last_message,
            missed_messages: dialog.missed_messages,
            created_at: dialog.created_at
        }
    }

    async setNewDialogArray() {
        this.dialogs = await Promise.all(this.dialogs.map(async dialog => {
            if (dialog.id === this.arrivalMessage.dialog_id) {
                dialog.last_message = this.arrivalMessage.text;
                if (!this.arrivalMessage.isRead) {
                    if (!(this.currentDialog?.id === dialog.id))
                        dialog.missed_messages++;
                    else
                        await this.setMessagesReaded(true);
                }
                return dialog;
            }
            return dialog;
        }))
    }

    async setMessagesReaded(oneMessage) {
        try {
            if(this.currentDialog) {
                const messages = oneMessage ?
                    this.arrivalMessage.id :
                    this.getUnreadedMessages();
                await ChatService.setMessageReaded(messages);
                this.dialogs = this.dialogs.map(dialog => {
                    if (this.currentDialog?.id === dialog.id)
                        dialog.missed_messages = 0;
                    return dialog;
                })
            }
        } catch (e) {
            console.log(e.response?.data?.message);
        }
    }

    getUnreadedMessages() {
        const unreadedMessages = [];
        this.messages.map(message => {
            if (message.sender_id === this.currentDialog?.receiver_id && !message.is_read)
                unreadedMessages.push(message.id);
        })
        return unreadedMessages;
    }

    async getNewDialogUsers() {
        try {
            const response = await ChatService.getNewDialogUsers(this.user.id);
            this.setAddDialogUsers(response.data);
        } catch (e) {
            console.log(e.response?.data?.message);
        }
    }

    async addNewDialog() {
        try {
            const response = await ChatService.addNewDialog(this.user.id, this.newDialogUser.id);
            let user_id, receiver_id;
            response.data.users.map(user => {
                if (this.user.id === user)
                    user_id = user
                receiver_id = user
            })
            this.setDialogs([...this.dialogs, {
                id: response.data.id,
                user_id: user_id,
                receiver_id: receiver_id,
                receiver_name: this.newDialogUser.first_name + ' ' + this.newDialogUser.last_name,
                last_message: '',
                missed_messages: 0,
                created_at: response.data.created_at
            }]);
        } catch (e) {
            console.log(e.response?.data?.message);
        }
    }
}