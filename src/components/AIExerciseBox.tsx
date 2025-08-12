"use client";

import { useState } from "react";
import { type ExType, generateExercises } from "../api/ai";
import {
  BookOpen,
  Brain,
  CheckCircle2,
  XCircle,
  Lightbulb,
  RotateCcw,
  Send,
  Loader2,
  Target,
  Hash,
  Settings,
} from "lucide-react";

type Exercise = {
  id: string;
  type: ExType;
  prompt: string;
  passage?: string;
  choices?: string[];
  answerIndex?: number;
  answerText?: string;
  explanation_vi?: string;
};

type ResponseState = {
  value: number | string | null; // MCQ: index (0..3), Cloze/Reorder: text
  revealed: boolean; // đã lộ đáp án chưa
};

const exerciseTypeLabels = {
  vocab_mcq: {
    label: "Từ vựng (MCQ)",
    icon: "📚",
    color: "from-blue-500 to-blue-600",
  },
  grammar_mcq: {
    label: "Ngữ pháp (MCQ)",
    icon: "📝",
    color: "from-green-500 to-green-600",
  },
  cloze: {
    label: "Điền từ (Cloze)",
    icon: "✏️",
    color: "from-purple-500 to-purple-600",
  },
  reorder: {
    label: "Sắp xếp câu",
    icon: "🔄",
    color: "from-orange-500 to-orange-600",
  },
};

