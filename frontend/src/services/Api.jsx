const {VAR_BACKEND_BASE_URL} = import.meta.env;
import axios from "axios";

let isRefreshing = false;
let refreshPromise = null;

axios.defaults.baseURL = VAR_BACKEND_BASE_URL || "http://localhost:5005";
axios.defaults.withCredentials = true;

async function handleHttpRequest(method, url, payload) {
    try {
        const response = await axios[method](url, payload);
        return [response.data, undefined];
    } catch (err) {
        return [undefined, err.response?.data || err.message];
    }
}

function handleGetRequest(url) {
    return handleHttpRequest("get", url);
}

function handlePostRequest(url, payload = {}) {
    return handleHttpRequest("post", url, payload);
}

async function refreshAccessToken() {
    const response = await axios.get("/auth/refresh-token", {
        skipAuthRefresh: true,
    });
    return response.data;
}

function handleTokenRefresh() {
    if (isRefreshing && refreshPromise) {
        return refreshPromise;
    }

    isRefreshing = true;
    refreshPromise = refreshAccessToken()
        .then((token) => {
            return token;
        })
        .catch((error) => {
            throw error;
        })
        .finally(() => {
            isRefreshing = false;
            refreshPromise = null;
        });

    return refreshPromise;
}

axios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (originalRequest.skipAuthRefresh) {
            return Promise.reject(error);
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                await handleTokenRefresh();
                return axios(originalRequest);
            } catch (refreshError) {
                window.location.href = "/auth/login";
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

async function logInUser(userInformation) {
    return await handlePostRequest("auth/login", {
        username: userInformation.username,
        password: userInformation.password,
    });
}

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

function getMessagesPagination(payload) {
    return handlePostRequest("messages/group-messages-pagination", payload);
}

function getUserInfo() {
    return handleGetRequest("auth/get-user-info");
}

function getAllUsers() {
    return handleGetRequest("users/get-all-users");
}

export {registerUser, getInbox, logout, logInUser, getMessagesByGroupId, getLastMessageInGroup, sendMessage, getMessagesPagination, getUserInfo, getAllUsers};
