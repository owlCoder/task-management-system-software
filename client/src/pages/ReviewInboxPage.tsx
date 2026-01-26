import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/dashboard/sidebar/Sidebar";
import { useAuth } from "../hooks/useAuthHook";

import { ReviewInboxList } from "../components/version/ReviewInboxList";
import { RejectReviewModal } from "../components/version/RejectReviewModal";

import { UserAPI } from "../api/users/UserAPI";
import { TaskAPI } from "../api/task/TaskAPI";

import { useReviewInbox } from "../hooks/useReviewInboxHook";

type ReviewsTab = "REVIEW" | "APPROVED" | "REJECTED" | "ALL";

const tabLabel = (t: ReviewsTab) => {
  switch (t) {
    case "REVIEW":
      return "Inbox";
    case "APPROVED":
      return "Approved";
    case "REJECTED":
      return "Rejected";
    case "ALL":
      return "All";
    default:
      return t;
  }
};

const ReviewInboxPage: React.FC = () => {
  const { token, user } = useAuth();
  if (!token) return null;

  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectTaskId, setRejectTaskId] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  const userApi = useMemo(() => new UserAPI(), []);
  const taskApi = useMemo(() => new TaskAPI(import.meta.env.VITE_GATEWAY_URL, token), [token]);

  const {
    canView,

    tab,
    setTab,
    tabs,

    loading,
    actionLoading,

    items,
    rejectionComments,
    authorNamesById,
    taskTitlesById,

    load,
    approve,
    reject,
  } = useReviewInbox({
    token,
    userRole: user?.role,
    userApi,
    taskApi,
  });

  useEffect(() => {
    if (!canView) return;
    load(tab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canView, tab]);

  const openReject = (taskId: number) => {
    setRejectTaskId(taskId);
    setRejectOpen(true);
  };

  const submitReject = async (commentText: string) => {
    if (!rejectTaskId) return;

    await reject(rejectTaskId, commentText);

    setRejectOpen(false);
    setRejectTaskId(null);
  };

  const showInboxActions = tab === "REVIEW";
  const normalizedSearch = search.trim().toLowerCase();

  const filteredItems = useMemo(() => {
    if (!normalizedSearch) return items;

    return items.filter((item) => {
      const title =
        taskTitlesById[item.taskId] ??
        (item.taskId ? `Task #${item.taskId}` : "");
      return title.toLowerCase().includes(normalizedSearch);
    });
  }, [items, normalizedSearch, taskTitlesById]);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />

      <main className="flex-1 p-6 flex flex-col overflow-hidden">
        <div className="w-full max-w-4xl mx-auto flex flex-col h-full">
          <header className="flex flex-col gap-2 mb-6 flex-shrink-0">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">
              Reviews
            </h1>
            <p className="text-sm text-white/50">
              Inbox, approvals, rejections, and full review history.
            </p>

            <div className="flex flex-col gap-3 mt-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap gap-2">
                {tabs.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`
                      px-4 py-2 rounded-xl text-sm font-semibold border transition
                      ${
                        tab === t
                          ? "bg-white/10 border-white/20 text-white"
                          : "bg-transparent border-white/10 text-white/60 hover:text-white hover:bg-white/5"
                      }
                    `}
                  >
                    {tabLabel(t)}
                  </button>
                ))}
              </div>

              <div className="w-full sm:w-64">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search tasks..."
                  className="w-full rounded-xl bg-white/10 border border-white/20 px-3 py-2 text-sm text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-blue-500/40"
                />
              </div>
            </div>
          </header>

          <section className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/10 flex-1 overflow-y-auto styled-scrollbar">
            {!canView ? (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-sm text-red-200">
                You don’t have permission to view this page.
              </div>
            ) : loading ? (
              <div className="text-white/60">Loading reviews...</div>
            ) : (
              <ReviewInboxList
                items={filteredItems}
                onApprove={showInboxActions ? approve : undefined}
                onReject={showInboxActions ? openReject : undefined}
                rejectionComments={rejectionComments}
                disabled={actionLoading}
                authorNamesById={authorNamesById}
                taskTitlesById={taskTitlesById}
              />
            )}
          </section>
        </div>
      </main>

      <RejectReviewModal
        open={rejectOpen}
        taskId={rejectTaskId}
        loading={actionLoading}
        onClose={() => {
          setRejectOpen(false);
          setRejectTaskId(null);
        }}
        onSubmit={submitReject}
      />
    </div>
  );
};

export default ReviewInboxPage;
