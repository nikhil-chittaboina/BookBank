import React from "react";
import { Toaster } from "react-hot-toast";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// --- Import Global Components ---
import Header from "./components/Header";
import Login from "./pages/Login";
import Signup from "./pages/SignUp";
import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashBoard";
// ------------------------------------

const AppContent = () => {
  const { isLoading } = useAuth(); // ✅ get isLoading from context

  if (isLoading) {
    // ✅ Show loading screen until auth check completes
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-xl text-indigo-600">Loading...</div>
      </div>
    );
  }

  return (
    <>
      {/* Header is rendered globally above all pages */}
      <Header />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Authenticated Routes */}
        <Route
          element={<ProtectedRoute allowedRoles={["admin", "member", "user"]} />}
        >
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Admin-Only Routes */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Route>

        {/* 404 Fallback */}
        <Route
          path="*"
          element={<div className="p-10 text-center">404 - Page Not Found</div>}
        />
      </Routes>

      <Toaster position="top-right" reverseOrder={false} />
    </>
  );
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
};

export default App;
