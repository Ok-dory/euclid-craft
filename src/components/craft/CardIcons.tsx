export function AxiomIcon({ size = 80 }: { size?: number }) {
  return (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" width={size} height={size} className="w-full h-full">
      <circle cx="40" cy="40" r="18" stroke="#c9a84c" strokeWidth="1.5" opacity="0.6" />
      <circle cx="40" cy="40" r="10" fill="#c9a84c" opacity="0.15" />
      <circle cx="40" cy="40" r="10" stroke="#c9a84c" strokeWidth="1.5" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
        const rad = (deg * Math.PI) / 180;
        const x1 = 40 + 12 * Math.cos(rad);
        const y1 = 40 + 12 * Math.sin(rad);
        const x2 = 40 + 22 * Math.cos(rad);
        const y2 = 40 + 22 * Math.sin(rad);
        return <line key={deg} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#c9a84c" strokeWidth="1" opacity="0.5" />;
      })}
      <circle cx="40" cy="40" r="3" fill="#c9a84c" />
    </svg>
  );
}

export function PostulateIcon() {
  return (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <line x1="40" y1="12" x2="24" y2="62" stroke="#7eb8d4" strokeWidth="1.5" />
      <line x1="40" y1="12" x2="56" y2="62" stroke="#7eb8d4" strokeWidth="1.5" />
      <path d="M 24 62 A 18 18 0 0 0 56 62" stroke="#7eb8d4" strokeWidth="1.5" fill="none" />
      <circle cx="40" cy="12" r="3" fill="#7eb8d4" />
      <circle cx="24" cy="62" r="2.5" fill="#7eb8d4" opacity="0.7" />
      <circle cx="56" cy="62" r="2.5" fill="#7eb8d4" opacity="0.7" />
      <line x1="20" y1="38" x2="60" y2="38" stroke="#7eb8d4" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.4" />
    </svg>
  );
}

export function TheoremIcon() {
  return (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <polygon points="40,10 10,68 70,68" stroke="#c9a84c" strokeWidth="1.5" fill="#c9a84c" fillOpacity="0.05" />
      <line x1="40" y1="10" x2="40" y2="68" stroke="#c9a84c" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.5" />
      <line x1="10" y1="68" x2="55" y2="39" stroke="#c9a84c" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.5" />
      <circle cx="40" cy="10" r="2.5" fill="#c9a84c" />
      <circle cx="10" cy="68" r="2.5" fill="#c9a84c" />
      <circle cx="70" cy="68" r="2.5" fill="#c9a84c" />
      <rect x="37" y="65" width="6" height="6" stroke="#c9a84c" strokeWidth="1" fill="none" opacity="0.6" />
    </svg>
  );
}

export function CardIcon({ type }: { type: string }) {
  if (type === 'axiom') return <AxiomIcon />;
  if (type === 'postulate') return <PostulateIcon />;
  return <TheoremIcon />;
}
