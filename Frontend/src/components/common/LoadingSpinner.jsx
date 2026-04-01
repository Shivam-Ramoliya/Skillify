export default function LoadingSpinner() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center p-6">
      <div className="glass-card flex flex-col items-center gap-4 px-10 py-8 animate-fade-in">
        <div className="relative">
          <div
            className="h-14 w-14 rounded-full"
            style={{ border: "4px solid var(--color-primary-100)" }}
          ></div>
          <div
            className="absolute top-0 left-0 h-14 w-14 animate-spin rounded-full"
            style={{
              borderWidth: "4px",
              borderStyle: "solid",
              borderColor: "transparent",
              borderTopColor: "var(--color-primary-600)",
              borderRightColor: "var(--color-primary-500)",
            }}
          ></div>
        </div>
        <p
          className="text-base font-semibold animate-pulse tracking-wide"
          style={{ color: "var(--color-primary-700)" }}
        >
          Loading workspace...
        </p>
      </div>
    </div>
  );
}
