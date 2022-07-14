import React, {createContext} from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import Store from "./store/store";
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter} from "react-router-dom";
import AppRouter from "./components/AppRouter";

const store = new Store();

export const Context = createContext({
    store
})

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Context.Provider value={{store}}>
        <BrowserRouter>
            <AppRouter/>
        </BrowserRouter>
    </Context.Provider>
);
reportWebVitals();
