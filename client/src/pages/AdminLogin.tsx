import { useState } from "react";
import { useLocation } from "wouter";

const LOGO_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663455556448/epjCjfnCCf8LFtGtGELo3e/baraka-logo-draft_1_e8f3dd40.jpg";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [, setLocation] = useLocation();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Simulate login delay
    setTimeout(() => {
      if (username === "admin" && password === "Keonlabs2024") {
        // Store auth token in localStorage
        localStorage.setItem("adminAuth", "true");
        localStorage.setItem("adminLoginTime", new Date().toISOString());
        setLocation("/admin");
      } else {
        setError("Invalid username or password");
        setLoading(false);
      }
    }, 500);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: "url('https://d2xsxph8kpxj0f.cloudfront.net/310519663455556448/epjCjfnCCf8LFtGtGELo3e/Main page image_d0d55fa9.jpg')",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Login form */}
      <div className="relative z-10 bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
        {/* Logo and Title */}
        <div className="flex flex-col items-center mb-8">
          <img src={LOGO_URL} alt="Baraka Logo" className="h-32 w-32 object-contain mb-4" />
          <p className="text-center text-lg font-semibold" style={{ color: "#95ba12" }}>Kapiri mposhi Baraka learning center</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Username */}
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: "#2d3e2d" }}>
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              className="w-full p-3 border-2 rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: "#2d3e2d" }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full p-3 border-2 rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          {/* Error message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Login button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: "#8abc20" }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Footer text */}
        <p className="text-center text-xs text-gray-500 mt-6">
          © 2026 Baraka learning center. All rights reserved.
        </p>
      </div>
    </div>
  );
}
