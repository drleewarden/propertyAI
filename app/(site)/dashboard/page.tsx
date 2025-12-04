"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Navigation } from "@/components/Navigation";
import Link from "next/link";

interface Report {
  id: string;
  title: string;
  status: string;
  createdAt: string;
}

interface SubscriptionInfo {
  plan: string;
  status: string;
  trialEndDate: string;
  isCancelled: boolean;
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [reports, setReports] = useState<Report[]>([]);
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated") {
      fetchDashboardData();
    }
  }, [status]);

  const fetchDashboardData = async () => {
    try {
      const [reportsRes, subscriptionRes] = await Promise.all([
        fetch("/api/dashboard/reports"),
        fetch("/api/dashboard/subscription"),
      ]);

      if (reportsRes.ok) {
        const data = await reportsRes.json();
        setReports(data);
      }

      if (subscriptionRes.ok) {
        const data = await subscriptionRes.json();
        setSubscription(data);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </>
    );
  }

  const daysRemaining =
    subscription && subscription.trialEndDate
      ? Math.ceil(
          (new Date(subscription.trialEndDate).getTime() - Date.now()) /
            (1000 * 60 * 60 * 24)
        )
      : 0;

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome, {session?.user?.name || session?.user?.email}
          </h1>
          <p className="text-gray-600 mb-8">
            Manage your property analysis reports and subscription
          </p>

          {/* Subscription Status */}
          {subscription && (
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-indigo-600">
                <h3 className="text-sm font-medium text-gray-600 mb-2">Current Plan</h3>
                <p className="text-2xl font-bold text-gray-900 capitalize">
                  {subscription.plan === "free" ? "Free Trial" : "Pro"}
                </p>
              </div>

              {subscription.plan === "free" && (
                <div className="bg-blue-50 rounded-lg p-6 shadow-sm border-l-4 border-blue-500">
                  <h3 className="text-sm font-medium text-gray-600 mb-2">
                    Trial Days Remaining
                  </h3>
                  <p className="text-2xl font-bold text-blue-600">
                    {daysRemaining > 0 ? daysRemaining : "Expired"}
                  </p>
                  {daysRemaining <= 7 && daysRemaining > 0 && (
                    <p className="text-xs text-blue-600 mt-2">
                      Upgrade soon to avoid losing access
                    </p>
                  )}
                </div>
              )}

              <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-green-600">
                <h3 className="text-sm font-medium text-gray-600 mb-2">
                  Status
                </h3>
                <p className="text-2xl font-bold text-green-600 capitalize">
                  {subscription.isCancelled ? "Cancelled" : "Active"}
                </p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4 mb-8">
            <Link
              href="/questions"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition"
            >
              New Property Analysis
            </Link>
            {subscription?.plan === "free" && !subscription?.isCancelled && (
              <Link
                href="/pricing"
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition"
              >
                Upgrade to Pro
              </Link>
            )}
          </div>

          {/* Reports List */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                Your Reports ({reports.length})
              </h2>
            </div>

            {reports.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <p className="text-gray-600 mb-4">No reports yet</p>
                <Link
                  href="/questions"
                  className="text-indigo-600 hover:text-indigo-700 font-semibold"
                >
                  Create your first report →
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {reports.map((report) => (
                  <div
                    key={report.id}
                    className="px-6 py-4 flex items-center justify-between hover:bg-gray-50"
                  >
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {report.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {new Date(report.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
                        report.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}>
                        {report.status}
                      </span>
                      <Link
                        href={`/report/${report.id}`}
                        className="text-indigo-600 hover:text-indigo-700 font-semibold"
                      >
                        View →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