export default function AIExerciseBox() {
  const [topic, setTopic] = useState("daily routines");
  const [level, setLevel] = useState<"A1" | "A2" | "B1" | "B2" | "C1">("A2");
  const [n, setN] = useState(6);
  const [types, setTypes] = useState<ExType[]>([
    "vocab_mcq",
    "grammar_mcq",
    "cloze",
  ]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [list, setList] = useState<Exercise[]>([]);
  // NEW: trạng thái trả lời cho từng bài tập
  const [responses, setResponses] = useState<ResponseState[]>([]);

  const toggleType = (t: ExType) =>
    setTypes((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
    );

  const run = async () => {
    if (types.length === 0) {
      setErr("Chọn ít nhất 1 loại bài tập");
      return;
    }
    setLoading(true);
    setErr(null);
    try {
      const response = await generateExercises({ topic, level, types, n });
      const items: Exercise[] = response.data.exercises || [];
      setList(items);
      // reset responses tương ứng số bài tập
      setResponses(items.map(() => ({ value: null, revealed: false })));
    } catch (e: any) {
      console.error("Error generating exercises:", e);
      setErr(e?.response?.data?.msg || "Không tạo được bài tập, thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  const isMCQ = (t: ExType) => t === "vocab_mcq" || t === "grammar_mcq";

  const chooseMCQ = (i: number, choiceIndex: number) => {
    setResponses((prev) => {
      const copy = [...prev];
      copy[i] = { value: choiceIndex, revealed: true };
      return copy;
    });
  };

  const setTextAnswer = (i: number, text: string) => {
    setResponses((prev) => {
      const copy = [...prev];
      copy[i] = { ...copy[i], value: text };
      return copy;
    });
  };

  const revealTextAnswer = (i: number) => {
    setResponses((prev) => {
      const copy = [...prev];
      copy[i] = { ...copy[i], revealed: true };
      return copy;
    });
  };

  // (Tùy chọn) Nộp tất cả — lộ hết đáp án
  const revealAll = () => {
    setResponses((prev) => prev.map((r) => ({ ...r, revealed: true })));
  };

  // (Tùy chọn) Reset làm bài giữ nguyên đề
  const resetAnswers = () => {
    setResponses(list.map(() => ({ value: null, revealed: false })));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 p-6">
      {/* Header Section */}
      <div className="text-center space-y-6">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full shadow-lg">
          <Brain className="w-10 h-10 text-white" />
        </div>
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            AI English Exercise Generator
          </h1>
          <p className="text-lg text-gray-600">
            Tạo bài tập tiếng Anh thông minh với AI
          </p>
        </div>
      </div>

      {/* Configuration Card */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-8 py-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-3">
            <Settings className="w-6 h-6 text-blue-600" />
            Cấu hình bài tập
          </h2>
        </div>

        <div className="p-8 space-y-8">
          {/* Form Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Topic Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Target className="w-4 h-4 text-blue-500" />
                Chủ đề
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="travel, food, technology..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
              />
            </div>

            {/* Level Select */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-green-500" />
                Mức độ (CEFR)
              </label>
              <select
                value={level}
                onChange={(e) =>
                  setLevel(e.target.value as "A1" | "A2" | "B1" | "B2" | "C1")
                }
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
              >
                <option value="A1">A1 - Cơ bản</option>
                <option value="A2">A2 - Sơ cấp</option>
                <option value="B1">B1 - Trung cấp</option>
                <option value="B2">B2 - Trung cấp cao</option>
                <option value="C1">C1 - Nâng cao</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Hash className="w-4 h-4 text-purple-500" />
                Số câu hỏi
              </label>
              <input
                type="number"
                min={3}
                max={12}
                value={n}
                onChange={(e) =>
                  setN(Math.min(12, Math.max(3, Number(e.target.value))))
                }
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-sm font-medium text-gray-700">
              Loại bài tập
            </label>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {(
                Object.entries(exerciseTypeLabels) as [
                  ExType,
                  (typeof exerciseTypeLabels)[ExType]
                ][]
              ).map(([val, config]) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => toggleType(val)}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                    types.includes(val)
                      ? `bg-gradient-to-r ${config.color} text-white border-transparent shadow-lg`
                      : "bg-white border-gray-200 hover:border-gray-300 hover:shadow-md"
                  }`}
                >
                  <div className="text-center space-y-2">
                    <div className="text-2xl">{config.icon}</div>
                    <div className="text-sm font-medium">{config.label}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-gray-100">
            <button
              onClick={run}
              disabled={loading}
              className="flex items-center gap-3 px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Đang tạo bài tập...
                </>
              ) : (
                <>
                  <Brain className="w-5 h-5" />
                  Tạo bài tập
                </>
              )}
            </button>

            {list.length > 0 && (
              <>
                <button
                  onClick={resetAnswers}
                  className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset trả lời
                </button>
                <button
                  onClick={revealAll}
                  className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
                >
                  <Send className="w-4 h-4" />
                  Nộp tất cả
                </button>
              </>
            )}
          </div>

          {err && (
            <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
              <XCircle className="w-5 h-5 text-red-500" />
              <span>{err}</span>
            </div>
          )}
        </div>
      </div>

      {list.length > 0 && (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-green-50 to-blue-50 px-8 py-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
                Kết quả ({list.length} bài tập)
              </h2>
              <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {list.length} câu
              </div>
            </div>
          </div>

          <div className="p-8 space-y-6">
            {list.map((ex, i) => {
              const resp = responses[i] || { value: null, revealed: false };
              const reveal = resp.revealed;
              const typeConfig = exerciseTypeLabels[ex.type];

              return (
                <div
                  key={ex.id || i}
                  className="bg-gray-50 rounded-2xl border-l-4 border-l-blue-500 overflow-hidden"
                >
                  <div className="p-6 space-y-4">
                    {/* Exercise Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="px-2 py-1 bg-gray-200 text-gray-700 rounded-lg text-xs font-medium">
                          #{i + 1}
                        </div>
                        <div
                          className={`px-3 py-1 bg-gradient-to-r ${typeConfig.color} text-white rounded-lg text-xs font-medium flex items-center gap-2`}
                        >
                          <span>{typeConfig.icon}</span>
                          <span>{ex.type}</span>
                        </div>
                      </div>
                    </div>

                    <h3 className="text-lg font-medium text-gray-800 leading-relaxed">
                      {ex.prompt}
                    </h3>

                    {ex.passage && (
                      <div className="p-4 bg-white rounded-xl border-l-4 border-l-gray-300 shadow-sm">
                        <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">
                          {ex.passage}
                        </p>
                      </div>
                    )}

                    {isMCQ(ex.type) && ex.choices && ex.choices.length > 0 && (
                      <div className="space-y-3">
                        {ex.choices.map((c, idx) => {
                          const chosen = resp.value === idx;
                          const isCorrect = reveal && idx === ex.answerIndex;
                          const isWrongChosen =
                            reveal && chosen && idx !== ex.answerIndex;

                          return (
                            <button
                              key={idx}
                              onClick={() => chooseMCQ(i, idx)}
                              className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 hover:shadow-md ${
                                chosen
                                  ? "border-blue-500 bg-blue-50"
                                  : "border-gray-200 bg-white hover:border-gray-300"
                              } ${
                                isCorrect ? "border-green-500 bg-green-50" : ""
                              } ${
                                isWrongChosen ? "border-red-500 bg-red-50" : ""
                              }`}
                            >
                              <div className="flex items-center gap-4">
                                <div
                                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold ${
                                    isCorrect
                                      ? "border-green-500 bg-green-500 text-white"
                                      : isWrongChosen
                                      ? "border-red-500 bg-red-500 text-white"
                                      : chosen
                                      ? "border-blue-500 bg-blue-500 text-white"
                                      : "border-gray-300 text-gray-600"
                                  }`}
                                >
                                  {String.fromCharCode(65 + idx)}
                                </div>
                                <span className="flex-1 text-gray-800">
                                  {c}
                                </span>
                                {isCorrect && (
                                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                                )}
                                {isWrongChosen && (
                                  <XCircle className="w-6 h-6 text-red-600" />
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {!isMCQ(ex.type) && (
                      <div className="space-y-3">
                        <div className="flex gap-3">
                          <input
                            type="text"
                            placeholder={
                              ex.type === "cloze"
                                ? "Điền từ/cụm còn thiếu..."
                                : "Sắp xếp — nhập câu hoàn chỉnh"
                            }
                            value={
                              (typeof resp.value === "string"
                                ? resp.value
                                : "") || ""
                            }
                            onChange={(e) => setTextAnswer(i, e.target.value)}
                            className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <button
                            onClick={() => revealTextAnswer(i)}
                            className="px-6 py-3 !bg-blue-500 text-white rounded-xl font-medium hover:!bg-blue-600 transition-all duration-200 flex items-center gap-2"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            Kiểm tra
                          </button>
                        </div>
                      </div>
                    )}

                    {reveal && (
                      <div className="space-y-4 pt-4 border-t border-gray-200">
                        {(ex.answerText !== undefined ||
                          ex.answerIndex !== undefined) && (
                          <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
                            <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                            <div>
                              <div className="font-semibold text-green-800 mb-1">
                                Đáp án:
                              </div>
                              <div className="text-green-700 font-medium">
                                {ex.answerText
                                  ? ex.answerText
                                  : typeof ex.answerIndex === "number"
                                  ? String.fromCharCode(65 + ex.answerIndex)
                                  : "—"}
                              </div>
                            </div>
                          </div>
                        )}

                        {ex.explanation_vi && (
                          <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                            <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5" />
                            <div>
                              <div className="font-semibold text-blue-800 mb-1">
                                💡
                              </div>
                              <div className="text-blue-700">
                                {ex.explanation_vi}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
