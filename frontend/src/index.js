import React from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';
import axios from 'axios'
import {BrowserRouter} from 'react-router-dom'

axios.defaults.baseURL="http://localhost:3000/"
axios.defaults.withCredentials=true

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);


root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>

);

