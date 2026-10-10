export default function TabButtons({ activeTab, onTabChange, labels }) {
  return (
    <div className="tab-buttons">
      <button
        className={`tab tab-1 ${activeTab === "custom" ? "active" : ""}`}
        onClick={() => onTabChange("custom")}
      >
        {labels.tabWords}
      </button>
      <button
        className={`tab tab-2 ${activeTab === "preset" ? "active" : ""}`}
        onClick={() => onTabChange("preset")}
      >
        {labels.tabPresets}
      </button>
    </div>
  );
}
