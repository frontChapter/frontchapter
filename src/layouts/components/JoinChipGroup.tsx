import clsx from 'clsx';
import { useState } from 'react';

type Props = {
  label: string;
  hint?: string;
  options: readonly string[];
  selected: string[];
  onChange: (next: string[]) => void; // eslint-disable-line no-unused-vars
  max?: number;
  required?: boolean;
};

const JoinChipGroup = ({
  label,
  hint,
  options,
  selected,
  onChange,
  max = 3,
  required,
}: Props) => {
  const [popped, setPopped] = useState<string | null>(null);

  const toggle = (opt: string) => {
    setPopped(opt);
    window.setTimeout(() => setPopped((p) => (p === opt ? null : p)), 320);

    if (selected.includes(opt)) {
      onChange(selected.filter((s) => s !== opt));
      return;
    }
    if (selected.length >= max) {
      onChange([...selected.slice(1), opt]);
      return;
    }
    onChange([...selected, opt]);
  };

  return (
    <div className="mb-5">
      <p className="mb-2 text-sm font-medium text-dark">
        {label}
        {required ? <span className="text-primary"> *</span> : null}
      </p>
      {hint ? <p className="mb-3 text-xs text-muted">{hint}</p> : null}
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const on = selected.includes(opt);
          return (
            <button
              key={opt}
              type="button"
              className={clsx(
                'join-chip',
                on && 'join-chip--selected',
                popped === opt && 'join-chip--pop'
              )}
              aria-pressed={on}
              onClick={() => toggle(opt)}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default JoinChipGroup;
