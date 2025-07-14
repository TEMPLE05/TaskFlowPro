import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import TodoApp from './TodoApp';
import Login from './Login';
import Signup from './Signup';
import ProtectedRoute from './ProtectedRoute';
import ForgotPassword from './ForgotPassword';
import UpdatePassword from './UpdatePassword';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300 px-4 py-10 flex justify-center items-start">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <Router>
          <Routes>
            <Route path="/" element={
              <ProtectedRoute>
                <TodoApp />
              </ProtectedRoute>
            } />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/update-password" element={<UpdatePassword />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </div>
    </div>
  );
}

export default App;
