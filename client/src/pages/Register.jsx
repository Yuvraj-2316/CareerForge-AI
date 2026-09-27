
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function handleChange(e) {
    setForm((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (
      form.password.length < 8 ||
      new TextEncoder().encode(form.password).length > 72
    ) {
      setError("Password must be between 8 and 72 bytes.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5001/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: form.name.trim(),
            email: form.email.trim().toLowerCase(),
            password: form.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to create your account."
        );
      }

      // Redirect only after successful registration.
      navigate("/login", {
        replace: true,
        state: {
          message:
            "Account created successfully! Please sign in.",
        },
      });
    } catch (err) {
      setError(
        err.message || "Something went wrong. Please try again."
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
            Your future starts here.
          </h1>

          <p className="mt-6 text-lg leading-relaxed text-slate-300">
            Create your account to track your DSA progress,
            showcase your projects and prepare for placements.
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

      {/* Right signup section */}
      <section className="flex min-h-screen items-center justify-center px-6 py-12 sm:px-12">
        <div className="w-full max-w-md">
          <div className="mb-8 text-2xl font-extrabold text-navy lg:hidden">
            CareerForge <span className="text-primary">AI</span>
          </div>

          <h2 className="text-3xl font-extrabold tracking-tight text-navy">
            Create your account
          </h2>

          <p className="mt-3 text-text-muted">
            Start building your career with CareerForge AI.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-5"
          >
            <Input
              label="Full name"
              name="name"
              placeholder="Enter your full name"
              value={form.name}
              onChange={handleChange}
              autoComplete="name"
              disabled={isLoading}
              required
            />

            <Input
              label="Email address"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              disabled={isLoading}
              required
            />

            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="Create a password"
              value={form.password}
              onChange={handleChange}
              autoComplete="new-password"
              disabled={isLoading}
              required
            />

            <Input
              label="Confirm password"
              name="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={form.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
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
              Create Account
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-text-muted">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-primary hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}

export default Register;