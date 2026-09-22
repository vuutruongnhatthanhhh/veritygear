const SOCIALS = [
  {
    name: "Facebook",
    href: "#",
    icon: (
      <path d="M13.5 21v-7.5h2.52l.38-3H13.5l.004-1.5c0-.78.075-1.2 1.2-1.2h1.68V4.8h-2.52c-2.4 0-3.24 1.212-3.24 3.249V10.5H9v3h1.62V21h2.88Z" />
    ),
  },
  {
    name: "Instagram",
    href: "#",
    icon: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="12" cy="12" r="3.6" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="17.4" cy="6.6" r="1.1" />
      </>
    ),
  },
  {
    name: "TikTok",
    href: "#",
    icon: (
      <path d="M16.6 2.5c.16 1.33.7 2.47 1.6 3.32.86.82 1.98 1.33 3.3 1.45v3.05a8.9 8.9 0 0 1-4.63-1.4v6.4c0 3.2-2.6 5.8-5.8 5.8S5.3 18.12 5.3 14.92c0-3.2 2.6-5.8 5.8-5.8.28 0 .55.02.81.06v3.13a2.73 2.73 0 1 0 1.92 2.6V2.5h3.77Z" />
    ),
  },
  {
    name: "YouTube",
    href: "#",
    icon: (
      <path d="M23.5 6.9a3.02 3.02 0 0 0-2.12-2.14C19.44 4.2 12 4.2 12 4.2s-7.44 0-9.38.56A3.02 3.02 0 0 0 .5 6.9 31.6 31.6 0 0 0 0 12.6a31.6 31.6 0 0 0 .5 5.7 3.02 3.02 0 0 0 2.12 2.14c1.94.56 9.38.56 9.38.56s7.44 0 9.38-.56a3.02 3.02 0 0 0 2.12-2.14 31.6 31.6 0 0 0 .5-5.7 31.6 31.6 0 0 0-.5-5.7ZM9.6 16.1V9.1l6.27 3.5-6.27 3.5Z" />
    ),
  },
];

export default function SocialLinks({
  variant = "dark",
  className = "",
}: {
  variant?: "dark" | "light";
  className?: string;
}) {
  const isDark = variant === "dark";
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {SOCIALS.map((s) => (
        <a
          key={s.name}
          href={s.href}
          aria-label={s.name}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex h-9 w-9 items-center justify-center rounded-full border transition-colors ${
            isDark
              ? "border-paper/20 text-paper/70 hover:border-paper hover:text-paper"
              : "border-ink/20 text-ink/70 hover:border-ink hover:text-ink"
          }`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            {s.icon}
          </svg>
        </a>
      ))}
    </div>
  );
}
