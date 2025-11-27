import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const holdTimeout = useRef(null); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('https://hrms-api.tipsg.in/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      

      const data = await res.json();
      setMessage(data.message);
      console.log(data);
      
      if (data.status === true) {
        localStorage.setItem('adminToken', data.token);
        navigate('/home');
      }
    } catch (error) {
      setMessage('Something went wrong!');
    }
  };

  const handleHoldStart = (e) => {
    e.preventDefault(); 
    holdTimeout.current = setTimeout(() => setShowPassword(true), 200);
  };

  const handleHoldEnd = () => {
    clearTimeout(holdTimeout.current);
    setShowPassword(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6 transform transition-all duration-500 hover:scale-[1.01] animate-fadeIn">
        <h2 className="text-3xl font-bold text-center text-purple-600">Admin Login</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <input
              type="email"
              placeholder="Enter your email"
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className=" cursor-pointer absolute inset-y-0 right-3 flex items-center text-xl text-gray-500 hover:text-gray-700"
              onPointerDown={handleHoldStart}
              onPointerUp={handleHoldEnd}
              onPointerLeave={handleHoldEnd}
              onPointerCancel={handleHoldEnd}
              title="Double Tap and Hold to show password"
            >
              {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-2 cursor-pointer bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-lg transition duration-300 shadow-sm hover:shadow-md"
          >
            Log in
          </button>

          {message && (
            <p className={`text-center text-sm font-medium ${message.includes('wrong') ? 'text-red-500' : 'text-green-600'}`}>
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
