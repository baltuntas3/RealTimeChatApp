import axios from "axios";

axios.defaults.baseURL = process.env.REACT_APP_BACKEND_BASE_URL || "http://localhost:5000";
axios.defaults.withCredentials = true;
axios.interceptors.response.use(
    (response) => {
        //
        if (response.status === 200) {
            return response;
        }
        return Promise.reject(response);
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            window.location.replace("/auth/login");
        }

        return Promise.reject(error);
    }
);

//TODO: Post, Get ve diğerleri için ayrı handler yap.

async function handleGetRequest(url) {
    try {
        const data = await axios.get(url);

        return [data.data, undefined];
    } catch (err) {
        return [undefined, err.response.data];
    }
}

async function handlePostRequest(url, payload = undefined) {
    try {
        if (!payload) throw new Error("Payload boş olamaz");
        const data = await axios.post(url, payload);

        return [data.data, undefined];
    } catch (err) {
        return [undefined, err.response.data];
    }
}

async function logIn(login) {
    return await handlePostRequest("users/login", {
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
    return await handleGetRequest("users/logout");
}

async function getInbox() {
    return await handleGetRequest("messages/inbox");
}

async function getMessagesByGroupId(groupId) {
    return await handleGetRequest("messages/group-messages/" + groupId);
}

async function registerUser(registerForm) {
    return await handlePostRequest("users/sign-in", { ...registerForm });
}

async function getLastMessageInGroup(groupId) {
    return await handleGetRequest("messages/get-last-message/" + groupId);
}

async function sendMessage(messageBuilder) {
    return await handlePostRequest("messages/send", messageBuilder);
}
// /group-messages-pagination
async function getMessagesPagination(payload) {
    return await handlePostRequest("messages/group-messages-pagination", payload);
}
async function getUserInfo() {
    return await handleGetRequest("users/get-user-info");
}
async function getAllUsers() {
    return await handleGetRequest("users/get-all-users");
}
export {
    registerUser,
    getInbox,
    logout,
    logIn,
    getMessagesByGroupId,
    getLastMessageInGroup,
    sendMessage,
    getMessagesPagination,
    getUserInfo,
    getAllUsers,
};
