export type FaqSuggestion = { id: string; title: string };
export type FaqReply = { answer: string; suggestions: FaqSuggestion[] };

export function getFaqSuggestions(lang?: string): FaqSuggestion[];
export function answerQuestion(message: unknown, lang?: string): FaqReply;
