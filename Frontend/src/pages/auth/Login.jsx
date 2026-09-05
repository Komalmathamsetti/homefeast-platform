import { useState } from "react";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { GoogleLogin } from "@react-oauth/google";
export default function HomeFeastLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post("/auth/login", {
        email,
        password,
      });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem("role", response.data.user.role);
      localStorage.setItem("email", response.data.user.email);
      if (response.data.user.role === "customer") {
        navigate("/customer/dashboard");
      } else if (response.data.user.role === "cook") {
        navigate("/cook/dashboard");
      } else {
        navigate("/admin/dashboard");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login Failed");
    }
  };
  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const response = await API.post("/auth/google", {
        credential: credentialResponse.credential,
      });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem("role", response.data.user.role);
      localStorage.setItem("email", response.data.user.email);
      toast.success("Google Login successful");
      if (response.data.user.role === "customer") {
        navigate("/customer/dashboard");
      } else if (response.data.user.role === "cook") {
        navigate("/cook/dashboard");
      } else {
        navigate("/admin/dashboard");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Google Login failed");
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
            <Link
              to="/"
              className="flex items-center gap-2 font-bold text-2xl text-amber-50 tracking-tight"
            >
              Home
            </Link>
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
            <p className="text-white/50 text-sm mt-1">
              Log in to your account to continue
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            autoComplete="off"
            className="flex flex-col gap-5"
          >
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
                <button type="button">Forgot Password?</button>
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
              <span className="group-hover:translate-x-1 transition-transform">
                →
              </span>
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
            <div className="flex-1 flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={() => {
                  toast.error("Google Login Failed");
                }}
                theme="filled_black"
                size="large"
                text="continue_with"
                shape="rectangular"
                width="250"
              />
            </div>
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
