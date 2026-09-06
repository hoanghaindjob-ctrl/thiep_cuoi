export function Field({
  label,
  value,
  onChange,
  type = "text",
  wide = false,
  hint,
  options,
  placeholder,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: "text" | "date" | "time" | "url" | "number" | "textarea" | "select";
  wide?: boolean;
  hint?: string;
  /** Only for type="select". */
  options?: string[];
  placeholder?: string;
  rows?: number;
}) {
  return (
    <label className={`field ${wide ? "wide" : ""}`}>
      <span>{label}</span>
      {type === "textarea" ? (
        <textarea
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
        />
      ) : type === "select" ? (
        <select value={value} onChange={(e) => onChange(e.target.value)}>
          {(options ?? []).map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
      {hint && <small>{hint}</small>}
    </label>
  );
}
