interface ScholarInfoProps{
  name: string;
  country :string;
  bio: string | null | undefined;
  languages: string[];
}

export default function ScholarInfo({name, country,bio,languages}:ScholarInfoProps){
  // const ScholarInfo: React.FC<ScholarInfoProps> = ({
  //   name, country, bio, languages
  // }) =>{
  return (
    <>
    <h3
    className="text-lg sm:text-xl font-semibold text-[rgb(var(--foreground-rgb))] mb-1">{name}</h3>
    <p className="text-xs sm:text-xl text-[rgb(var(--muted-text-rgb))] mb-2 italic px-2">{country}</p>
    {bio && <p className="text-xs sm:text-xs text-[rgb(var(--muted-text-rgb))] mb-2 italic px-2">{bio}</p>}
    <p className="txs sm:text-sm text-[rgb(var(--muted-text-rgb))] mb-3"> languages:{languages.join(', ')} </p>
    </>
  );
  };

