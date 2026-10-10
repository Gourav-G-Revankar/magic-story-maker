import { useState, useEffect } from "react";
import { stripEmojis } from "../services/groqService";

export default function StoryResult({ story, t, lang }) {
  const [reading, setReading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => () => window.speechSynthesis.cancel(), []);

  const toggleSpeech = () => {
    if (!story) return;
    setNotice("");

    if (reading) {
      window.speechSynthesis.cancel();
      setReading(false);
      return;
    }

    const langTag = lang === "kn" ? "kn-IN" : "en-US";
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find((v) =>
      v.lang.toLowerCase().startsWith(langTag.slice(0, 2)),
    );

    // Many PCs have no Kannada voice; tell the user instead of reading it wrongly
    if (voices.length > 0 && !voice) {
      setNotice(t.noVoice);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(stripEmojis(story));
    utterance.lang = langTag;
    if (voice) utterance.voice = voice;
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
      setNotice(t.errorCopy);
    }
  };

  const [title, ...paragraphs] = story.split("\n").filter((l) => l.trim());

  return (
    <div className="card story-result">
      <div className="story-actions">
        <h2>{t.resultTitle}</h2>
        <div className="action-buttons">
          <button className="btn-read" onClick={toggleSpeech}>
            {reading ? t.btnStop : t.btnRead}
          </button>
          <button className="btn-copy" onClick={copyStory}>
            {copied ? t.btnCopied : t.btnCopy}
          </button>
        </div>
      </div>

      {notice && <p className="error">⚠️ {notice}</p>}

      <div className="story-body">
        <h3 className="story-title">{title}</h3>
        {paragraphs.map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>
    </div>
  );
}
