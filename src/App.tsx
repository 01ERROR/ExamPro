import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ExamProvider } from './context/ExamContext';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import ExamDetails from './pages/ExamDetails';
import ExamSession from './pages/ExamSession';
import ExamResult from './pages/ExamResult';

function App() {
  return (
    <AuthProvider>
      <ExamProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Dashboard />} />
            <Route path="/exam/:examId" element={<ExamDetails />} />
            <Route path="/exam/:examId/take" element={<ExamSession />} />
            <Route path="/exam/:examId/result" element={<ExamResult />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </ExamProvider>
    </AuthProvider>
  );
}

export default App;