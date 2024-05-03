import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store'; 
import Register from './components/register';
import Login from './components/login';
import Tasks from './components/task';

const App = () => {
    return (
        <Provider store={store}>
            <Router>
                <Routes>
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/" element={<Tasks />} />
                </Routes>
            </Router>
        </Provider>
    );
};

export default App;
