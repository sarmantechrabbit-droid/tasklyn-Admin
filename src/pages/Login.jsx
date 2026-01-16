import React, { useState } from "react";
import Bg from "../assets/bg-img-form.png";
import RightBg from "../assets/Group.png";
import Logos from "../assets/Logos.png";
import { loginUser } from "../api/auth";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await loginUser(formData);

      // ✅ Save token
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // ✅ Redirect
      navigate("/"); // or dashboard
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-between px-2 bg-cover bg-center"
      style={{ backgroundImage: `url(${Bg})` }}
    >
      {/* LEFT LOGIN CARD */}
      <div className="w-[704px] min-h-screen m-3 bg-white rounded-2xl shadow-xl flex flex-col items-center justify-center">
        <div className="flex items-center absolute left-10 top-10 gap-2 mb-10">
        <img src={Logos} className="w-[100px]"/>
        </div>

        <form onSubmit={handleSubmit} className="w-[360px] py-16">
          {/* Logo */}

          <h2 className="mb-2 text-center font-semibold text-2xl">
            Welcome back
          </h2>

          <p className="mb-8 text-center text-gray-500">
            Login with your email and password
          </p>

          {/* Error */}
          {error && (
            <p className="mb-4 text-sm text-red-500 text-center">{error}</p>
          )}

          {/* Email */}
          <label className="text-sm font-medium mb-1 block">Email</label>
          <input
            type="email"
            name="email"
            required
            placeholder="Enter your email"
            onChange={handleChange}
            className="w-full mb-3 focus:outline-none border rounded-xl px-3 h-12"
          />

          {/* Password */}
          <label className="text-sm font-medium mb-1 block">Password</label>
          <input
            type="password"
            name="password"
            required
            placeholder="Enter your password"
            onChange={handleChange}
            className="w-full mb-6 focus:outline-none border rounded-xl px-3 h-12"
          />

          {/* Remember */}
          <div className="flex justify-between items-center mb-6 text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" />
              Remember me
            </label>
            <span className="text-emerald-600 cursor-pointer">
              Forgot password?
            </span>
          </div>

          {/* Button */}
          <button
            disabled={loading}
            className="w-full flex items-center justify-center gap-1 font-medium text-white"
            style={{
              height: "48px",
              padding: "0 24px",
              borderRadius: "14px",
              borderTop: "1.5px solid rgba(255, 255, 255, 0.25)",
              background:
                "linear-gradient(180deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.00) 100%), linear-gradient(180deg, #277A67 0%, #236355 100%)",
              boxShadow:
                "0 2px 4px 0 rgba(12, 39, 34, 0.15), 0 0 0 1px #204F45",
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>

      {/* RIGHT IMAGE */}
      <div
        className="hidden md:block min-h-screen bg-no-repeat bg-right bg-contain mt-4"
    
      />
      <img  style={{
          width: "600px",
        
        }} className="h-[100vh] mt-10" src={RightBg}/>
    </div>
  );
}
