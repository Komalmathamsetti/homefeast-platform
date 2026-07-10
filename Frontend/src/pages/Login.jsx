import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function HomeFeastLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await API.post(
      "/auth/login",{
        email,
        password,
      }
    );
    localStorage.setItem(
      "token",
      response.data.token
    );
    localStorage.setItem(
      "user",
      JSON.stringify(response.data.user)
    );
    localStorage.setItem(
    "role",
    response.data.user.role
    );
    localStorage.setItem(
    "email",
    response.data.user.email
    );
    if (response.data.user.role === "customer") {
      navigate("/customer/dashboard");
    }
    else if (response.data.user.role === "cook") {
      navigate("/cook/dashboard");
    }
    else {
      navigate("/admin/dashboard");
    }
    }catch (error){
      alert(error.response?.data?.message || "Login Failed");
    }
  };
  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">

      {/* ── FOOD BACKGROUND ── */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600&q=90')",
        }}
      />

      {/* Dark + warm overlay */}
      <div className="absolute inset-0 bg-linear-to-br from-black/70 via-orange-950/60 to-black/70" />

      {/* Decorative blurred orbs */}
      <div className="absolute top-20 left-16 w-64 h-64 bg-orange-500/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-16 w-72 h-72 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />

      {/* ── GLASS CARD ── */}
      <div className="relative w-full max-w-md">
        <div
          className="rounded-3xl p-8 md:p-10 shadow-2xl border border-white/20"
          style={{
            background: "rgba(255, 255, 255, 0.10)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
          }}
        >

          {/* Logo */}
          <div className="text-center mb-8">
            <span className="inline-flex items-center justify-center w-16 h-16 bg-orange-500 rounded-2xl shadow-lg text-3xl mb-4">
              🍱
            </span>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              HomeFeast
            </h1>
            <p className="text-orange-200 text-sm mt-1 font-medium">
              Real food. Real people. Every day.
            </p>
          </div>

          {/* Heading */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white">Welcome back 👋</h2>
            <p className="text-white/50 text-sm mt-1">Log in to your account to continue</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} autoComplete="off" className="flex flex-col gap-5">

            {/* Email field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-white/70 text-xs font-semibold uppercase tracking-widest">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-300 text-lg pointer-events-none">
                  ✉
                </span>
                <input
                  type="email"
                  name="email"
                  autoComplete="off"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl text-white placeholder-white/30 text-sm font-medium outline-none focus:ring-2 focus:ring-orange-400 transition-all border border-white/15 focus:border-orange-400"
                  style={{
                    background: "rgba(255,255,255,0.08)",
                  }}
                />
              </div>
            </div>

            {/* Password field */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-white/70 text-xs font-semibold uppercase tracking-widest">
                  Password
                </label>
                <button type="button">
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-300 text-lg pointer-events-none">
                  🔒
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full pl-11 pr-12 py-3.5 rounded-xl text-white placeholder-white/30 text-sm font-medium outline-none focus:ring-2 focus:ring-orange-400 transition-all border border-white/15 focus:border-orange-400"
                  style={{
                    background: "rgba(255,255,255,0.08)",
                  }}
                />
                {/* Toggle show/hide */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-orange-300 transition-colors text-sm"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? "🙈" : "👁"}
                </button>
              </div>
            </div>

            {/* Login button */}
            <button
              type="submit"
              className="w-full mt-2 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-extrabold text-base py-4 rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center gap-2 group"
            >
              <span>Login</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>

          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-white/15" />
            <span className="text-white/30 text-xs font-medium">or</span>
            <div className="flex-1 h-px bg-white/15" />
          </div>

          {/* Social login hints (visual only) */}
          <div className="flex gap-3">
            <button
              type="button"
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-white/15 hover:border-white/30 text-white/70 hover:text-white text-sm font-semibold transition-all"
              style={{ background: "rgba(255,255,255,0.06)" }}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>
            <button
              type="button"
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-white/15 hover:border-white/30 text-white/70 hover:text-white text-sm font-semibold transition-all"
              style={{ background: "rgba(255,255,255,0.06)" }}
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Facebook
            </button>
          </div>

          {/* Create account link */}
          <p className="text-center text-white/40 text-sm mt-6">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-orange-300 hover:text-orange-400 font-bold transition-colors"
            >
              Create Account
            </Link>
          </p>

        </div>

        {/* Bottom brand note */}
        <p className="text-center text-white/25 text-xs mt-6">
          © 2026 HomeFeast · Real food, real people.
        </p>
      </div>
    </div>
  );
}
