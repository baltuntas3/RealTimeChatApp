import axios from "axios";

axios.defaults.baseURL = process.env.REACT_APP_BASE_URL || "http://localhost:5000";
axios.defaults.withCredentials = true;
// axios.interceptors.response.use(
//     (response) => {
//         //
//         if (response.status === 200) {
//             return response;
//         }
//         return Promise.reject(response);
//     },
//     (error) => {
//         if (error.response && (error.response.status === 401 || error.response.status === 418)) {
//             window.location.replace(process.env.REACT_APP_LOGIN_URL);
//         }

//         return Promise.reject(error);
//     }
// );

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
async function getUserInfo() {
    return await handleRequest("users/get-user-info");
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
    getUserInfo,
};
