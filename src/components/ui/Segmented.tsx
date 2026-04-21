interface Option<T extends string> { value: T; label: string }
interface Props<T extends string> {
  value: T;
  onChange: (v: T) => void;
  options: Option<T>[];
}

export function Segmented<T extends string>({ value, onChange, options }: Props<T>) {
  return (
    <div className="glass rounded-full p-1 flex relative">
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            onClick={() => onChange(o.value)}
            className={`press relative flex-1 h-9 px-3 text-sm font-semibold rounded-full transition-colors ${
              active ? 'text-white' : 'text-ink-2'
            }`}
          >
            {active && (
              <span className="absolute inset-0 rounded-full bg-gradient-to-br from-accent-500 to-[#9b5bff] shadow-[0_6px_16px_-8px_rgba(59,91,255,.6)]" />
            )}
            <span className="relative">{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}
