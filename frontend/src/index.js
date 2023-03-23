import React from "react";
import { createRoot } from "react-dom/client";

import App from "./App";
import { BrowserRouter } from "react-router-dom";
import UserContextProvider from "./context/userContext";
import AlertProvider from "./context/errorMessageContext";

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
