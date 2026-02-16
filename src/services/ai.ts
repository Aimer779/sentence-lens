import type { AnalysisResult, ApiSettings } from '../types/analysis';

const SYSTEM_PROMPT = `You are an expert English linguist and grammar analyst. Analyze the given English sentence and return a JSON object with the following structure:

{
  "originalSentence": "the input sentence",
  "tokens": [
    {
      "text": "word or phrase",
      "pos": "noun|verb|adjective|adverb|preposition|conjunction|pronoun|determiner|auxiliary|modal|infinitive|participle|interjection|punctuation",
      "role": "subject|predicate|object|complement|attributive|adverbial|clause|connector|punctuation",
      "meaning": "Chinese meaning of this word/phrase"
    }
  ],
  "tree": {
    "label": "Sentence",
    "type": "sentence",
    "text": "full sentence",
    "translation": "Chinese translation",
    "children": [
      {
        "label": "Main Clause",
        "type": "main_clause",
        "text": "main clause text",
        "translation": "Chinese translation of this clause",
        "children": [
          {
            "label": "Subject",
            "type": "component",
            "role": "subject",
            "text": "subject text"
          },
          {
            "label": "Predicate",
            "type": "component",
            "role": "predicate",
            "text": "predicate text"
          }
        ]
      },
      {
        "label": "Relative Clause",
        "type": "subordinate_clause",
        "role": "clause",
        "text": "clause text",
        "translation": "Chinese translation",
        "children": []
      }
    ]
  },
  "fullTranslation": "Complete Chinese translation of the entire sentence",
  "patterns": [
    {
      "name": "Pattern name (e.g. Relative Clause, Passive Voice)",
      "description": "Brief explanation in Chinese"
    }
  ]
}

Rules:
1. tokens should cover every word in the sentence (including punctuation as separate tokens).
2. Group closely related words into a single token when they form a grammatical unit (e.g. "turned out" as one verb phrase, "one of the most comprehensive guides" as one noun phrase). But do NOT over-group — keep it granular enough that users can see the role of each meaningful part.
3. The tree should hierarchically decompose the sentence into clauses, then into components (subject, predicate, object, etc.).
4. Identify all notable grammar patterns (relative clauses, noun clauses, participle phrases, etc.).
5. All "meaning" and "translation" fields should be in Chinese.
6. Return ONLY the JSON object, no markdown fences, no explanation.`;

export async function analyzeSentence(
  sentence: string,
  settings: ApiSettings,
): Promise<AnalysisResult> {
  const url = `${settings.baseUrl.replace(/\/+$/, '')}/v1/chat/completions`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${settings.apiKey}`,
    },
    body: JSON.stringify({
      model: settings.model,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `Analyze this sentence:\n\n${sentence}` },
      ],
      temperature: 0.1,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API request failed (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const content: string = data.choices?.[0]?.message?.content ?? '';

  // Strip potential markdown fences
  const jsonStr = content.replace(/^```(?:json)?\s*/, '').replace(/\s*```$/, '').trim();

  try {
    return JSON.parse(jsonStr) as AnalysisResult;
  } catch {
    throw new Error(`Failed to parse AI response as JSON. Raw response:\n${content.slice(0, 500)}`);
  }
}
