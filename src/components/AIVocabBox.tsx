import { useState } from "react";
import { vocabAssist } from "../api/ai";

type VocabItem = {
  word: string;
  pos?: string;
  meaning_vi: string;
  cefr?: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
  example_en: string;
  example_vi?: string;
  synonyms?: string[];
  collocations?: string[];
};

type QuizQ = {
  q: string;
  choices: string[];
  answerIndex: number;
  explain_vi: string;
};

export default function AIVocabBox() {
  const [input, setInput] = useState("");
  const [limit, setLimit] = useState(6);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [corrected, setCorrected] = useState<string>("");
  const [vocab, setVocab] = useState<VocabItem[]>([]);
  const [quiz, setQuiz] = useState<QuizQ[]>([]);
  const [answers, setAnswers] = useState<number[]>([]);

  const run = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setErr(null);
    try {
      const { data } = await vocabAssist(input, limit);
      setCorrected(data.corrected || input);
      setVocab(data.vocab || []);
      setQuiz(data.quiz?.questions || []);
      setAnswers(Array((data.quiz?.questions || []).length).fill(-1));
    } catch (e: any) {
      setErr(e?.response?.data?.msg || "Có lỗi xảy ra, thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl bg-white p-4 shadow space-y-3">
      <div className="font-semibold">🧠 Từ vựng thông minh & Quiz</div>

      <textarea
        className="w-full min-h-[120px] rounded border px-3 py-2"
        placeholder="Dán câu/đoạn tiếng Anh để phân tích..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <div className="flex items-center gap-3">
        <label className="text-sm text-gray-600">
          Số mục từ vựng:
          <input
            type="number"
            className="ml-2 w-16 rounded border px-2 py-1"
            min={3}
            max={12}
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
          />
        </label>

        <button
          onClick={run}
          className="rounded bg-indigo-600 px-3 py-1.5 text-white hover:bg-indigo-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Đang xử lý..." : "Phân tích ngay"}
        </button>
      </div>

      {err && (
        <div className="rounded border border-red-200 bg-red-50 p-3 text-red-700 text-sm">
          {err}
        </div>
      )}

      {!!corrected && (
        <div className="rounded border p-3">
          <div className="font-medium">✅ Bản sửa gợi ý:</div>
          <div className="text-gray-800">{corrected}</div>
        </div>
      )}

      {vocab.length > 0 && (
        <div className="rounded border p-3 space-y-2">
          <div className="font-medium">📚 Từ vựng trọng tâm</div>
          <ul className="grid md:grid-cols-2 gap-3">
            {vocab.map((v, i) => (
              <li key={i} className="rounded-lg border p-3">
                <div className="flex items-baseline gap-2">
                  <span className="font-semibold">{v.word}</span>
                  {v.pos && (
                    <span className="text-xs text-gray-500">({v.pos})</span>
                  )}
                  {v.cefr && (
                    <span className="ml-auto text-xs rounded bg-gray-100 px-2 py-0.5">
                      {v.cefr}
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-700 mt-1">{v.meaning_vi}</div>
                <div className="text-sm mt-2">
                  <div className="text-gray-700">• {v.example_en}</div>
                  {v.example_vi && (
                    <div className="text-gray-500">→ {v.example_vi}</div>
                  )}
                </div>
                {v.synonyms?.length ? (
                  <div className="text-xs text-gray-600 mt-2">
                    Đồng nghĩa: {v.synonyms.join(", ")}
                  </div>
                ) : null}
                {v.collocations?.length ? (
                  <div className="text-xs text-gray-600 mt-1">
                    Collocations: {v.collocations.join(" • ")}
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      )}

      {quiz.length > 0 && (
        <div className="rounded border p-3 space-y-3">
          <div className="font-medium">📝 Quiz nhanh</div>
          {quiz.map((q, qi) => (
            <div key={qi} className="rounded border p-3">
              <div className="font-medium">
                {qi + 1}. {q.q}
              </div>
              <div className="mt-2 grid gap-2">
                {q.choices.map((c, ci) => {
                  const chosen = answers[qi] === ci;
                  const isAnswered = answers[qi] !== -1;
                  const isCorrect = isAnswered && ci === q.answerIndex;
                  const isWrongChosen =
                    isAnswered && chosen && ci !== q.answerIndex;

                  return (
                    <button
                      key={ci}
                      onClick={() =>
                        setAnswers((prev) => {
                          const copy = [...prev];
                          copy[qi] = ci;
                          return copy;
                        })
                      }
                      className={[
                        "text-left rounded border px-3 py-2",
                        chosen ? "border-indigo-600" : "border-gray-200",
                        isCorrect ? "bg-green-50" : "",
                        isWrongChosen ? "bg-red-50" : "",
                      ].join(" ")}
                    >
                      {String.fromCharCode(65 + ci)}. {c}
                    </button>
                  );
                })}
              </div>
              {answers[qi] !== -1 && (
                <div className="mt-2 text-sm text-gray-600">
                  Đáp án đúng: {String.fromCharCode(65 + q.answerIndex)}.{" "}
                  {q.explain_vi}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
