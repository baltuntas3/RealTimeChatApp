import React from "react";
import { createRoot } from "react-dom/client";

import App from "./App";
import axios from "axios";
import { BrowserRouter } from "react-router-dom";
import UserContextProvider from "./context/userContext";
import AlertProvider from "./context/alertContext";

axios.defaults.baseURL = "http://localhost:5000/";
axios.defaults.withCredentials = true;

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
    <BrowserRouter>
        <AlertProvider>
            <UserContextProvider>
                <App />
            </UserContextProvider>
        </AlertProvider>
    </BrowserRouter>
);
