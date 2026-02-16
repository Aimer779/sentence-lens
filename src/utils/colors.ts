import type { GrammarRole } from '../types/analysis';

export const roleColors: Record<GrammarRole, { bg: string; text: string; border: string; label: string }> = {
  subject:     { bg: 'bg-red-100',    text: 'text-red-800',    border: 'border-red-300',    label: '主语' },
  predicate:   { bg: 'bg-green-100',  text: 'text-green-800',  border: 'border-green-300',  label: '谓语' },
  object:      { bg: 'bg-blue-100',   text: 'text-blue-800',   border: 'border-blue-300',   label: '宾语' },
  complement:  { bg: 'bg-cyan-100',   text: 'text-cyan-800',   border: 'border-cyan-300',   label: '补语' },
  attributive: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-300', label: '定语' },
  adverbial:   { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-300', label: '状语' },
  clause:      { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-300', label: '从句' },
  connector:   { bg: 'bg-gray-100',   text: 'text-gray-600',   border: 'border-gray-300',   label: '连接词' },
  punctuation: { bg: 'bg-transparent',text: 'text-gray-400',   border: 'border-transparent', label: '标点' },
};

export const posLabels: Record<string, string> = {
  noun: '名词',
  verb: '动词',
  adjective: '形容词',
  adverb: '副词',
  preposition: '介词',
  conjunction: '连词',
  pronoun: '代词',
  determiner: '限定词',
  auxiliary: '助动词',
  modal: '情态动词',
  infinitive: '不定式',
  participle: '分词',
  interjection: '感叹词',
  punctuation: '标点',
};
