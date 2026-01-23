import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/dashboard/sidebar/Sidebar";
import { useAuth } from "../hooks/useAuthHook";
import toast from "react-hot-toast";

import { ReviewInboxList } from "../components/version/ReviewInboxList";
import { RejectReviewModal } from "../components/version/RejectReviewModal";

import { VersionControlAPI } from "../api/version/VersionControlAPI";
import { TaskReviewDTO } from "../models/version/TaskReviewDTO";
import { ReviewCommentDTO } from "../models/version/ReviewCommentDTO";

import { UserAPI } from "../api/users/UserAPI";
import { TaskAPI } from "../api/task/TaskAPI";
import { UserDTO } from "../models/users/UserDTO";


const isPM = (role?: string | null) =>
  role ? role.toLowerCase().includes("manager") : false;

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

  const [tab, setTab] = useState<ReviewsTab>("REVIEW");

  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<TaskReviewDTO[]>([]);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectTaskId, setRejectTaskId] = useState<number | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const [rejectionComments, setRejectionComments] = useState<Record<number, string>>({});

  const [authorNamesById, setAuthorNamesById] = useState<Record<number, string>>({});
  const [taskTitlesById, setTaskTitlesById] = useState<Record<number, string>>({});

  const userApi = useMemo(() => new UserAPI(), []);
  const taskApi = useMemo(() => new TaskAPI(import.meta.env.VITE_GATEWAY_URL, token), [token]);

  const ensureUsersLoaded = async () => {
    if (Object.keys(authorNamesById).length > 0) return;

    try {
        const users: UserDTO[] = await userApi.getAllUsers(token);
        const map: Record<number, string> = {};
        for (const u of users) map[u.user_id] = u.username;
        setAuthorNamesById(map);
    } catch (e) {
        console.error(e);
        // fallback #id
    }
  };

  const ensureTaskTitlesLoaded = async (list: TaskReviewDTO[]) => {
    const missing = Array.from(
      new Set(
        list
          .map((x) => x.taskId)
          .filter((id) => taskTitlesById[id] == null)
      )
    );

    if (!missing.length) return;
    
    try {
      const pairs = await Promise.all(
        missing.map(async (taskId) => {
          try {
            const t = await taskApi.getTask(taskId);
            return [taskId, t.title] as const;
          } catch (e) {
            console.error("Failed to load task title", taskId, e);
            return [taskId, `Task #${taskId}`] as const; // fallback
          }
        })
      );

      setTaskTitlesById((prev) => ({ ...prev, ...Object.fromEntries(pairs) }));
    } catch (e) {
      console.error(e);
    }
  };

  const canView = isPM(user?.role);

  useEffect(() => {
  if (!canView || !token) return;

  (async () => {
    try {
      const users = await new UserAPI().getAllUsers(token);

      const map: Record<number, string> = {};
      for (const u of users) map[u.user_id] = u.username;

      console.log("USERS MAP READY:", map); // <- mora da se vidi
      setAuthorNamesById(map);
    } catch (e) {
      console.error("Failed to load users for author names:", e);
      setAuthorNamesById({});
    }
  })();
}, [canView, token]);

  const tabs: ReviewsTab[] = useMemo(() => ["REVIEW", "APPROVED", "REJECTED", "ALL"], []);

  const load = async (status: ReviewsTab) => {
    try {
      setLoading(true);
      const data = await VersionControlAPI.getReviews(status);
      const list = (data ?? []) as TaskReviewDTO[];
      setItems(list);
      await ensureUsersLoaded();
      await ensureTaskTitlesLoaded(list);
      // ako gledamo REJECTED ili ALL povuci komentare po commentId
      if (status === "REJECTED" || status === "ALL") {
        const commentIds = Array.from(
          new Set(
            list
              .map((x: any) => Number(x.commentId ?? 0))
              .filter((id) => Number.isFinite(id) && id !== 0)
          )
        );

        if (!commentIds.length) {
          setRejectionComments({});
          return;
        }

        const results = await Promise.all(
          commentIds.map(async (id) => {
            try {
              const c: ReviewCommentDTO = await VersionControlAPI.getReviewComment(id);
              return [id, c.commentText] as const;
            } catch (e) {
              console.error("Failed to load comment", id, e);
              return [id, "Failed to load comment."] as const;
            }
          })
        );

        setRejectionComments(Object.fromEntries(results));
      } else {
        setRejectionComments({});
      }
    } catch (e) {
      console.error(e);
      setItems([]);
      setRejectionComments({});
      toast.error("Failed to load reviews.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!canView) {
      setLoading(false);
      setItems([]);
      setRejectionComments({});
      return;
    }

    load(tab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canView, token, tab]);

  const approve = async (taskId: number) => {
    try {
      setActionLoading(true);
      await VersionControlAPI.approveTaskReview(taskId);
      toast.success(`Task #${taskId} approved.`);
      await load(tab);
    } catch (e) {
      console.error(e);
      toast.error("Approve failed.");
    } finally {
      setActionLoading(false);
    }
  };

  const openReject = (taskId: number) => {
    setRejectTaskId(taskId);
    setRejectOpen(true);
  };

  const submitReject = async (commentText: string) => {
    if (!rejectTaskId) return;

    try {
      setActionLoading(true);
      await VersionControlAPI.rejectTaskReview(rejectTaskId, commentText);
      toast.success(`Changes requested for task #${rejectTaskId}.`);
      setRejectOpen(false);
      setRejectTaskId(null);
      await load(tab);
    } catch (e) {
      console.error(e);
      toast.error("Reject failed.");
    } finally {
      setActionLoading(false);
    }
  };

  const showInboxActions = tab === "REVIEW";

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

            <div className="flex flex-wrap gap-2 mt-3">
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
                items={items as any}
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
