"use client";

import type React from "react";

import { useState } from "react";
import AIGrammarBox from "../components/AiBox";
import AITranslateBox from "../components/AITranslateBox";

type TabKey = "grammar" | "translate";

export default function AIPage() {
  const [tab, setTab] = useState<TabKey>("grammar");

  const Tab = (
    v: TabKey,
    label: string,
    icon: React.ReactNode,
    description: string
  ) => (
    <button
      onClick={() => setTab(v)}
      className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 transform hover:scale-[1.02] ${
        tab === v
          ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white border-blue-500 shadow-xl shadow-blue-500/25"
          : "bg-white/80 backdrop-blur-sm text-gray-700 border-gray-200/60 hover:bg-white hover:border-blue-200 hover:shadow-lg"
      }`}
    >
      {/* Gradient overlay for active state */}
      {tab === v && (
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 animate-pulse" />
      )}

      <div className="relative p-6 text-left">
        <div className="flex items-center space-x-4 mb-3">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
              tab === v
                ? "bg-white/20 backdrop-blur-sm"
                : "bg-gradient-to-r from-blue-100 to-purple-100 group-hover:from-blue-200 group-hover:to-purple-200"
            }`}
          >
            <div
              className={`w-6 h-6 ${
                tab === v ? "text-white" : "text-blue-600"
              }`}
            >
              {icon}
            </div>
          </div>
          <div>
            <h3
              className={`font-bold text-lg ${
                tab === v
                  ? "text-white"
                  : "text-gray-900 group-hover:text-blue-900"
              }`}
            >
              {label}
            </h3>
            <p
              className={`text-sm ${
                tab === v
                  ? "text-white/80"
                  : "text-gray-500 group-hover:text-gray-600"
              }`}
            >
              {description}
            </p>
          </div>
        </div>

        {/* Active indicator */}
        {tab === v && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/30 rounded-full">
            <div className="h-full bg-white rounded-full animate-pulse" />
          </div>
        )}
      </div>
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center space-x-3 px-6 py-3 bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200/60 shadow-sm">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI English Tools
              </h1>
              <p className="text-gray-600 text-sm">
                Công cụ AI hỗ trợ học tiếng Anh thông minh
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="grid md:grid-cols-2 gap-6">
          {Tab(
            "grammar",
            "Sửa ngữ pháp",
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>,
            "Kiểm tra và sửa lỗi ngữ pháp"
          )}

          {Tab(
            "translate",
            "Dịch thuật",
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
              />
            </svg>,
            "Dịch văn bản thông minh"
          )}
        </div>

        {/* Content Area */}
        <div className="relative">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 shadow-xl overflow-hidden">
            {/* Content Header */}
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 px-8 py-6 border-b border-gray-200/60">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                  {tab === "grammar" && (
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  )}
                  {tab === "translate" && (
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                      />
                    </svg>
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {tab === "grammar" && "Kiểm tra ngữ pháp"}
                    {tab === "translate" && "Dịch thuật AI"}
                  </h2>
                  <p className="text-gray-600">
                    {tab === "grammar" &&
                      "Nhập văn bản để kiểm tra và sửa lỗi ngữ pháp"}
                    {tab === "translate" && "Dịch văn bản với độ chính xác cao"}
                  </p>
                </div>
              </div>
            </div>

            {/* Tool Content */}
            <div className="p-8">
              {tab === "grammar" && <AIGrammarBox />}
              {tab === "translate" && <AITranslateBox />}
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200/60 p-6 hover:shadow-lg transition-all duration-300 group">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Nhanh chóng</h3>
            <p className="text-gray-600 text-sm">
              Xử lý và phản hồi trong vài giây
            </p>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200/60 p-6 hover:shadow-lg transition-all duration-300 group">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Chính xác</h3>
            <p className="text-gray-600 text-sm">
              Độ chính xác cao với AI tiên tiến
            </p>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200/60 p-6 hover:shadow-lg transition-all duration-300 group">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
              <svg
                className="w-6 h-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
                />
              </svg>
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Tùy chỉnh</h3>
            <p className="text-gray-600 text-sm">
              Điều chỉnh theo nhu cầu học tập
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
