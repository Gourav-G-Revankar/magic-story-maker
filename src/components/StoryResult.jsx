// # Story display, TTS read aloud, and copy buttons

import { useState, useEffect } from "react";
import { stripEmojis } from "../services/groqService";

export default function StoryResult({ story }) {
  const [reading, setReading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => () => window.speechSynthesis.cancel(), []);

  const toggleSpeech = () => {
    if (!story) return;
    if (reading) {
      window.speechSynthesis.cancel();
      setReading(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(stripEmojis(story));
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    utterance.onend = () => setReading(false);
    utterance.onerror = () => setReading(false);
    window.speechSynthesis.speak(utterance);
    setReading(true);
  };

  const copyStory = async () => {
    try {
      await navigator.clipboard.writeText(story);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      alert("Could not copy. Select the text and copy it manually.");
    }
  };

  const [title, ...paragraphs] = story.split("\n").filter((l) => l.trim());

  return (
    <div className="card story-result">
      <div className="story-actions">
        <h2>📖 Your Adventure</h2>
        <div className="action-buttons">
          <button className="btn-read" onClick={toggleSpeech}>
            {reading ? "⏹ Stop" : "🔊 Read Aloud"}
          </button>
          <button className="btn-copy" onClick={copyStory}>
            {copied ? "✅ Copied!" : "📋 Copy"}
          </button>
        </div>
      </div>
      <div className="story-body">
        <h3 className="story-title">{title}</h3>
        {paragraphs.map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>
    </div>
  );
}
