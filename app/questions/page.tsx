"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Navigation } from "@/components/Navigation";

interface Question {
  id: string;
  question: string;
  type: string;
  category: string;
  required: boolean;
  options?: string[];
}

export default function QuestionsPage() {
  const { status } = useSession();
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [canCreateReport, setCanCreateReport] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated") {
      fetchQuestions();
      checkSubscription();
    }
  }, [status]);

  const fetchQuestions = async () => {
    try {
      const response = await fetch("/api/questions");
      if (response.ok) {
        const data = await response.json();
        setQuestions(data);
      }
    } catch (err) {
      setError("Failed to load questions");
    } finally {
      setLoading(false);
    }
  };

  const checkSubscription = async () => {
    try {
      const response = await fetch("/api/subscription/check");
      if (response.ok) {
        const data = await response.json();
        setCanCreateReport(data.canCreateReport);
      } else {
        setCanCreateReport(false);
      }
    } catch (err) {
      console.error("Failed to check subscription:", err);
    }
  };

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers({
      ...answers,
      [questionId]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!canCreateReport) {
      setError("Your free trial has expired. Please upgrade to Pro to continue.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/reports/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });

      if (response.ok) {
        const data = await response.json();
        router.push(`/report/${data.reportId}`);
      } else {
        const data = await response.json();
        setError(data.error || "Failed to create report");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Property Analysis</h1>
          <p className="text-gray-600 mb-8">
            Answer the following questions to get a comprehensive AI-powered property analysis report.
          </p>

          {!canCreateReport && (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded mb-6">
              Your free trial has expired. Please upgrade to Pro to continue analyzing properties.
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {questions.length === 0 ? (
              <div className="bg-white rounded-lg p-8 text-center">
                <p className="text-gray-600 mb-4">No questions available yet.</p>
                <p className="text-gray-500 text-sm">
                  Questions will be loaded from the database soon.
                </p>
              </div>
            ) : (
              <>
                {questions.map((question) => (
                  <div
                    key={question.id}
                    className="bg-white rounded-lg p-6 shadow-sm"
                  >
                    <label className="block text-lg font-semibold text-gray-900 mb-2">
                      {question.question}
                      {question.required && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </label>
                    <p className="text-sm text-gray-500 mb-4 capitalize">
                      {question.category}
                    </p>

                    {question.type === "text" && (
                      <input
                        type="text"
                        required={question.required}
                        value={answers[question.id] || ""}
                        onChange={(e) =>
                          handleAnswerChange(question.id, e.target.value)
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Enter your answer..."
                      />
                    )}

                    {question.type === "number" && (
                      <input
                        type="number"
                        required={question.required}
                        value={answers[question.id] || ""}
                        onChange={(e) =>
                          handleAnswerChange(question.id, e.target.value)
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Enter a number..."
                      />
                    )}

                    {question.type === "textarea" && (
                      <textarea
                        required={question.required}
                        value={answers[question.id] || ""}
                        onChange={(e) =>
                          handleAnswerChange(question.id, e.target.value)
                        }
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Enter your answer..."
                      />
                    )}

                    {question.type === "select" && question.options && (
                      <select
                        required={question.required}
                        value={answers[question.id] || ""}
                        onChange={(e) =>
                          handleAnswerChange(question.id, e.target.value)
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      >
                        <option value="">Select an option...</option>
                        {question.options.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                ))}

                <button
                  type="submit"
                  disabled={submitting || !canCreateReport}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold py-3 px-4 rounded-lg transition"
                >
                  {submitting ? "Generating Report..." : "Generate AI Report"}
                </button>
              </>
            )}
          </form>
        </div>
      </main>
    </>
  );
}
