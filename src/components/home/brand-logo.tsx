type BrandLogoProps = {
  className?: string;
  compact?: boolean;
};

export function BrandLogo({ className, compact = false }: BrandLogoProps) {
  return (
    <div className={className}>
      <svg
        width={compact ? "220" : "320"}
        height={compact ? "56" : "80"}
        viewBox="0 0 320 80"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Anjarpanam logo"
        className="h-auto w-full"
      >
        <defs>
          <linearGradient id="anjarpanamLogoGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFD400" />
            <stop offset="100%" stopColor="#FFC000" />
          </linearGradient>
        </defs>

        <rect x="0" y="10" rx="18" ry="18" width="320" height="60" fill="#0B0B0B" />

        <g transform="translate(14,18)">
          <rect x="0" y="0" width="44" height="44" rx="10" fill="url(#anjarpanamLogoGradient)" />
          <path d="M10 32 L20 8 L30 32 Z" fill="#0B0B0B" />
          <rect x="17" y="22" width="6" height="6" fill="#0B0B0B" />
          <path d="M28 12 L36 12 L36 20" stroke="#0B0B0B" strokeWidth="3" fill="none" />
          <path d="M36 12 L26 22" stroke="#0B0B0B" strokeWidth="3" fill="none" />
        </g>

        <g transform="translate(70,26)">
          <text
            x="0"
            y="28"
            className="font-display"
            fontSize="28"
            fontWeight="800"
            fill="#FFFFFF"
            letterSpacing="0.5"
          >
            Anjarpanam
          </text>
          <text
            x="2"
            y="46"
            className="font-display"
            fontSize="10"
            fontWeight="700"
            fill="#FFD400"
            letterSpacing="1.2"
          >
            AI JOB TAILOR
          </text>
        </g>
      </svg>
    </div>
  );
}