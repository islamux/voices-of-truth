import Link from "next/link";
import { useTranslation } from "react-i18next";
import WaveformMark from "./WaveformMark";

export default function Logo() {
  const { t, i18n } = useTranslation("header");
  const locale = i18n.language;

  return (
    <Link
      href={`/${locale}`}
      className="group inline-flex items-center gap-2.5 rounded-md"
      aria-label={t("headerTitle")}
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-accent ring-1 ring-border transition-colors group-hover:text-accent/80">
        <WaveformMark className="h-5 w-5" />
      </span>
      <span className="font-display text-lg font-bold text-foreground">
        {t("headerTitle")}
      </span>
    </Link>
  );
}
