import axios from "axios";
axios.defaults.baseURL = "http://localhost:5000/";
axios.defaults.withCredentials = true;
// import { alertMessage, setAlertMessage } from "../context/errorMessageContext";

async function handleRequest(url, payload = undefined) {
    try {
        let data = {};
        if (payload) {
            data = await axios.post(url, payload);
        } else {
            data = await axios.get(url);
        }
        return [data, undefined];
    } catch (err) {
        return [undefined, err];
    }
}

async function logIn(login) {
    const [data, error] = await handleRequest("users/login", {
        username: login.username,
        password: login.password,
    });
    if (error) return [undefined, error];
    // console.log("hata hataoğlu");

    return [data, undefined];
}

async function logout() {
    try {
        const isLogout = await axios.get("users/logout");
        return isLogout.data;
    } catch (error) {
        return { error: error.response.data, status: error.response.status };
    }
}

async function getInbox() {
    const [getInbox, error] = await handleRequest("messages/inbox");

    if (error) return [undefined, error];
    return [getInbox.data, undefined];
}

async function getMessagesByGroupId(groupId) {
    const [getAllMessages, error] = await handleRequest("messages/group-messages/" + groupId);
    if (error) return [undefined, error];

    return [getAllMessages.data, undefined];
}

async function register(registerForm) {
    try {
        const { data } = await axios.post("users/sign-in", { ...registerForm, age: 20 });
        return data;
    } catch (error) {
        return { error: error.response.data, status: error.response.status };
    }
}

async function getLastMessageInGroup(groupId) {
    const [getLastMessage, error] = await handleRequest("messages/get-last-message/" + groupId);
    if (error) return [undefined, error];

    return [getLastMessage.data, undefined];
}

export { register, getInbox, logout, logIn, getMessagesByGroupId, getLastMessageInGroup };
