import http from "./http";
export const fixGrammar = (text: string) => http.post("/ai/grammar", { text });
export const vocabAssist = (text: string, limit = 6) =>
  http.post("/ai/vocab", { text, limit });

export type ExType = "vocab_mcq" | "grammar_mcq" | "cloze" | "reorder";
export const generateExercises = (params: {
  topic?: string;
  level?: "A1" | "A2" | "B1" | "B2" | "C1";
  types?: ExType[];
  n?: number;
}) => http.post("/ai/exercise", params);
export const smartTranslate = (params: {
  text: string;
  target_lang?: "vi" | "en" | "ja" | "ko" | "zh" | "fr" | "de";
}) => http.post("/ai/translate", params);