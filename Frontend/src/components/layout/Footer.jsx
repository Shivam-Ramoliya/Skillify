import { Link } from "react-router-dom";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="mt-auto bg-white py-8"
      style={{ borderTop: "1px solid var(--color-neutral-200)" }}
    >
      <div className="page-container px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        <Link to="/" className="mb-4 flex items-center gap-3">
          <img
            src="/Skillify.png"
            alt="Skillify"
            className="h-10 w-10 object-contain"
          />
          <h3
            className="text-lg font-bold tracking-tight"
            style={{ color: "var(--color-neutral-900)" }}
          >
            Skillify
          </h3>
        </Link>
        <p
          className="text-sm text-center leading-relaxed max-w-md mb-8"
          style={{ color: "var(--color-neutral-500)" }}
        >
          Build your career by shipping real projects with the perfect team.
          Discover opportunities, collaborate with clients, and grow.
        </p>

        <div
          className="w-full max-w-md pt-6 flex flex-col items-center justify-center gap-2 text-sm md:flex-row md:justify-between"
          style={{
            borderTop: "1px solid var(--color-neutral-200)",
            color: "var(--color-neutral-400)",
          }}
        >
          <p>© {currentYear} Skillify. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Designed with{" "}
            <span
              className="text-lg leading-none"
              style={{ color: "var(--color-error-500)" }}
            >
              ♥
            </span>{" "}
            for freelancers
          </p>
        </div>
      </div>
    </footer>
  );
}
