
import Link from "next/link";

export default function Home() {
  return (
    <main
      id="home"
      className="relative flex min-h-screen flex-col overflow-hidden bg-[#F3F8FC]"
    >
      {/* Background winter */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `
            linear-gradient(
              90deg,
              rgba(245,249,253,0.98) 0%,
              rgba(245,249,253,0.94) 32%,
              rgba(245,249,253,0.65) 53%,
              rgba(245,249,253,0.08) 100%
            ),
            url('/images/winter-hero.jpg')
          `,
        }}
      />

      {/* Navbar */}
      <header className="relative z-10 flex items-center justify-between px-6 py-6 sm:px-10 lg:px-[4.5%] lg:py-8">
        <Link
          href="/"
          className="font-serif text-3xl font-bold tracking-tight text-[#183764] sm:text-4xl"
        >
          Donellia
        </Link>

        <Link
          href="/register"
          className="rounded-full bg-[#1C426F] px-6 py-3 text-sm font-bold text-white transition duration-300 hover:bg-[#102E55] sm:px-7"
        >
          Get Started
        </Link>
      </header>

      {/* Hero */}
      <section className="relative z-10 flex flex-1 items-center px-6 pb-20 pt-12 sm:px-10 sm:pt-16 lg:px-[5%] lg:pb-24 lg:pt-20">
        <div className="max-w-[560px]">
          <h1 className="font-serif text-[clamp(2.7rem,5vw,4.4rem)] leading-[1.08] tracking-[-0.035em] text-[#183764]">
            Organize Your
            <br />
            Little Moments
            <br />
            with Donellia
          </h1>

          <p className="mt-7 max-w-[470px] text-base leading-[1.9] text-[#4776B0] sm:text-lg">
            Manage your to-do list, wishlist, and gift list in one
            simple place. Make your plans, dreams, and special
            moments come true.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              href="/register"
              className="inline-flex min-w-[142px] items-center justify-center rounded-full bg-[#1C426F] px-7 py-4 text-sm font-bold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[#102E55]"
            >
              Get Started
            </Link>

            <a
              href="#about"
              className="inline-flex min-w-[140px] items-center justify-center rounded-full border border-[#4776B0] px-7 py-4 text-sm font-medium text-[#183764] transition duration-300 hover:bg-white/70"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* About */}
      <section
        id="about"
        className="relative z-10 scroll-mt-8 px-6 pb-12 sm:px-10 lg:px-[5%]"
      >
        <p className="text-sm text-[#4776B0]">
          Small plans, big happiness.
        </p>
      </section>
    </main>
  );
}
