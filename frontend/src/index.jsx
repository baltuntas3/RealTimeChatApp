import React, {Suspense} from "react";
import {createRoot} from "react-dom/client";

import App from "./App";
import {BrowserRouter} from "react-router-dom";
import AlertProvider from "./context/errorMessageContext";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
    <BrowserRouter>
        <AlertProvider>
            <Suspense fallback="Loading...">
                <App />
            </Suspense>
        </AlertProvider>
    </BrowserRouter>
);
