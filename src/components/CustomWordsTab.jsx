// # Input, idea buttons, and selected tags

import React, { useState } from "react";
import { IDEAS } from "../constants/storyPresets";

export default function CustomWordsTab({ keywords, onAddWord, onRemoveWord }) {
  const [keywordInput, setKeywordInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddWord(keywordInput);
    setKeywordInput("");
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="input-row">
        <input
          type="text"
          placeholder="Type a word... like dragon!"
          value={keywordInput}
          onChange={(e) => setKeywordInput(e.target.value)}
          maxLength={30}
        />
        <button type="submit" className="btn-add">
          + Add
        </button>
      </form>

      <div className="ideas">
        <span>Need ideas?</span>
        {IDEAS.map((i) => (
          <button
            key={i}
            type="button"
            className="idea"
            onClick={() => onAddWord(i.split(" ")[1])}
          >
            {i}
          </button>
        ))}
      </div>

      <h3 className="label">🧺 Story Ingredients</h3>
      <div className="chips-container">
        {keywords.length === 0 && (
          <span className="empty">Nothing here yet. Add a word!</span>
        )}
        {keywords.map((word, index) => (
          <React.Fragment key={word}>
            <span className={`tag-chip c${index % 4}`}>
              {word}
              <button
                type="button"
                aria-label={`Remove ${word}`}
                onClick={() => onRemoveWord(index)}
              >
                <svg
                  viewBox="0 0 10 10"
                  width="10"
                  height="10"
                  aria-hidden="true"
                >
                  <path
                    d="M2 2L8 8M8 2L2 8"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </span>
            {index < keywords.length - 1 && (
              <span className="plus-sign">+</span>
            )}
          </React.Fragment>
        ))}
      </div>
    </>
  );
}
