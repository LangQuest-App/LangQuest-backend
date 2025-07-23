export function scene(language : string) {
  return `You are an AI language tutor. Generate a conversational scene, create a random scene of you own (like ordering in cafe, asking something to a stranger etc.) in the given language, the language is ${language}.

Instructions:
1. The scene should have a clear title and a short description
2. Write a conversation with 4-6 lines
3. For each line, include the speaker (e.g., Waiter, Customer, Teacher, Student)
4. Make some lines contain blanks (____) for the student to fill in
5. For each blank line, provide the correct answer

IMPORTANT: Return ONLY the raw JSON object without any markdown formatting, code blocks, or additional text.

Format:
{
  "title": "Scene Title",
  "description": "Brief description of the scene",
  "language": "target_language_name",
  "scriptLines": [
    { "order": 1, "speaker": "Speaker1", "text": "Complete sentence without blanks", "answer": null },
    { "order": 2, "speaker": "Speaker2", "text": "Sentence with ____ blank", "answer": "correct_word" },
    { "order": 3, "speaker": "Speaker1", "text": "Another complete sentence", "answer": null },
    { "order": 4, "speaker": "Speaker2", "text": "Another sentence with ____", "answer": "correct_answer" }
  ]
}

Do not wrap the JSON in backticks, code blocks, or any other formatting. Return only the JSON starting with { and ending with }.`;
}
