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
  property: {
    address: string;
  } | null;
}

interface Subscription {
  plan: string;
  status: string;
  trialEndDate: string;
  isCancelled: boolean;
  currentPeriodEnd: string | null;
}

interface UserProfile {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  createdAt: string;
  updatedAt: string;
  parentId: string | null;
  _count: {
    reports: number;
    properties: number;
  };
  subscription: Subscription | null;
  reports: Report[];
}

export default function Profile() {
  const { status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated") {
      fetchProfile();
    }
  }, [status]);

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/profile");
      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }
      const data = await response.json();
      setProfile(data);
    } catch (err) {
      console.error("Failed to fetch profile:", err);
      setError("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </>
    );
  }

  if (error || !profile) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-red-600">{error || "Profile not found"}</p>
        </div>
      </>
    );
  }

  const memberSince = new Date(profile.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const daysRemaining =
    profile.subscription && profile.subscription.trialEndDate
      ? Math.ceil(
          (new Date(profile.subscription.trialEndDate).getTime() - Date.now()) /
            (1000 * 60 * 60 * 24)
        )
      : 0;

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Profile Header */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0">
                {profile.image ? (
                  <img
                    src={profile.image}
                    alt={profile.name || "User"}
                    className="w-24 h-24 rounded-full border-4 border-indigo-100"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-indigo-600 flex items-center justify-center">
                    <span className="text-3xl font-bold text-white">
                      {profile.name?.charAt(0).toUpperCase() ||
                        profile.email?.charAt(0).toUpperCase() ||
                        "U"}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex-grow">
                <h1 className="text-3xl font-bold text-gray-900 mb-1">
                  {profile.name || "User"}
                </h1>
                <p className="text-gray-600 mb-4">{profile.email}</p>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span>Member since {memberSince}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <span>{profile._count.reports} reports created</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                    <span>{profile._count.properties} properties tracked</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Subscription Info */}
          {profile.subscription && (
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-indigo-600">
                <h3 className="text-sm font-medium text-gray-600 mb-2">
                  Current Plan
                </h3>
                <p className="text-2xl font-bold text-gray-900 capitalize">
                  {profile.subscription.plan === "free" ? "Free Trial" : "Pro"}
                </p>
              </div>

              {profile.subscription.plan === "free" && (
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
                  Subscription Status
                </h3>
                <p className="text-2xl font-bold text-green-600 capitalize">
                  {profile.subscription.isCancelled ? "Cancelled" : "Active"}
                </p>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-4 mb-8">
            <Link
              href="/questions"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition"
            >
              Create New Report
            </Link>
            <Link
              href="/dashboard"
              className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 font-semibold py-3 px-6 rounded-lg transition"
            >
              View Dashboard
            </Link>
            {profile.subscription?.plan === "free" &&
              !profile.subscription?.isCancelled && (
                <Link
                  href="/pricing"
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition"
                >
                  Upgrade to Pro
                </Link>
              )}
          </div>

          {/* Recent Reports */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                Recent Reports ({profile.reports.length})
              </h2>
            </div>

            {profile.reports.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <svg
                  className="w-16 h-16 text-gray-300 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <p className="text-gray-600 mb-4">No reports yet</p>
                <Link
                  href="/questions"
                  className="text-indigo-600 hover:text-indigo-700 font-semibold"
                >
                  Create your first report
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {profile.reports.map((report) => (
                  <div
                    key={report.id}
                    className="px-6 py-4 hover:bg-gray-50 transition"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-grow">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {report.title}
                        </h3>
                        {report.property && (
                          <p className="text-sm text-gray-600 mb-2">
                            {report.property.address}
                          </p>
                        )}
                        <p className="text-xs text-gray-500">
                          Created{" "}
                          {new Date(report.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-4 ml-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium capitalize whitespace-nowrap ${
                            report.status === "completed"
                              ? "bg-green-100 text-green-700"
                              : report.status === "archived"
                              ? "bg-gray-100 text-gray-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {report.status}
                        </span>
                        <Link
                          href={`/report/${report.id}`}
                          className="text-indigo-600 hover:text-indigo-700 font-semibold whitespace-nowrap"
                        >
                          View
                        </Link>
                      </div>
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
