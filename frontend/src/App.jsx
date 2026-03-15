import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import FeedbackForm from './pages/Feedback';
import Analytics from './pages/Analytics';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="feedback" element={<FeedbackForm />} />
                    <Route path="analytics" element={<Analytics />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
