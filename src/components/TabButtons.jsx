// # Switch between custom words & presets

export default function TabButtons({ activeTab, onTabChange }) {
  return (
    <div className="tab-buttons">
      <button
        className={`tab tab-1 ${activeTab === "custom" ? "active" : ""}`}
        onClick={() => onTabChange("custom")}
      >
        ✏️ Build with Words
      </button>
      <button
        className={`tab tab-2 ${activeTab === "preset" ? "active" : ""}`}
        onClick={() => onTabChange("preset")}
      >
        🎨 Quick Picks
      </button>
    </div>
  );
}
