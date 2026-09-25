export function LogoMark({ className = 'logo-mark' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 40" role="img" aria-hidden="true">
      <rect x="2" y="2" width="36" height="36" rx="5" fill="#0f766e" stroke="#14201f" strokeWidth="2" />
      <ellipse cx="20" cy="19" rx="7.5" ry="8.5" fill="#ffffff" />
      <ellipse cx="20" cy="31" rx="4.5" ry="3.6" fill="#ffffff" />
      <circle cx="12" cy="12" r="1.5" fill="#ff6b5e" />
      <circle cx="16" cy="9.5" r="1.7" fill="#ff6b5e" />
      <circle cx="20" cy="8.8" r="1.9" fill="#ff6b5e" />
      <circle cx="24" cy="9.5" r="1.7" fill="#ff6b5e" />
      <circle cx="28" cy="12" r="1.5" fill="#ff6b5e" />
    </svg>
  )
}
