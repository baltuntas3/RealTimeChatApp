import React, {Suspense} from "react";
import {createRoot} from "react-dom/client";

import App from "./App";
import {BrowserRouter} from "react-router-dom";
import AlertProvider from "./context/errorMessageContext";
import TimeAgo from "javascript-time-ago";
import tr from "javascript-time-ago/locale/tr";
TimeAgo.addDefaultLocale(tr);
const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
    <BrowserRouter>
        <Suspense fallback="Loading...">
            <AlertProvider>
                <App />
            </AlertProvider>
        </Suspense>
    </BrowserRouter>
);
