// # Reusable selection grid

export default function Picker({ title, items, value, onChange }) {
  return (
    <div className="picker">
      <h3>{title}</h3>
      <div className="tiles">
        {items.map((it) => (
          <button
            key={it.label}
            type="button"
            aria-pressed={value === it.label}
            className={`tile ${value === it.label ? "selected" : ""}`}
            onClick={() => onChange(it.label)}
          >
            <span className="tile-emoji">{it.emoji}</span>
            <span className="tile-label">{it.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
