export default function Header({ title, subtitle }) {
  return (
    <header className="header">
      <div className="wand">🪄</div>
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </header>
  );
}
