import axios from "axios";

export async function logIn(login) {
    try {
        const isLoggedIn = await axios.post("users/login", {
            username: login.username,
            password: login.password,
        });

        const { accessToken, refreshToken } = isLoggedIn.data;

        localStorage.setItem("token", accessToken);
        return { user: isLoggedIn.data, status: isLoggedIn.status };
    } catch (error) {
        return { error: error.response.data, status: error.response.status };
    }
}

export async function logout() {
    try {
        const isLogout = await axios.get("users/logout");
        return isLogout.data;
    } catch (error) {
        return { error: error.response.data, status: error.response.status };
    }
}

export async function getInbox(groupId) {
    const getInbox = await axios.get("messages/" + groupId);
    return getInbox.data;
}
