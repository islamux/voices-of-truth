interface WaveformMarkProps {
  className?: string;
  title?: string;
}

export default function WaveformMark({ className, title }: WaveformMarkProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      role={title ? "img" : "presentation"}
      aria-hidden={title ? undefined : true}
    >
      {title ? <title>{title}</title> : null}
      <rect x="2.8" y="9" width="2.4" height="6" rx="1.2" />
      <rect x="6.8" y="6" width="2.4" height="12" rx="1.2" />
      <rect x="10.8" y="1.5" width="2.4" height="21" rx="1.2" />
      <rect x="14.8" y="6" width="2.4" height="12" rx="1.2" />
      <rect x="18.8" y="9" width="2.4" height="6" rx="1.2" />
    </svg>
  );
}
