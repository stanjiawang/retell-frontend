import { useState } from 'react';
import { DROPDOWN_MENU, DROPDOWN_OPTION, DROPDOWN_TRIGGER, SECTION_LABEL } from './tokens';

type DropdownOption<T extends string> = {
  value: T;
  label: string;
};

type ColumnDropdownProps<T extends string> = {
  disabled?: boolean;
  id: string;
  label: string;
  onChange: (value: T) => void;
  options: DropdownOption<T>[];
  value: T;
};

export function ColumnDropdown<T extends string>({
  disabled = false,
  id,
  label,
  onChange,
  options,
  value,
}: ColumnDropdownProps<T>) {
  const [open, setOpen] = useState(false);
  const activeLabel = options.find((option) => option.value === value)?.label ?? label;

  function handleSelect(nextValue: T) {
    onChange(nextValue);
    setOpen(false);
  }

  function handleToggle() {
    if (disabled) {
      return;
    }

    setOpen((current) => !current);
  }

  return (
    <div className="grid gap-2">
      <label className={SECTION_LABEL} htmlFor={id}>
        {label}
      </label>
      <div className="relative">
        <button
          id={id}
          type="button"
          className={DROPDOWN_TRIGGER}
          aria-expanded={open}
          aria-haspopup="listbox"
          onClick={handleToggle}
          disabled={disabled}
        >
          <span>{activeLabel}</span>
          <svg
            className={`h-4 w-4 text-slate-400 transition ${open ? 'rotate-180' : ''}`}
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M4 6.5L8 10L12 6.5"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {open ? (
          <div className={DROPDOWN_MENU}>
            <div className="grid gap-1" role="listbox" aria-labelledby={id}>
              {options.map((option) => {
                const isActive = option.value === value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    className={`${DROPDOWN_OPTION} ${
                      isActive
                        ? 'bg-sky-50 text-sky-700'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                    role="option"
                    aria-selected={isActive}
                    onClick={() => handleSelect(option.value)}
                  >
                    <span>{option.label}</span>
                    <span
                      className={`text-xs ${isActive ? 'text-sky-500' : 'invisible'}`}
                      aria-hidden="true"
                    >
                      Selected
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
