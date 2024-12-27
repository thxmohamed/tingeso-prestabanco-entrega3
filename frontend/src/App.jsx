import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Home from './components/Home';
import Register from './components/Register';
import './App.css'
import MyProfile from './components/MyProfile';
import CreditSimulate from './components/CreditSimulate'
import CreditApplication from './components/CreditApplication';
import FileUpload from './components/FileUpload';
import ApplicationHistory from './components/ApplicationHistory';
import CreditEvaluation from './components/CreditEvaluation';
import CreditEvaluationP2 from './components/CreditEvaluationP2';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <div className="App">

        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={isLoggedIn ? <Home /> : <Navigate to="/login" />} />
          <Route path="/profile" element={<MyProfile />} />
          <Route path="/simulate" element={<CreditSimulate />} />
          <Route path="/application" element={<CreditApplication />} />
          <Route path="/profile/history" element={< ApplicationHistory/>} />
          <Route path="/application/upload/:creditID" element={<FileUpload />} />
          <Route path = "/evaluation" element={<CreditEvaluation />} />
          <Route path="/evaluation/:creditID" element={<CreditEvaluationP2 />} />
          <Route path="*" element={<Navigate to={isLoggedIn ? "/home" : "/login"} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
