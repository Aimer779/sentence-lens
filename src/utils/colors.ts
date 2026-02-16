import type { GrammarRole } from '../types/analysis';

export const roleColors: Record<GrammarRole, { bg: string; text: string; border: string; label: string }> = {
  subject:     { bg: 'bg-rose-100',    text: 'text-rose-800',    border: 'border-rose-300',    label: '主语' },
  predicate:   { bg: 'bg-emerald-100', text: 'text-emerald-800', border: 'border-emerald-300', label: '谓语' },
  object:      { bg: 'bg-sky-100',     text: 'text-sky-800',     border: 'border-sky-300',     label: '宾语' },
  complement:  { bg: 'bg-teal-100',    text: 'text-teal-800',    border: 'border-teal-300',    label: '补语' },
  attributive: { bg: 'bg-amber-100',   text: 'text-amber-800',   border: 'border-amber-300',   label: '定语' },
  adverbial:   { bg: 'bg-orange-100',  text: 'text-orange-800',  border: 'border-orange-300',  label: '状语' },
  clause:      { bg: 'bg-violet-100',  text: 'text-violet-800',  border: 'border-violet-300',  label: '从句' },
  connector:   { bg: 'bg-stone-100',   text: 'text-stone-600',   border: 'border-stone-300',   label: '连接词' },
  punctuation: { bg: 'bg-transparent', text: 'text-stone-400',   border: 'border-transparent', label: '标点' },
};

export const roleEnglishLabels: Record<GrammarRole, string> = {
  subject: 'Subject',
  predicate: 'Predicate',
  object: 'Object',
  complement: 'Complement',
  attributive: 'Attributive',
  adverbial: 'Adverbial',
  clause: 'Clause',
  connector: 'Connector',
  punctuation: 'Punctuation',
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
