import axios from "axios";
// import { useAlert } from "../context/errorMessageContext";
// require("dotenv").config();
// process.env.REACT_APP_BASE_URL ||
axios.defaults.baseURL = process.env.REACT_APP_BASE_URL || "http://localhost:5000";
axios.defaults.withCredentials = true;

async function handleRequest(url, payload = undefined) {
    try {
        let data = {};
        if (payload) {
            data = await axios.post(url, payload);
        } else {
            data = await axios.get(url);
        }

        return [data.data, undefined];
    } catch (err) {
        return [undefined, err];
    }
}

async function logIn(login) {
    return await handleRequest("users/login", {
        username: login.username,
        password: login.password,
    });
}
function deleteAllCookies() {
    const cookies = document.cookie.split(";");

    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
}
async function logout() {
    deleteAllCookies();
    return await handleRequest("users/logout");

    // } catch (error) {
    //      return { error: error.response.data, status: error.response.status };
    // }
}

async function getInbox() {
    return await handleRequest("messages/inbox");
}

async function getMessagesByGroupId(groupId) {
    return await handleRequest("messages/group-messages/" + groupId);
}

async function register(registerForm) {
    return await handleRequest("users/sign-in", { ...registerForm, age: 20 });
}

async function getLastMessageInGroup(groupId) {
    return await handleRequest("messages/get-last-message/" + groupId);
}

async function sendMessage(messageBuilder) {
    return await handleRequest("messages/send", messageBuilder);
}
// /group-messages-pagination
async function getMessagesPagination(payload) {
    return await handleRequest("messages/group-messages-pagination", payload);
}

export {
    register,
    getInbox,
    logout,
    logIn,
    getMessagesByGroupId,
    getLastMessageInGroup,
    sendMessage,
    getMessagesPagination,
};
