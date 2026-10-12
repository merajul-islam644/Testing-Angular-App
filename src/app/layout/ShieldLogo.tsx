export function ShieldLogo({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="brand-mark"
    >
      <path
        d="M12 2.5 4.5 5v6c0 4.6 3 8.5 7.5 10.5 4.5-2 7.5-5.9 7.5-10.5V5L12 2.5Z"
        fill="currentColor"
      />
      <path
        d="M9.8 10.1a2.2 2.2 0 0 1 2.2-2.2 2.2 2.2 0 0 1 2.2 2.2c0 .8-.43 1.5-1.08 1.9l.18 2.1h-2.6l.18-2.1a2.2 2.2 0 0 1-1.08-1.9Z"
        fill="hsl(var(--background))"
      />
    </svg>
  );
}