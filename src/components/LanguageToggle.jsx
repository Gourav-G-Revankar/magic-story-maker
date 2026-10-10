export default function LanguageToggle({ currentLang, onToggle }) {
  return (
    <div className="language-toggle">
      <button
        type="button"
        className={`lang-btn ${currentLang === "en" ? "active" : ""}`}
        onClick={() => onToggle("en")}
        aria-label="Switch to English"
      >
        English
      </button>
      <button
        type="button"
        className={`lang-btn ${currentLang === "kn" ? "active" : ""}`}
        onClick={() => onToggle("kn")}
        aria-label="ಕನ್ನಡಕ್ಕೆ ಬದಲಾಯಿಸಿ"
      >
        ಕನ್ನಡ
      </button>
    </div>
  );
}
