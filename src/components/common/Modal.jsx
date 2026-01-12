export default function Select({ label, options, value, onChange }) {
  return (
    <div>
      <label>{label}</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full border p-2 rounded"
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
