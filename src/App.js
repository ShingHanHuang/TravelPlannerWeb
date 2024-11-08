import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import TripGenerator from "./TripGenerator";
import TripDetail from "./TripDetail";
import SharedTripsPage from "./SharedTripsPage";


function App() {
    return (
        <Router>
            <div>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/trip_generator" element={<TripGenerator />} />
                    <Route path="/trip/:tripId" element={<TripDetail />} />
                    <Route path="/shared-trips" element={<SharedTripsPage />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
