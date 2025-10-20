import React, { useState } from 'react';
import { Mail, Lock, User, Clock, UserPlus,BookOpen} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

// URL for a signup background image (You can replace this)
const BG_IMAGE_URL = '/images/signup_bg_community.jpg'; 
const SIGNUP_API_URL = 'http://localhost:5000/api/auth/register';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    // console,log('Signup form submitted');
    e.preventDefault();
    // ⚠️ TODO: Integrate with backend /api/auth/register here
    console.log('Signup attempt:', { name, email, password });

    try{

    const response=await fetch(SIGNUP_API_URL, {
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({name,email,password})
    });

    if(!response.ok){
      // Handle error (e.g., show message to user)
      console.error("Signup failed with status:",response.status);
      toast.error("Signup failed. Please try again.");
      return;
    }
    toast.success("Signup successful! Please login.");
    
    // Redirect user to login after successful signup
    navigate('/login');
  } catch (error) {
    // Handle network errors or other unexpected errors
    toast.error("Network error during signup.");
    console.error("Signup failed:", error);
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
              // Custom gradient overlay for a purple glow
              background: `linear-gradient(135deg, rgba(124, 58, 237, 0.8), rgba(168, 85, 247, 0.8)), url(${BG_IMAGE_URL})`,
              backgroundBlendMode: 'overlay',
              backgroundColor: '#8b5cf6' 
            }}
          >
            <div className="text-center">
              <UserPlus className="w-16 h-16 mx-auto mb-4" /> 
              <h2 className="text-3xl font-extrabold mb-4">Join Our Community</h2>
              <blockquote className="text-lg italic mt-4 mb-4">
                "The more that you read, the more things you will know. The more that you learn, the more places you'll go."
              </blockquote>
              <p className="text-sm font-semibold">― Dr. Seuss</p>
            </div>
          </div>

          {/* --- Right Column: Signup Form --- */}
          <div className="p-8 sm:p-12">
            <h1 className="text-3xl font-extrabold text-gray-800 mb-2">Create Your Account</h1>
            <p className="text-sm text-gray-500 mb-8">Start your reading journey today</p>
            
            {/* Form Card */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                <h3 className="text-xl font-bold text-gray-700 mb-4">Sign Up</h3>
                <p className="text-sm text-gray-500 mb-6">Fill in your details to create a new account</p>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    
                    {/* Full Name Input */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="block w-full py-3 px-4 mt-1 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-sm shadow-sm"
                            placeholder="Enter your full name"
                        />
                    </div>

                    {/* Email Input */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="block w-full py-3 px-4 mt-1 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-sm shadow-sm"
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
                            className="block w-full py-3 px-4 mt-1 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-sm shadow-sm"
                            placeholder="Create a password"
                        />
                        <p className="text-xs text-gray-500 mt-1">Password must be at least 6 characters long</p>
                    </div>
                    
                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full flex justify-center items-center py-3 px-4 rounded-lg shadow-md text-base font-semibold text-white bg-purple-600 hover:bg-purple-700 transition duration-150"
                    >
                        Create Account
                    </button>
                </form>

                {/* Link to Login */}
                <p className="mt-6 text-center text-sm text-gray-600">
                    Already have an account? 
                    <Link to="/login" className="font-medium text-purple-600 hover:text-purple-500 ml-1">
                        Login
                    </Link>
                </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;