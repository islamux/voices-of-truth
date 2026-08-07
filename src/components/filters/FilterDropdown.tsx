import { useTranslation } from 'react-i18next';

interface FilterDropdownProps {
  label: string;
  filterKey: string;
  options: Array<{ value: string; label: string }>;
  value: string;
  onChange: (value: string) => void;
}

function Chevron() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export default function FilterDropdown({
  label,
  filterKey,
  options,
  value,
  onChange,
}: FilterDropdownProps) {
  const { t } = useTranslation('common');

  return (
    <div className="w-full sm:w-auto sm:min-w-[160px]">
      <label
        htmlFor={`${filterKey}-filter`}
        className="mb-1 block text-xs font-medium text-muted-foreground"
      >
        {label}
      </label>
      <div className="relative">
        <select
          id={`${filterKey}-filter`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-full appearance-none rounded-md border border-border bg-background ps-3 pe-9 text-sm text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">{t('all')}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute inset-y-0 end-3 flex items-center text-muted-foreground">
          <Chevron />
        </span>
      </div>
    </div>
  );
}
