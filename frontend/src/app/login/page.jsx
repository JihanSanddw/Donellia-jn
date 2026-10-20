"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;

      if (!apiUrl) {
        throw new Error("API URL belum dikonfigurasi.");
      }

      const response = await fetch(
        `${apiUrl.replace(/\/$/, "")}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            password,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || result.error || "Email atau password salah."
        );
      }

      // Mendukung beberapa bentuk respons token dari backend.
      const token =
        result.token ||
        result.data?.token ||
        result.accessToken;

      if (!token) {
        throw new Error(
          "Login berhasil diproses, tetapi token tidak ditemukan pada respons API."
        );
      }

      // Remember me menentukan lama token disimpan di browser.
      const storage = rememberMe ? localStorage : sessionStorage;

      // Hapus token lama agar tidak ada sesi yang membingungkan.
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");

      storage.setItem("token", token);

      router.push("/dashboard");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan. Silakan coba lagi."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-white p-4 sm:p-6 lg:p-6">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-[1600px] grid-cols-1 overflow-hidden rounded-2xl bg-white lg:grid-cols-[470px_minmax(0,1fr)] lg:gap-0">
        {/* Winter image panel */}
        <aside
          className="relative hidden min-h-[600px] overflow-hidden rounded-xl bg-cover bg-center lg:block"
          style={{
            backgroundImage:
              "linear-gradient(180deg, rgba(225,236,250,0.60), rgba(30,66,111,0.12)), url('/images/winter-login.png')",
          }}
        >
          <Link
            href="/"
            className="absolute inset-0"
            aria-label="Back to Donellia home"
          />

          <div className="pointer-events-none absolute inset-x-0 top-[20%] px-12">
            <p className="max-w-[290px] font-serif text-4xl leading-tight text-[#183764]">
              Small plans,
              <br />
              Big happiness.
            </p>
          </div>
        </aside>

        {/* Login form */}
        <section className="flex items-center justify-center px-5 py-12 sm:px-12 lg:px-16 xl:px-24">
          <div className="w-full max-w-[480px]">
            <Link
              href="/"
              className="inline-block font-serif text-3xl font-bold tracking-tight text-[#183764]"
            >
              Donellia
            </Link>

            <h1 className="mt-8 text-3xl font-semibold tracking-tight text-[#183764] sm:mt-9">
              Welcome Back
            </h1>

            <p className="mt-2 text-sm leading-6 text-[#7189AD]">
              Login to your account to continue.
            </p>

            <form onSubmit={handleLogin} className="mt-8 space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm text-[#294B78]"
                >
                  Email Address
                </label>

                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-md border border-[#DCE6F4] bg-white px-3.5 py-3 text-sm text-[#183764] outline-none transition placeholder:text-[#8CA0BD] focus:border-[#4776B0] focus:ring-2 focus:ring-[#DCE8F8]"
                />
              </div>

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
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter your password"
                    className="w-full rounded-md border border-[#DCE6F4] bg-white px-3.5 py-3 pr-12 text-sm text-[#183764] outline-none transition placeholder:text-[#8CA0BD] focus:border-[#4776B0] focus:ring-2 focus:ring-[#DCE8F8]"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="absolute inset-y-0 right-0 flex items-center px-3.5 text-[#4776B0] transition hover:text-[#183764]"
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

              <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
                <label className="flex cursor-pointer items-center gap-2.5 text-[#7189AD]">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(event) => setRememberMe(event.target.checked)}
                    className="h-4 w-4 accent-[#1C426F]"
                  />
                  Remember me
                </label>

                <Link
                  href="#"
                  className="text-[#3569A8] transition hover:text-[#183764] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              {error && (
                <p
                  role="alert"
                  className="rounded-md border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700"
                >
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-md bg-[#1C426F] px-4 py-3.5 text-sm font-bold text-white transition duration-200 hover:bg-[#102E55] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            <p className="mt-7 text-center text-sm text-[#8195B3]">
              Don’t have an account?{" "}
              <Link
                href="#"
                className="font-semibold text-[#183764] transition hover:underline"
              >
                Register
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
