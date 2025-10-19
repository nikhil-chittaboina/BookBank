import React, { useState } from 'react';
import { Mail, Lock, LogIn, Clock,BookOpen} from 'lucide-react'; 
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
// Assuming you have a dark book background image in public/images/
const BG_IMAGE_URL = '/images/banner-images.jpeg'; 

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // ⚠️ INTEGRATE YOUR BACKEND API CALL HERE ⚠️
    try {
        // MOCK SUCCESS (Replace with real API response processing)
        const mockUserData = { id: 'user-123', name: 'Test Admin', role: 'admin' }; 
        
        login(mockUserData);
        
        // Redirect based on role
        navigate(mockUserData.role === 'admin' ? '/admin/dashboard' : '/profile');
    } catch (error) {
        console.error("Login failed:", error);
        // Display error message to user
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-0 sm:p-4">
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-2xl overflow-hidden">
        
        <div className="grid grid-cols-1 lg:grid-cols-2">
          
          {/* --- Left Column: Image and Quote --- */}
          <div 
            className="hidden lg:flex flex-col justify-center p-12 text-white relative"
            style={{ 
              backgroundImage: `url(${BG_IMAGE_URL})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              // Custom gradient overlay for the purple glow
              background: `linear-gradient(135deg, rgba(79, 70, 229, 0.8), rgba(124, 58, 237, 0.8)), url(${BG_IMAGE_URL})`,
              backgroundBlendMode: 'overlay',
              backgroundColor: '#4f46e5' 
            }}
          >
            <div className="text-center">
              <BookOpen className="w-16 h-16 mx-auto mb-4" /> {/* Lucide Book icon */}
              <h2 className="text-3xl font-extrabold mb-4">Welcome Back</h2>
              <blockquote className="text-lg italic mt-4 mb-4">
                "A reader lives a thousand lives before he dies. The man who never reads lives only one."
              </blockquote>
              <p className="text-sm font-semibold">― George R.R. Martin</p>
            </div>
          </div>

          {/* --- Right Column: Login Form --- */}
          <div className="p-8 sm:p-12">
            <h1 className="text-3xl font-extrabold text-gray-800 mb-2">Login to Book Bank</h1>
            <p className="text-sm text-gray-500 mb-8">Invest your time, withdraw knowledge</p>
            
            {/* Form Card */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                <h3 className="text-xl font-bold text-gray-700 mb-4">Sign In</h3>
                <p className="text-sm text-gray-500 mb-6">Enter your credentials to access your account</p>

                {/* Demo Credentials Box */}
                <div className="bg-gray-50 p-3 border border-gray-200 rounded-lg mb-6">
                    <div className="flex items-center text-sm text-gray-600 font-medium mb-1">
                        <Clock className="w-4 h-4 mr-2 text-indigo-500" /> Demo Credentials:
                    </div>
                    <p className="text-xs ml-6">
                        User: user@bookbank.com / user123 <br/>
                        Admin: admin@bookbank.com / admin123
                    </p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Email Input */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="block w-full py-3 px-4 mt-1 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm shadow-sm"
                            placeholder="Enter your email"
                        />
                    </div>

                    {/* Password Input */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="block w-full py-3 px-4 mt-1 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm shadow-sm"
                            placeholder="Enter your password"
                        />
                    </div>
                    
                    <div className="text-right text-sm">
                        <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">Forgot password?</a>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full flex justify-center items-center py-3 px-4 rounded-lg shadow-md text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition duration-150"
                    >
                        Login
                    </button>
                </form>

                {/* Link to Signup */}
                <p className="mt-6 text-center text-sm text-gray-600">
                    Don't have an account? 
                    <Link to="/signup" className="font-medium text-indigo-600 hover:text-indigo-500 ml-1">
                        Sign up
                    </Link>
                </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;