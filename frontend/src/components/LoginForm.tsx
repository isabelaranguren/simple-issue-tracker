import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); // Retained password state
  const { login, error, loading } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <div className="bg-white">
      <div className="flex h-screen flex-col items-center justify-center">
        <div className="max-h-auto mx-auto max-w-xl">
          <div className="mb-8 space-y-3">
            <p className="text-xl font-semibold text-gray-900">Login</p>
            <p className="text-gray-500">Sign in to your account.</p>
          </div>
          <form onSubmit={handleLogin}>
            <div className="mb-10 space-y-4">
              <div className="space-y-2">
                <label
                  className="text-sm font-medium leading-none text-gray-700"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  className="flex h-10 w-full border border-gray-300 px-3 py-2 text-sm placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
                  id="email"
                  type="email"
                  placeholder="mail@example.com"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label
                  className="text-sm font-medium leading-none text-gray-700"
                  htmlFor="password"
                >
                  Password
                </label>
                <input
                  className="flex h-10 w-full border border-gray-300 px-3 py-2 text-sm placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
                  id="password"
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && (
                <p className="text-red-600 text-sm text-center mt-2">{error}</p>
              )}
              <button
                className="flex h-10 w-full items-center justify-center whitespace-nowrap bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:pointer-events-none disabled:opacity-60"
                type="submit"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </div>
          </form>
          {/* Signup link */}
          <div className="text-center text-gray-700">
            No account?{" "}
            <a className="text-blue-600 hover:underline" href="/signup">
              Create one
            </a>{" "}
          </div>
        </div>
      </div>
    </div>
  );
}
