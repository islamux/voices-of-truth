interface ScholarInfoProps {
  name: string;
  country: string;
  bio: string | null | undefined;
  languages: string[];
  languagesLabel: string;
}

export default function ScholarInfo({
  name,
  country,
  bio,
  languages,
  languagesLabel,
}: ScholarInfoProps) {
  return (
    <>
      <h3 className="font-display text-lg font-bold text-foreground sm:text-xl">
        {name}
      </h3>
      {country && <p className="mt-1 text-sm text-muted-foreground">{country}</p>}
      {bio && (
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
          {bio}
        </p>
      )}
      <p className="mt-4 text-xs text-muted-foreground">{languagesLabel}</p>
      <div className="mt-1.5 flex flex-wrap justify-center gap-1.5">
        {languages.map((lang) => (
          <span
            key={lang}
            className="rounded-full bg-secondary px-2.5 py-0.5 text-xs text-secondary-foreground ring-1 ring-border"
          >
            {lang}
          </span>
        ))}
      </div>
    </>
  );
}
