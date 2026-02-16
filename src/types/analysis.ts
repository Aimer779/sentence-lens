export type PartOfSpeech =
  | 'noun'
  | 'verb'
  | 'adjective'
  | 'adverb'
  | 'preposition'
  | 'conjunction'
  | 'pronoun'
  | 'determiner'
  | 'auxiliary'
  | 'modal'
  | 'infinitive'
  | 'participle'
  | 'interjection'
  | 'punctuation';

export type GrammarRole =
  | 'subject'
  | 'predicate'
  | 'object'
  | 'complement'
  | 'attributive'
  | 'adverbial'
  | 'clause'
  | 'connector'
  | 'punctuation';

export interface TokenAnnotation {
  text: string;
  pos: PartOfSpeech;
  role: GrammarRole;
  meaning: string;
}

export interface ClauseNode {
  label: string;
  type: 'sentence' | 'main_clause' | 'subordinate_clause' | 'phrase' | 'component';
  role?: GrammarRole;
  text: string;
  translation?: string;
  children?: ClauseNode[];
}

export interface SentencePattern {
  name: string;
  description: string;
}

export interface AnalysisResult {
  originalSentence: string;
  tokens: TokenAnnotation[];
  tree: ClauseNode;
  fullTranslation: string;
  patterns: SentencePattern[];
}

export interface ApiSettings {
  apiKey: string;
  baseUrl: string;
  model: string;
}
