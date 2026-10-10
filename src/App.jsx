import { useState } from "react";
import "./App.css";

import { TRANSLATIONS } from "./locales/translations";
import {
  callGroq,
  cleanText,
  buildStoryPrompt,
  MAX_TRIES,
} from "./services/groqService";

import LanguageToggle from "./components/LanguageToggle";
import FloatingDecorations from "./components/FloatingDecorations";
import Header from "./components/Header";
import TabButtons from "./components/TabButtons";
import CustomWordsTab from "./components/CustomWordsTab";
import PresetsTab from "./components/PresetsTab";
import StoryResult from "./components/StoryResult";

const firstPresets = (t) => ({
  character: t.presets.characters[0].label,
  place: t.presets.places[0].label,
  object: t.presets.objects[0].label,
  moral: t.presets.morals[0].label,
});

export function App() {
  const [lang, setLang] = useState("en"); // 'en' or 'kn'
  const t = TRANSLATIONS[lang];

  const [activeTab, setActiveTab] = useState("custom");
  const [keywords, setKeywords] = useState([
    "Mango",
    "Tree",
    "Mountain",
    "Lion",
  ]);
  const [presetSelections, setPresetSelections] = useState(firstPresets(t));

  const [story, setStory] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [retryInfo, setRetryInfo] = useState("");

  const handleLanguageChange = (newLang) => {
    window.speechSynthesis.cancel();
    setLang(newLang);
    setPresetSelections(firstPresets(TRANSLATIONS[newLang]));
    setStory(""); // old story is in the other language
    setError("");
  };

  const handleAddWord = (raw) => {
    const word = raw.trim();
    if (!word) return;
    if (!keywords.some((k) => k.toLowerCase() === word.toLowerCase())) {
      setKeywords((prev) => [...prev, word]);
    }
  };

  const handleRemoveWord = (index) => {
    setKeywords((prev) => prev.filter((_, i) => i !== index));
  };

  const handlePresetChange = (field, value) => {
    setPresetSelections((prev) => ({ ...prev, [field]: value }));
  };

  const generateStory = async () => {
    const items =
      activeTab === "custom"
        ? keywords
        : [
            presetSelections.character,
            presetSelections.place,
            presetSelections.object,
            `${t.lessonPrefix} ${presetSelections.moral}`,
          ];

    if (items.length === 0) {
      setError(t.errorEmpty);
      return;
    }

    const apiKey = import.meta.env.VITE_GROQ_API_KEY;
    if (!apiKey) {
      setError(t.errorApiKey);
      return;
    }

    window.speechSynthesis.cancel();
    setLoading(true);
    setError("");
    setStory("");

    const prompt = buildStoryPrompt(items, lang);

    try {
      const rawText = await callGroq(prompt, apiKey, (n) =>
        setRetryInfo(`${t.generating} (${n}/${MAX_TRIES})`),
      );
      if (rawText) setStory(cleanText(rawText));
      else setError("No story returned. Please try again!");
    } catch (err) {
      console.error(err);
      setError(err?.message || "Error generating story.");
    } finally {
      setLoading(false);
      setRetryInfo("");
    }
  };

  return (
    <div className="container" lang={lang}>
      <div className="top-bar">
        <LanguageToggle currentLang={lang} onToggle={handleLanguageChange} />
      </div>

      <FloatingDecorations />
      <Header title={t.title} subtitle={t.subtitle} />
      <TabButtons activeTab={activeTab} onTabChange={setActiveTab} labels={t} />

      <div className="card">
        {activeTab === "custom" ? (
          <CustomWordsTab
            t={t}
            keywords={keywords}
            onAddWord={handleAddWord}
            onRemoveWord={handleRemoveWord}
          />
        ) : (
          <PresetsTab
            t={t}
            presets={t.presets}
            values={presetSelections}
            onChange={handlePresetChange}
          />
        )}

        <button
          className="btn-generate"
          onClick={generateStory}
          disabled={loading}
        >
          {loading ? retryInfo || t.generating : t.btnGenerate}
        </button>

        {error && <p className="error">⚠️ {error}</p>}
      </div>

      {story && <StoryResult story={story} t={t} lang={lang} />}
    </div>
  );
}

export default App;
