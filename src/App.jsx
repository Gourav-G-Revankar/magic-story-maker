// # Main state container orchestrating components

import { useState } from "react";
import "./App.css";

import { PRESETS } from "./constants/storyPresets";
import {
  callGroq,
  cleanText,
  buildStoryPrompt,
  MAX_TRIES,
} from "./services/groqService";

import FloatingDecorations from "./components/FloatingDecorations";
import Header from "./components/Header";
import TabButtons from "./components/TabButtons";
import CustomWordsTab from "./components/CustomWordsTab";
import PresetsTab from "./components/PresetsTab";
import StoryResult from "./components/StoryResult";

export function App() {
  const [activeTab, setActiveTab] = useState("custom");
  const [keywords, setKeywords] = useState(["Book", "Tree", "Mountain"]);

  const [presetSelections, setPresetSelections] = useState({
    character: PRESETS.characters[0].label,
    place: PRESETS.places[0].label,
    object: PRESETS.objects[0].label,
    moral: PRESETS.morals[0].label,
  });

  const [story, setStory] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [retryInfo, setRetryInfo] = useState("");

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
            `Lesson: ${presetSelections.moral}`,
          ];

    if (items.length === 0) {
      setError("Add at least one word first!");
      return;
    }

    const apiKey = import.meta.env.VITE_GROQ_API_KEY;
    if (!apiKey) {
      setError("API key missing. Add VITE_GROQ_API_KEY to .env and restart.");
      return;
    }

    window.speechSynthesis.cancel();
    setLoading(true);
    setError("");
    setStory("");

    const prompt = buildStoryPrompt(items);

    try {
      const rawText = await callGroq(prompt, apiKey, (n) =>
        setRetryInfo(`Magic is busy, trying again (${n}/${MAX_TRIES})...`),
      );
      if (rawText) setStory(cleanText(rawText));
      else setError("No story came back. Please try again!");
    } catch (err) {
      console.error(err);
      setError(
        err?.status
          ? `${err.message} (Free limit or busy servers. Wait a minute and try again.)`
          : "Network error. Check your connection and try again.",
      );
    } finally {
      setLoading(false);
      setRetryInfo("");
    }
  };

  return (
    <div className="container">
      <FloatingDecorations />
      <Header />
      <TabButtons activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="card">
        {activeTab === "custom" ? (
          <CustomWordsTab
            keywords={keywords}
            onAddWord={handleAddWord}
            onRemoveWord={handleRemoveWord}
          />
        ) : (
          <PresetsTab values={presetSelections} onChange={handlePresetChange} />
        )}

        <button
          className="btn-generate"
          onClick={generateStory}
          disabled={loading}
        >
          {loading
            ? retryInfo || "🪄 Spinning a story..."
            : "🌟 Create Magic Story!"}
        </button>

        {loading && (
          <div className="loader" aria-live="polite">
            <span>🦁</span>
            <span>🌈</span>
            <span>📖</span>
            <span>⭐</span>
          </div>
        )}

        {error && <p className="error">⚠️ {error}</p>}
      </div>

      {story && <StoryResult story={story} />}
    </div>
  );
}

export default App;
