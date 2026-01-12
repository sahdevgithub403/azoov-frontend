export default function Input({ label, value, onChange, type="text", error }) {
  return (
    <div>
      <label className="text-sm">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full border p-2 rounded"
      />
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
}
