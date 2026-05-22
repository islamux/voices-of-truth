interface ScholarInfoProps{
  name: string;
  country :string;
  bio: string | null | undefined;
  languages: string[];
  languagesLabel: string;
}

export default function ScholarInfo({name, country,bio,languages,languagesLabel}:ScholarInfoProps){
  return (
    <>
    <h3
    className="text-lg sm:text-xl font-semibold text-foreground mb-2">{name}</h3>
    <p className="text-sm sm:text-base text-muted-foreground mb-2 italic px-2">{country}</p>
    {bio && <p className="text-xs sm:text-sm text-muted-foreground mb-2 italic px-2">{bio}</p>}
    <p className="text-xs sm:text-sm text-muted-foreground mb-2"> {languagesLabel}: {languages.join(', ')} </p>
    </>
  );
  };
