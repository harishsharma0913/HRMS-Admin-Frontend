import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { Shield, User, Lock } from "lucide-react";
import ForgotPasswordModal from "./ForgotPassword/ForgotPasswordModal";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [open , setOpen] = useState(false);
  const navigate = useNavigate();
  const holdTimeout = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("https://hrms-api.tipsg.in/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      setMessage(data.message);

      if (data.status === true) {
        localStorage.setItem("adminToken", data.token);
        navigate("/home");
      }
    } catch (error) {
      setMessage("Something went wrong!");
    }
  };

  const handleHoldStart = () => {
    holdTimeout.current = setTimeout(() => setShowPassword(true), 200);
  };

  const handleHoldEnd = () => {
    clearTimeout(holdTimeout.current);
    setShowPassword(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 px-4">
      <div className="w-full max-w-[420px] h-[550px] bg-white rounded-2xl shadow-2xl p-8">
        
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 shadow-lg">
            <Shield  className="text-white w-7 h-7" />
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-2xl font-semibold text-center text-purple-600">
          Admin Portal
        </h2>
        <p className="text-center text-sm text-gray-500 mt-1">
          Sign in to access your dashboard
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          
          {/* Email */}
          <div>
            <label className="text-sm font-semibold">Email Address</label>
            <div className="relative mt-1">
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                <User className="w-4 h-4" />
              </span>
            <input
              type="email"
              placeholder="Enter your email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-8 text-sm px-2 py-2 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-semibold">Password</label>
            <div className="relative mt-1">
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-8 text-sm px-2 py-2 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                onPointerDown={handleHoldStart}
                onPointerUp={handleHoldEnd}
                onPointerLeave={handleHoldEnd}
              >
                {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
              </button>
            </div>

            <div className="text-right mt-1">
              <button
                type="button"
                onClick={()=> setOpen(true)}
                className="text-xs text-purple-600 hover:underline"
              >
                Forgot password?
              </button>
            </div>
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-lg font-medium hover:opacity-90 transition shadow-md"
          >
            Sign In
          </button>

          {/* Message */}
          {message && (
            <p
              className={`text-center text-sm ${
                message.includes("wrong") ? "text-red-500" : "text-green-600"
              }`}
            >
              {message}
            </p>
          )}

          {/* Footer */}
          <div className="flex items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-1 text-sm text-gray-500 font-medium">OR</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>
          <div className="text-center text-sm text-gray-500">
            Need help?{" "}
            <span className="text-purple-600 cursor-pointer hover:underline">
              Contact Support
            </span>
          </div>
        </form>
      </div>
      {open && <ForgotPasswordModal open={open} onClose={() => setOpen(false)} />}
    </div>
  );
};

export default Login;
