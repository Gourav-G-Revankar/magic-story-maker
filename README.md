# 🪄 Magic Story Maker (ಮ್ಯಾಜಿಕ್ ಕಥೆಗಾರ)

An interactive, AI-powered children's story generator built with **React** and **Vite**, powered by **Groq Cloud API** for ultra-fast, playful bedtime story generation.

> **🎉 What's New in Phase 2:**
> - **🌐 Full Internationalization (i18n):** Bilingual support for **English** and **Kannada (ಕನ್ನಡ)**.
> - **🔄 Instant Language Switcher:** Seamlessly toggle between languages from the top-right header with zero reload.
> - **📖 Native Kannada Story Generation:** Localized AI prompts tuned to write authentic, simple, and cheerful stories in Kannada script.
> - **🗣️ Multilingual Speech Synthesis:** Upgraded Read Aloud engine supporting `kn-IN` voice playback alongside `en-US`.

---

## ✨ Features

- **🌐 Bilingual Experience (Phase 2):**
  - Instant toggle between **English** and **Kannada (ಕನ್ನಡ)**.
  - Fully localized UI strings, story ingredients, presets, and lessons.
  - LLM prompts dynamically adapt to generate rich, kid-friendly stories in the chosen script.
- **🎨 Two Creative Modes:**
  - **Build with Words:** Add custom keywords and ingredients with dynamic chips and one-click suggestions.
  - **Quick Picks:** Visual preset pickers for heroes, magical locations, enchanted items, and moral takeaways.
- **⚡ Ultra-Fast AI Generation:** Powered by Groq's low-latency inference with automatic multi-model failover (`openai/gpt-oss-120b`, `openai/gpt-oss-20b`, `llama-3.1-8b-instant`) and retry handling.
- **🔊 Read Aloud (TTS):** Integrated Web Speech API (`window.speechSynthesis`) tuned to 0.9x speed for kids, with automatic emoji cleaning to prevent awkward voice glitches.
- **📋 One-Click Copy & Share:** Instant clipboard copying with feedback toasts.
- **🎈 Whimsical UI:** Floating animated icons, playful pastels, custom SVG icons, and a fully responsive layout.

---

## 🛠️ Tech Stack

- **Frontend:** React 18 / 19, Vite
- **Localization:** Custom lightweight i18n dictionary system (`src/locales/translations.js`)
- **Styling:** CSS3, Flexbox/Grid, Custom SVG Icons
- **AI Engine:** [Groq Cloud API](https://console.groq.com/)
- **Voice / Audio:** Native Web Speech API (`SpeechSynthesisUtterance`)

---

## 📁 Project Structure

```text
src/
├── assets/
├── components/
│   ├── CustomWordsTab.jsx      # Tag chip input and idea pills
│   ├── FloatingDecorations.jsx # Ambient background animations
│   ├── Header.jsx              # Bilingual app title and banner
│   ├── LanguageToggle.jsx      # Phase 2: English / ಕನ್ನಡ switcher
│   ├── Picker.jsx              # Reusable preset option selector
│   ├── PresetsTab.jsx          # Hero, place, item, and lesson grids
│   ├── StoryResult.jsx         # Story card, copy button & localized TTS
│   └── TabButtons.jsx          # Mode toggle buttons
├── constants/
│   └── storyPresets.js         # Curated idea list and defaults
├── locales/
│   └── translations.js         # Phase 2: EN & KN dictionaries & prompts
├── services/
│   └── groqService.js          # API client, retries, prompt builders, text cleaning
├── App.jsx                     # Core application orchestrator
├── App.css                     # Global design & responsive styling
└── main.jsx                    # Vite app entry point
