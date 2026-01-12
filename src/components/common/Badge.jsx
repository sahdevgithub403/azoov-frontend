export default function Button({ children, onClick, type="button", variant="primary", disabled }) {
  const styles = {
    primary: "bg-blue-600 text-white",
    danger: "bg-red-600 text-white",
    outline: "border border-gray-400 text-gray-700"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded ${styles[variant]} disabled:opacity-50`}
    >
      {children}
    </button>
  );
}
