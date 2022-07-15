import {makeAutoObservable} from "mobx";
import AuthService from "../services/AuthService";
import axios from "axios";
import {API_URL} from "../http";
import ChatService from "../services/ChatService";
import {io} from 'socket.io-client';
import {SOCKET_URL} from "../utils/const";


export default class Store{
    user = {};
    blockInfo = {};
    adminUsers = [];
    addDialogUsers = [];
    newDialogUser = null;
    dialogs = [];
    messages = [];
    arrivalMessage = null;
    currentDialog = null;
    isAuth = false;
    isLoading = false;
    isAdmin = false;
    isBlocked = false;
    dialogFilter = '';
    loginError = '';
    registrationError = '';

    socket = null;

    constructor() {
        makeAutoObservable(this);
    }

    setLoginError(error) {
        this.loginError = error;
    }

    setRegistrationError(error) {
        this.registrationError = error;
    }

    setDialogFilter(filter) {
        this.dialogFilter = filter;
    }

    setSocket() {
        this.socket = io(SOCKET_URL);
    }

    setAuth(bool) {
        this.isAuth = bool;
    }

    setAdmin(bool) {
        this.isAdmin = bool;
    }

    setBlocked(bool) {
        this.isBlocked = bool;
    }

    setUser(user) {
        this.user = user;
    }

    setAdminUsers(users) {
        this.adminUsers = users;
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

    setBlockInfo(blockInfo) {
        this.blockInfo = blockInfo;
    }

    fetchSocketAnswers() {
        this.setSocket();
        this.socket.on('getMessage', data => {
            this.setArrivalMessage({
                id: data.id,
                sender_id: data.senderId,
                dialog_id: data.dialogId,
                text: data.text,
                is_read: data.isRead,
                created_at: Date.now(),
            })
        })
        this.socket.on('getDialog', data => {
            this.setDialogs([...this.dialogs, {
                id: data.id,
                user_id: data.receiverId,
                receiver_id: data.userId,
                receiver_name: data.receiverName,
                last_message: data.lastMessage,
                missed_messages: data.missedMessages,
                created_at: data.createdAt
            }])
        })
        this.socket.on('getBlocked', data => {
            this.user.is_blocked = data.blockStatus
            this.setBlockInfo(data);
        })
        this.socket.on('getUsers', data => {
            this.setOnline(data);
        })
    }

    requestUsers() {
        console.log('requestUsers')
        this.socket.emit('requestUsers', {});
    }

    setOnline(users) {
        console.log(users)
        this.setDialogs(
            this.dialogs.map(dialog => {
                dialog.online = false
                const user = users.find(user => dialog.receiver_id === user.userId)
                if (user)
                    dialog.online = true;
                return dialog;
            })
        )
    }

    addUserToSocket() {
        this.socket.emit('addUser', this.user.id, true);
    }

    sendMessageToSocket(newMessageText) {
        this.socket.emit('sendMessage', {
            id: this.getSendedMessageId(),
            senderId: this.user.id,
            dialogId: this.currentDialog.id,
            receiverId: this.currentDialog.receiver_id,
            text: newMessageText,
            isRead: false,
        })
    }

    sendDialogToSocket(sendedDialog) {
        this.socket.emit('addDialog', {
            id: sendedDialog.id,
            userId: sendedDialog.user_id,
            receiverId: sendedDialog.receiver_id,
            receiverName: this.user.first_name + ' ' + this.user.last_name,
            lastMessage: sendedDialog.last_message,
            missedMessages: sendedDialog.missed_messages,
            createdAt: sendedDialog.created_at
        })
    }

    async login(email, password) {
        this.setLoading(true);
        try {
            const response = await AuthService.login(email, password);
            console.log(response.status);
            localStorage.setItem('token', response.data.accessToken);
            this.setAuth(true);
            this.setUser(response.data.user)
        } catch (e) {
            this.setLoginError(e.response?.data?.message);
        } finally {
            this.setLoading(false);
        }
    }

    async registration(first_name, last_name,email, password) {
        this.setLoading(true);
        try {
            const response = await AuthService.registration(first_name, last_name,email, password);
            localStorage.setItem('token', response.data.accessToken);
            this.setAuth(true);
            this.setUser(response.data.user)
        } catch (e) {
            this.setRegistrationError(e.response?.data?.message);
        } finally {
            this.setLoading(false);
        }
    }

    async logout() {
        try {
            await AuthService.logout();
            localStorage.removeItem('token');
            this.setAuth(false);
            this.setUser({})
            this.socket.disconnect();
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
            const response = await ChatService.getDialogs(this.dialogFilter, this.user.id);
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
        this.dialogs = await Promise.all(this.dialogs?.map(async dialog => {
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

    async getAdminUsers() {
        try {
            const response = await ChatService.getAdminUsers(this.user.id);
            this.setAdminUsers(response.data);
        } catch (e) {
            console.log(e.response?.data?.message);
        }
    }

    async blockUser(changedUser, blockStatus) {
        try {
            await ChatService.blockUser(this.user.id, changedUser.id, blockStatus);
            this.adminUsers = this.adminUsers.map(user => {
                if (user.id === changedUser.id)
                    user.is_blocked = blockStatus;
                return user;
            })
            this.socket.emit('setBlocked', {
                receiverId: changedUser.id,
                userName: this.user.first_name + ' ' + this.user.last_name,
                userEmail: this.user.email,
                blockStatus: blockStatus
            })
        } catch (e) {
            console.log(e.response?.data?.message);
        }
    }

    async getBlockInfo() {
        try {
            const response = await ChatService.getBlockInfo(this.user.admin_id);
            this.setBlockInfo(response.data);
        } catch (e) {
            console.log(e.response?.data?.message);
        }
    }

    async deleteUser(deletedUser) {
        try {
            await ChatService.deleteUser(deletedUser.id);
            this.setAdminUsers(this.adminUsers.filter((user) => user.id !== deletedUser.id))
        } catch (e) {
            console.log(e.response?.data?.message);
        }
    }

    async fetchFilteredDialogs() {

    }
}