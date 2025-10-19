import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// --- Import Global Components ---
import Header from './components/Header';
import Login from './pages/Login'; 
import Signup from './pages/SignUp';
// Ensure you have these pages created in src/pages/:
import Home from './pages/Home'; 
import Catalog from './pages/Catalog'; 
import Profile from './pages/Profile';
import AdminDashboard from './pages/AD';
// ------------------------------------

const App = () => {
  return (
    <Router>
      <AuthProvider>
        {/* Header is rendered globally above all pages */}
        <Header /> 
        
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Authenticated Routes (Any logged-in user: 'admin' or 'user') */}
          <Route element={<ProtectedRoute allowedRoles={['admin', 'member', 'user']} />}>
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/profile" element={<Profile />} />
            {/* Add more general user routes here */}
          </Route>

          {/* Admin-Only Routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            {/* Add more admin routes here (e.g., /admin/users, /admin/books) */}
          </Route>

          {/* Fallback Route */}
          <Route path="*" element={<div className="p-10 text-center">404 - Page Not Found</div>} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;