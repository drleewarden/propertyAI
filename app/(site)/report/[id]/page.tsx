"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Navigation } from "@/components/Navigation";
import Link from "next/link";

interface Report {
  id: string;
  title: string;
  summary: string;
  analysis: string;
  status: string;
  googleDocUrl: string | null;
  createdAt: string;
}

export default function ReportPage({
  params,
}: {
  params: { id: string };
}) {
  const { status } = useSession();
  const router = useRouter();
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated") {
      fetchReport();
    }
  }, [status]);

  const fetchReport = async () => {
    try {
      const response = await fetch(`/api/reports/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setReport(data);
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Failed to fetch report:", error);
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleExportToGoogleDocs = async () => {
    setExporting(true);
    try {
      const response = await fetch(`/api/reports/${params.id}/export`, {
        method: "POST",
      });

      if (response.ok) {
        const data = await response.json();
        if (data.googleDocUrl) {
          window.open(data.googleDocUrl, "_blank");
        }
      }
    } catch (error) {
      console.error("Failed to export:", error);
    } finally {
      setExporting(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-600">Loading report...</p>
        </div>
      </>
    );
  }

  if (!report) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-600">Report not found</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/dashboard"
            className="text-indigo-600 hover:text-indigo-700 font-semibold mb-6 inline-block"
          >
            ← Back to Dashboard
          </Link>

          <div className="bg-white rounded-lg shadow p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  {report.title}
                </h1>
                <p className="text-gray-600">
                  Created {new Date(report.createdAt).toLocaleDateString()}
                </p>
              </div>
              <span className={`px-4 py-2 rounded-full font-semibold capitalize ${
                report.status === "completed"
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}>
                {report.status}
              </span>
            </div>

            {report.status === "draft" && (
              <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-6">
                <p className="text-blue-700">
                  This report is still being analyzed. Check back soon for results.
                </p>
              </div>
            )}

            {report.summary && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Summary
                </h2>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {report.summary}
                </p>
              </div>
            )}

            {report.analysis && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Detailed Analysis
                </h2>
                <div className="prose prose-lg max-w-none">
                  <div className="text-gray-700 whitespace-pre-wrap">
                    {report.analysis}
                  </div>
                </div>
              </div>
            )}

            {report.status === "completed" && (
              <div className="flex gap-4 mt-8 pt-8 border-t border-gray-200">
                <button
                  onClick={handleExportToGoogleDocs}
                  disabled={exporting}
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold py-3 px-6 rounded-lg transition"
                >
                  {exporting ? "Exporting..." : "Export to Google Docs"}
                </button>

                {report.googleDocUrl && (
                  <a
                    href={report.googleDocUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-3 px-6 rounded-lg transition"
                  >
                    Open in Google Docs
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
