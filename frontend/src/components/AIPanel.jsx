/*
 * ============================================
 * AI PANEL - AI Features Component
 * ============================================
 * 
 * This component provides AI-powered code features:
 * - Code suggestions
 * - Code review
 * - Code explanation
 * - Bug fixing
 * 
 * Props:
 * - code: Current code in editor
 * - language: Programming language
 */

import { useState } from "react";
import { Sparkles, FileSearch, HelpCircle, Wrench } from "lucide-react";
import Button from "./Button";
import * as api from "../utils/api";

const AIPanel = ({ code, language }) => {
  // ============================================
  // STATE
  // ============================================

  // Active tab ('suggest', 'review', 'explain', 'fix')
  const [activeTab, setActiveTab] = useState("suggest");

  // AI response
  const [aiResponse, setAiResponse] = useState("");

  // Loading state
  const [loading, setLoading] = useState(false);

  // Additional context for suggestions
  const [context, setContext] = useState("");

  // Issue description for bug fixing
  const [issue, setIssue] = useState("");

  // ============================================
  // GET AI SUGGESTIONS
  // ============================================

  const handleGetSuggestions = async () => {
    if (!code.trim()) {
      alert("Please write some code first!");
      return;
    }

    setLoading(true);
    try {
      const response = await api.getCodeSuggestions({
        code,
        language,
        context,
      });
      setAiResponse(response.suggestion);
    } catch (error) {
      setAiResponse("Error: " + (error.message || "Failed to get suggestions"));
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // GET CODE REVIEW
  // ============================================

  const handleReviewCode = async () => {
    if (!code.trim()) {
      alert("Please write some code first!");
      return;
    }

    setLoading(true);
    try {
      const response = await api.reviewCode({ code, language });
      setAiResponse(response.review);
    } catch (error) {
      setAiResponse("Error: " + (error.message || "Failed to review code"));
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // EXPLAIN CODE
  // ============================================

  const handleExplainCode = async () => {
    if (!code.trim()) {
      alert("Please write some code first!");
      return;
    }

    setLoading(true);
    try {
      const response = await api.explainCode({ code, language });
      setAiResponse(response.explain);
    } catch (error) {
      setAiResponse("Error: " + (error.message || "Failed to explain code"));
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // FIX CODE
  // ============================================

  const handleFixCode = async () => {
    if (!code.trim()) {
      alert("Please write some code first!");
      return;
    }

    setLoading(true);
    try {
      const response = await api.fixCode({ code, language, issue });
      setAiResponse(response.fixedCode);
    } catch (error) {
      setAiResponse("Error: " + (error.message || "Failed to fix code"));
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // TABS CONFIGURATION
  // ============================================

  const tabs = [
    { id: "suggest", label: "Suggest", icon: Sparkles },
    { id: "review", label: "Review", icon: FileSearch },
    { id: "explain", label: "Explain", icon: HelpCircle },
    { id: "fix", label: "Fix", icon: Wrench },
  ];

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="bg-white rounded-lg shadow-md p-4 h-full flex flex-col">
      {/* ============================================
          HEADER
          ============================================ */}
      <h3 className="font-semibold text-lg mb-4">AI Assistant</h3>

      {/* ============================================
          TABS
          ============================================ */}
      <div className="flex flex-wrap gap-1 mb-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setAiResponse("");
              }}
              className={`flex items-center gap-1 px-2 py-1.5 rounded-lg transition-colors text-xs ${activeTab === tab.id
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ============================================
          TAB CONTENT
          ============================================ */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* ============================================
            AI RESPONSE (Show at top if exists)
            ============================================ */}
        {aiResponse && (
          <div className="mb-4 flex-shrink-0" style={{ maxHeight: '300px' }}>
            <div className="bg-gray-50 rounded-lg p-4 h-full overflow-y-auto border border-gray-200">
              <h4 className="font-semibold mb-2 text-green-600">✨ AI Response:</h4>
              <pre className="text-sm whitespace-pre-wrap text-gray-800">{aiResponse}</pre>
            </div>
          </div>
        )}

        {/* ============================================
            INPUT FORMS (Below response)
            ============================================ */}
        <div className="flex-shrink-0">
          {/* SUGGEST TAB */}
          {activeTab === "suggest" && (
            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                Get AI-powered code suggestions and completions
              </p>
              <textarea
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="Optional: Add context (e.g., 'create a function to...')"
                className="w-full px-3 py-2 border rounded-lg resize-none"
                rows="2"
              />
              <Button onClick={handleGetSuggestions} disabled={loading} className="w-full bg-green-400">
                {loading ? "Suggesting..." : "Get Suggestions"}
              </Button>
            </div>
          )}

          {/* REVIEW TAB */}
          {activeTab === "review" && (
            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                Get a comprehensive code review with suggestions
              </p>
              <Button onClick={handleReviewCode} disabled={loading} className="w-full bg-green-400">
                {loading ? "Reviewing..." : "Review Code"}
              </Button>
            </div>
          )}

          {/* EXPLAIN TAB */}
          {activeTab === "explain" && (
            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                Get a detailed explanation of your code
              </p>
              <Button onClick={handleExplainCode} disabled={loading} className="w-full bg-green-400">
                {loading ? "Explaining..." : "Explain Code"}
              </Button>
            </div>
          )}

          {/* FIX TAB */}
          {activeTab === "fix" && (
            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                Let AI fix bugs and issues in your code
              </p>
              <textarea
                value={issue}
                onChange={(e) => setIssue(e.target.value)}
                placeholder="Optional: Describe the issue (e.g., 'function returns undefined')"
                className="w-full px-3 py-2 border rounded-lg resize-none"
                rows="2"
              />
              <Button onClick={handleFixCode} disabled={loading} className="w-full bg-green-400">
                {loading ? "Fixing..." : "Fix Bug"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIPanel;
