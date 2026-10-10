// # Groq API call, retry logic, and string helpers

const MODELS = [
  "openai/gpt-oss-120b",
  "openai/gpt-oss-20b",
  "llama-3.1-8b-instant",
];
const API_URL = "https://api.groq.com/openai/v1/chat/completions";
export const MAX_TRIES = 4;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export const cleanText = (t) =>
  t
    .replace(/^#+\s*/gm, "")
    .replace(/\*+/g, "")
    .replace(/_/g, "")
    .trim();

export const stripEmojis = (t) =>
  t
    .replace(
      /\p{Extended_Pictographic}(?:\p{Emoji_Modifier}|\uFE0F|\u200D\p{Extended_Pictographic})*/gu,
      "",
    )
    .replace(/[\p{Regional_Indicator}\uFE0F]/gu, "")
    .replace(/[ \t]+([.,!?;:])/g, "$1")
    .replace(/[ \t]{2,}/g, " ")
    .trim();

export function buildStoryPrompt(items, lang = "en") {
  if (lang === "kn") {
    return `ನೀವು ಮಕ್ಕಳಿಗಾಗಿ ಸುಂದರ ಕಥೆಗಳನ್ನು ರಚಿಸುವ ಬರಹಗಾರರು. 4 ರಿಂದ 8 ವರ್ಷದ ಮಕ್ಕಳಿಗೆ ಅರ್ಥವಾಗುವಂತೆ ಈ ಅಂಶಗಳನ್ನು ಬಳಸಿ ಒಂದು ಸುಂದರ, ಮುದ್ದಾದ ಕಥೆಯನ್ನು ರಚಿಸಿ: ${items.join(", ")}.

ನಿಯಮಗಳು:
- ಸಾಲು 1: ಆಕರ್ಷಕ ಎಮೋಜಿಗಳಿರುವ ಮುದ್ದಾದ ಕನ್ನಡ ಶೀರ್ಷಿಕೆ ನೀಡಿ.
- ಉದ್ದ: ಒಟ್ಟು 8 ರಿಂದ 12 ಸರಳ ವಾಕ್ಯಗಳು.
- ರಚನೆ: 2-3 ವಾಕ್ಯಗಳ ಸಣ್ಣ ಪ್ಯಾರಾಗ್ರಾಫ್‌ಗಳು.
- ಭಾಷೆ: ಸರಳ ಹಾಗೂ ಸ್ಪಷ್ಟ ಕನ್ನಡ ಪದಗಳನ್ನು ಬಳಸಿ.
- ಎಮೋಜಿ: ವಾಕ್ಯಗಳ ನಡುವೆ ಸೂಕ್ತ ಎಮೋಜಿಗಳನ್ನು ಸೇರಿಸಿ.
- ಸಂದೇಶ: ಕಥೆಯ ಕೊನೆಯಲ್ಲಿ ಪ್ರೀತಿ ಹಾಗೂ ಒಳ್ಳೆಯ ಸಂದೇಶವಿರಲಿ.
- ಫಾರ್ಮ್ಯಾಟಿಂಗ್: ಕೇವಲ ಸರಳ ಪಠ್ಯ (plain text). ಯಾವುದೇ markdown (#, **) ಬಳಸಬೇಡಿ.`;
  }

  // Default English prompt
  return `You are a warm, cheerful children's story writer. Write a short, delightful story for kids aged 4 to 8 using these items: ${items.join(", ")}.

Rules:
- Line 1: Put a cute title decorated with fun emojis.
- Length: Around 10 to 15 short sentences total.
- Structure: Break into short paragraphs of 2 to 3 sentences each.
- Emojis: Naturally sprinkle friendly, relevant emojis throughout.
- Language: Simple, easy-to-read vocabulary with an encouraging tone.
- Theme: Gentle, safe, and happy, ending with a warm positive message.
- Formatting: Plain text only. No markdown formatting.`;
}

export async function callGroq(prompt, apiKey, onRetry) {
  let modelIndex = 0;
  for (let attempt = 1; attempt <= MAX_TRIES + MODELS.length; attempt++) {
    const model = MODELS[modelIndex];
    const body = {
      model,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.9,
      max_completion_tokens: 4096,
    };
    if (model.startsWith("openai/gpt-oss")) body.reasoning_effort = "low";

    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => ({}));
    if (res.ok && !data?.error) {
      return data?.choices?.[0]?.message?.content || "";
    }

    const msg = data?.error?.message || "Something went wrong.";

    const noModel =
      res.status === 404 ||
      /does not exist|do not have access|decommissioned|not found/i.test(msg);
    if (noModel && modelIndex < MODELS.length - 1) {
      modelIndex++;
      continue;
    }

    const busy =
      [429, 500, 502, 503, 504].includes(res.status) ||
      /high demand|overloaded|unavailable/i.test(msg);
    if (busy && attempt < MAX_TRIES + MODELS.length) {
      onRetry(Math.min(attempt + 1, MAX_TRIES));
      await sleep(2500 * Math.min(attempt, 3));
      continue;
    }

    throw { status: res.status, message: msg };
  }
}
