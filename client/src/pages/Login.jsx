
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Login() {
  const location = useLocation();
  const successMessage = location.state?.message;
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setLoginSuccess("");
    setIsLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5001/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Invalid email or password."
        );
      }

      // Authentication state and dashboard routing come next.
      // Don't print or expose the JWT in the browser console.
      if (!data.token || !data.user) {
  throw new Error("Invalid login response from server.");
}

login(data.token, data.user);

navigate("/dashboard", {
  replace: true,
});
    } catch (err) {
      setError(
        err.message || "Unable to sign in. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen bg-page lg:grid-cols-2">
      {/* Left branding section */}
      <section className="hidden flex-col justify-between bg-navy p-12 text-white lg:flex">
        <div className="text-2xl font-extrabold tracking-tight">
          CareerForge <span className="text-indigo-400">AI</span>
        </div>

        <div className="max-w-lg">
          <span className="rounded-full border border-indigo-400/30 bg-indigo-400/10 px-4 py-2 text-sm text-indigo-200">
            Your career, your future
          </span>

          <h1 className="mt-8 text-5xl font-extrabold leading-tight">
            Build the skills.
            <br />
            Shape your future.
          </h1>

          <p className="mt-6 text-lg leading-relaxed text-slate-300">
            Track your DSA progress, showcase your projects,
            improve your resume and prepare for placements
            with CareerForge AI.
          </p>

          <div className="mt-10 grid grid-cols-2 gap-4">
            {[
              "DSA Progress",
              "Project Portfolio",
              "Resume Builder",
              "AI Career Guidance",
            ].map((feature) => (
              <div
                key={feature}
                className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm font-medium"
              >
                <span className="mr-2 text-indigo-400">✦</span>
                {feature}
              </div>
            ))}
          </div>
        </div>

        <p className="text-sm text-slate-400">
          © CareerForge AI
        </p>
      </section>

      {/* Right login section */}
      <section className="flex min-h-screen items-center justify-center px-6 py-12 sm:px-12">
        <div className="w-full max-w-md">
          <div className="mb-10 text-2xl font-extrabold text-navy lg:hidden">
            CareerForge <span className="text-primary">AI</span>
          </div>

          <h2 className="text-3xl font-extrabold tracking-tight text-navy">
            Welcome back
          </h2>

          <p className="mt-3 text-text-muted">
            Sign in to continue your career journey.
          </p>

          {successMessage && !loginSuccess && (
            <div
              role="status"
              className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-medium text-success"
            >
              {successMessage}
            </div>
          )}

          {loginSuccess && (
            <div
              role="status"
              className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-medium text-success"
            >
              {loginSuccess}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="mt-10 space-y-6"
          >
            <Input
              label="Email address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              disabled={isLoading}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              disabled={isLoading}
              required
            />

            {error && (
              <p
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-danger"
              >
                {error}
              </p>
            )}

            <Button
              type="submit"
              className="w-full"
              isLoading={isLoading}
            >
              Sign In
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-text-muted">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-primary hover:underline"
            >
              Sign up
            </Link>
          </p>

          <p className="mt-12 text-center text-xs text-slate-400">
            Your career journey starts here.
          </p>
        </div>
      </section>
    </main>
  );
}

export default Login;