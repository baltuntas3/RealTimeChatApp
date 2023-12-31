import axios from "axios";

const {VAR_BACKEND_BASE_URL} = import.meta.env;
let isRefreshing = false;
let refreshSubscribers = [];
axios.defaults.baseURL = VAR_BACKEND_BASE_URL || "http://localhost:5000";
axios.defaults.withCredentials = true;
axios.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        const {
            config,
            response: {status},
        } = error;
        const originalRequest = config;

        if (status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            if (!isRefreshing) {
                isRefreshing = true;
                refreshAccessToken().then(() => {
                    isRefreshing = false;
                    onTokenRefreshed();
                    refreshSubscribers = [];
                });
            }

            const retryOrigReq = new Promise((resolve, reject) => {
                subscribeTokenRefresh(() => {
                    resolve(axios(originalRequest));
                });
            });
            return retryOrigReq;
        }
        return Promise.reject(error);
    }
);

function subscribeTokenRefresh(cb) {
    refreshSubscribers.push(cb);
}

function onTokenRefreshed(token) {
    refreshSubscribers.map((cb) => cb(token));
}

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

async function logInUser(userInformation) {
    return await handlePostRequest("auth/login", {
        username: userInformation.username,
        password: userInformation.password,
    });
}

// function deleteAllCookies() {
//     const cookies = document.cookie.split(";");

//     for (let i = 0; i < cookies.length; i++) {
//         const cookie = cookies[i];
//         const eqPos = cookie.indexOf("=");
//         const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
//         document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
//     }
// }

// DENEMEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE
function logout() {
    return handleGetRequest("auth/logout");
}

function getInbox() {
    return handleGetRequest("messages/inbox");
}

function getMessagesByGroupId(groupId) {
    return handleGetRequest("messages/group-messages/" + groupId);
}

function registerUser(registerForm) {
    return handlePostRequest("auth/sign-in", {...registerForm});
}

function getLastMessageInGroup(groupId) {
    return handleGetRequest("messages/get-last-message/" + groupId);
}

function sendMessage(messageBuilder) {
    return handlePostRequest("messages/send", messageBuilder);
}
// /group-messages-pagination
function getMessagesPagination(payload) {
    return handlePostRequest("messages/group-messages-pagination", payload);
}
function getUserInfo() {
    return handleGetRequest("auth/get-user-info");
}
function getAllUsers() {
    return handleGetRequest("users/get-all-users");
}

async function refreshAccessToken() {
    const [refreshToken, err] = await handleGetRequest("/auth/refresh-token");
    if (err) return (window.location.href = "/auth/login");
}

export {
    registerUser,
    getInbox,
    logout,
    logInUser,
    getMessagesByGroupId,
    getLastMessageInGroup,
    sendMessage,
    getMessagesPagination,
    getUserInfo,
    getAllUsers,
};
