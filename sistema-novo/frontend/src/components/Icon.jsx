const paths = {
  home: "M3 11 12 3l9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9Z",
  card: "M3 6h18v12H3zM3 10h18",
  users:
    "M16 20v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m8-10a4 4 0 1 0 0-8 4 4 0 0 0 0 8m8-4a4 4 0 0 1 3 6",
  transfer: "M5 12h14m-6-6 6 6-6 6",
  check: "m5 12 4 4L19 6",
  alert: "M12 8v4m0 4h.01",
};

export function Icon({ name, label }) {
  return (
    <svg
      className="icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-label={label}
      aria-hidden={label ? undefined : "true"}
      role={label ? "img" : undefined}
    >
      <path d={paths[name] || paths.card} />
    </svg>
  );
}
