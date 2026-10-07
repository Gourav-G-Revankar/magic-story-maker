# 🪄 Magic Story Maker

An interactive, AI-powered children's story generator built with **React** and **Vite**, powered by **Groq Cloud API** for ultra-fast text generation.

Pick favorite characters, enchanted settings, whimsical objects, and valuable lessons—or type custom story ingredients—to generate cheerful, safe, and illustrated bedtime stories in seconds.

---

## ✨ Features

- **🎨 Two Creative Modes:**
  - **Build with Words:** Add custom keywords and "story ingredients" with tag management and one-click idea suggestions.
  - **Quick Picks:** Select visually through curated presets for heroes, locations, magical items, and moral lessons.
- **⚡ Ultra-Fast Generation:** Powered by Groq's low-latency LLM inference pipeline with automatic multi-model failover and rate-limit retries.
- **🔊 Read Aloud (Text-to-Speech):** Native browser speech synthesis tuned with an upbeat pitch and child-friendly reading pace. Emoji filtering ensures smooth pronunciation.
- **📋 One-Click Copy:** Easily save stories to the clipboard to paste into notes or bedtime reading apps.
- **📱 Responsive & Playful UI:** Floating animated elements, colorful tag chips, and child-safe styling.

---

## 🛠️ Tech Stack

- **Framework:** React 18 / 19
- **Build Tool:** Vite
- **Styling:** CSS3 (Custom styling & SVG icons)
- **AI Inference:** [Groq Cloud API](https://console.groq.com/) (`openai/gpt-oss-120b`, `openai/gpt-oss-20b`, `llama-3.1-8b-instant`)
- **Speech Engine:** Web Speech API (`window.speechSynthesis`)

---

## 📁 Project Structure

```text
src/
├── assets/                  # Static assets and icons
├── components/
│   ├── CustomWordsTab.jsx   # Custom keyword input, chips & idea prompts
│   ├── FloatingDecorations.jsx # Background decorative emojis
│   ├── Header.jsx           # App branding & banner
│   ├── Picker.jsx           # Reusable selection grid for presets
│   ├── PresetsTab.jsx       # Preset selector for character, place, item, moral
│   ├── StoryResult.jsx      # Story reader, TTS controls & copy button
│   └── TabButtons.jsx       # Mode toggle buttons
├── constants/
│   └── storyPresets.js      # Curated preset options & ideas
├── services/
│   └── groqService.js       # Groq API client, failover/retry, text sanitizers
├── App.jsx                  # Main application state container
├── App.css
