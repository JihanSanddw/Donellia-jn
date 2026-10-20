"use client";

import { useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleRegister(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!avatar) {
      setError("Please choose a profile photo.");
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(avatar.type)) {
      setError("Please upload a JPG, PNG, or WEBP image.");
      return;
    }

    if (avatar.size > 2 * 1024 * 1024) {
      setError("Your profile photo must be 2 MB or smaller.");
      return;
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!apiUrl) {
      setError("API URL is not configured.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("username", username.trim());
      formData.append("email", email.trim());
      formData.append("password", password);
      formData.append("avatar", avatar);

      const response = await fetch(
        `${apiUrl.replace(/\/$/, "")}/api/auth/register`,
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            result.error ||
            "Registration failed. Please try again."
        );
      }

      setSuccess(
        result.message ||
          "Your account has been created successfully. You can now log in."
      );

      setUsername("");
      setEmail("");
      setPassword("");
      setAvatar(null);

      const fileInput = document.getElementById("avatar");

      if (fileInput) {
        fileInput.value = "";
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-white p-4 sm:p-6">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-[1600px] grid-cols-1 overflow-hidden rounded-2xl lg:grid-cols-[470px_minmax(0,1fr)]">
        {/* Winter panel */}
        <aside
          className="relative hidden min-h-[600px] overflow-hidden rounded-xl bg-cover bg-center lg:block"
          style={{
            backgroundImage:
              "linear-gradient(180deg, rgba(225,236,250,0.60), rgba(30,66,111,0.12)), url('/images/winter-login.png')",
          }}
        >
          <Link
            href="/"
            aria-label="Back to Donellia home"
            className="absolute inset-0"
          />

          <div className="pointer-events-none absolute inset-x-0 top-[20%] px-12">
            <p className="max-w-[290px] font-serif text-4xl leading-tight text-[#183764]">
              Small plans,
              <br />
              Big happiness.
            </p>
          </div>
        </aside>

        {/* Registration form */}
        <section className="flex items-center justify-center px-5 py-12 sm:px-12 lg:px-16 xl:px-24">
          <div className="w-full max-w-[480px]">
            <Link
              href="/"
              className="inline-block font-serif text-3xl font-bold tracking-tight text-[#183764]"
            >
              Donellia
            </Link>

            <h1 className="mt-7 text-3xl font-semibold tracking-tight text-[#183764]">
              Create Account
            </h1>

            <p className="mt-2 text-sm leading-6 text-[#7189AD]">
              Start your journey with Donellia.
            </p>

            <form onSubmit={handleRegister} className="mt-8 space-y-5">
              {/* Username */}
              <div>
                <label
                  htmlFor="username"
                  className="mb-2 block text-sm text-[#294B78]"
                >
                  Full Name
                </label>

                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="name"
                  required
                  minLength={2}
                  maxLength={50}
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  placeholder="Your name"
                  className="w-full rounded-md border border-[#DCE6F4] px-3.5 py-3 text-sm text-[#183764] outline-none transition placeholder:text-[#8CA0BD] focus:border-[#4776B0] focus:ring-2 focus:ring-[#DCE8F8]"
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm text-[#294B78]"
                >
                  Email Address
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-md border border-[#DCE6F4] px-3.5 py-3 text-sm text-[#183764] outline-none transition placeholder:text-[#8CA0BD] focus:border-[#4776B0] focus:ring-2 focus:ring-[#DCE8F8]"
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm text-[#294B78]"
                >
                  Password
                </label>

                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    minLength={8}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Min. 8 characters"
                    className="w-full rounded-md border border-[#DCE6F4] px-3.5 py-3 pr-12 text-sm text-[#183764] outline-none transition placeholder:text-[#8CA0BD] focus:border-[#4776B0] focus:ring-2 focus:ring-[#DCE8F8]"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="absolute inset-y-0 right-0 flex items-center px-3.5 text-[#4776B0] hover:text-[#183764]"
                  >
                    {showPassword ? (
                      <svg
                        viewBox="0 0 24 24"
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                      >
                        <path d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8" />
                        <path d="M9.9 5.2A10.8 10.8 0 0112 5c5 0 8.5 4.5 9.5 7-.4 1-1.3 2.4-2.6 3.6M6.2 6.2C3.9 7.7 2.8 9.8 2.5 12c.8 2 3.6 6.5 9.5 7 .9 0 1.7-.1 2.4-.4" />
                      </svg>
                    ) : (
                      <svg
                        viewBox="0 0 24 24"
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                      >
                        <path d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Profile photo */}
              <div>
                <label
                  htmlFor="avatar"
                  className="mb-2 block text-sm text-[#294B78]"
                >
                  Profile Photo
                </label>

                <input
                  id="avatar"
                  name="avatar"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  required
                  onChange={(event) => {
                    setAvatar(event.target.files?.[0] || null);
                  }}
                  className="block w-full rounded-md border border-[#DCE6F4] text-sm text-[#7189AD] file:mr-3 file:cursor-pointer file:border-0 file:bg-[#EDF4FD] file:px-3 file:py-3 file:text-[#183764] hover:file:bg-[#DCE8F8]"
                />

                <p className="mt-2 text-xs leading-5 text-[#8195B3]">
                  JPG, PNG, or WEBP. Maximum file size: 2 MB.
                </p>

                {avatar && (
                  <p className="mt-1 truncate text-xs text-[#4776B0]">
                    Selected: {avatar.name}
                  </p>
                )}
              </div>

              {/* Feedback */}
              {error && (
                <p
                  role="alert"
                  className="rounded-md border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700"
                >
                  {error}
                </p>
              )}

              {success && (
                <div
                  role="status"
                  className="rounded-md border border-green-200 bg-green-50 px-3 py-3 text-sm text-green-800"
                >
                  <p>{success}</p>
                  <Link
                    href="/login"
                    className="mt-2 inline-block font-semibold underline"
                  >
                    Continue to Login
                  </Link>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-md bg-[#1C426F] px-4 py-3.5 text-sm font-bold text-white transition duration-200 hover:bg-[#102E55] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Creating account..." : "Register"}
              </button>
            </form>

            <p className="mt-7 text-center text-sm text-[#8195B3]">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-[#183764] hover:underline"
              >
                Login
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
