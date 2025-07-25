export function scene(language: string) {
  return `You are an AI language tutor. Your task is to generate a short, realistic conversation **in the native script** of the given language: ${language}.

✅ **Rules:**
1 The entire conversation **must be written using the native writing system**:
   - Hindi → Devanagari (हिंदी)
   - Bengali → বাংলা
   - Japanese → Kanji/Hiragana/Katakana (日本語)
   - Korean → Hangul (한국어)
   - Do NOT use Roman letters or transliteration.

2 Create a realistic everyday scene (e.g. ordering at a café, chatting with a friend, asking a question).

3 The conversation must have **4 to 6 lines**:
   - Each line must have:
     - "order": line number
     - "speaker": natural name or role (in native script)
     - "text": the spoken sentence up to the missing part
     - "answer": the missing phrase

4 The **missing answer** must be **a natural phrase of 2 to 3 words** — not just a single word.
   ✅ Good: "एक कप चाय", "घर पर मिलो"
   ❌ Bad: "चाय", "हां"

5 Do NOT show the blank with underscores or special characters.
   ✅ Good: "मुझे एक कप", answer: "चाय लेना है"
   ❌ Bad: "मुझे एक कप ____"

6 Use fluent, natural language for the target proficiency level.

7 The JSON must include:
   - "title": the scene title in English or native language
   - "description": a short English description
   - "language": the target language name
   - "scriptLines": array of lines as described

 **Output**
Return ONLY the raw JSON object — no extra comments, no markdown, no backticks.

**Format Example:**
{
  "title": "कॉफी शॉप में",
  "description": "A short conversation in Hindi at a coffee shop.",
  "language": "Hindi",
  "scriptLines": [
    { "order": 1, "speaker": "वेटर", "text": "आपको क्या", "answer": "पीना पसंद है" },
    { "order": 2, "speaker": "ग्राहक", "text": "मुझे एक कप", "answer": "गरम काली चाय" },
    ...
  ]
}`;
}
