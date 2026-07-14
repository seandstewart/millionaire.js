export async function loadQuestions(url = '/questions.json') {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to load questions: ${res.status}`);
  const data = await res.json();
  if (!Array.isArray(data.questions)) throw new Error('Invalid question bank format');
  return data.questions;
}
