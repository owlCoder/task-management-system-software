import { useCallback, useMemo, useState } from "react";
import toast from "react-hot-toast";

import { VersionControlAPI } from "../api/version/VersionControlAPI";
import { TaskReviewDTO } from "../models/version/TaskReviewDTO";
import { ReviewCommentDTO } from "../models/version/ReviewCommentDTO";

import { UserAPI } from "../api/users/UserAPI";
import { TaskAPI } from "../api/task/TaskAPI";
import { UserDTO } from "../models/users/UserDTO";

type ReviewsTab = "REVIEW" | "APPROVED" | "REJECTED" | "ALL";

const isPM = (role?: string | null) =>
  role ? role.toLowerCase().includes("manager") : false;

type Params = {
  token: string;
  userRole?: string | null;

  userApi: UserAPI;
  taskApi: TaskAPI;
};

export const useReviewInbox = ({ token, userRole, userApi, taskApi }: Params) => {
  const canView = useMemo(() => isPM(userRole), [userRole]);

  const [tab, setTab] = useState<ReviewsTab>("REVIEW");

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [items, setItems] = useState<TaskReviewDTO[]>([]);
  const [rejectionComments, setRejectionComments] = useState<Record<number, string>>({});
  const [authorNamesById, setAuthorNamesById] = useState<Record<number, string>>({});
  const [taskTitlesById, setTaskTitlesById] = useState<Record<number, string>>({});

  const ensureUsersLoaded = useCallback(
    async (list: TaskReviewDTO[]) => {
      const authorIds = Array.from(
        new Set(list.map((x) => Number(x.authorId)).filter((id) => Number.isFinite(id) && id > 0))
      );

      const missing = authorIds.filter((id) => authorNamesById[id] == null);
      if (!missing.length) return;

      try {
        const users: UserDTO[] = await userApi.getUsersByIds(token, missing);
        const map: Record<number, string> = {};
        for (const u of users) map[u.user_id] = u.username;

        setAuthorNamesById((prev) => ({ ...prev, ...map }));
      } catch (e) {
        console.error(e);
        // fallback ostaje Author #id
      }
    },
    [authorNamesById, token, userApi]
  );

  const ensureTaskTitlesLoaded = useCallback(
    async (list: TaskReviewDTO[]) => {
      const missing = Array.from(
        new Set(
          list.map((x) => x.taskId).filter((id) => taskTitlesById[id] == null)
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
    },
    [taskApi, taskTitlesById]
  );

  const load = useCallback(
    async (status: ReviewsTab) => {
      try {
        setLoading(true);

        const data = await VersionControlAPI.getReviews(status);
        const list = (data ?? []) as TaskReviewDTO[];

        setItems(list);

        await ensureUsersLoaded(list);
        await ensureTaskTitlesLoaded(list);

        // ako gledamo REJECTED ili ALL povlaci komentare po commentId
        if (status === "REJECTED" || status === "ALL") {
          const commentIds = Array.from(
            new Set(
              list.map((x) => Number(x.commentId ?? 0)).filter((id) => Number.isFinite(id) && id !== 0)
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
    },
    [ensureTaskTitlesLoaded, ensureUsersLoaded]
  );

  const approve = useCallback(
    async (taskId: number) => {
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
    },
    [load, tab]
  );

  const reject = useCallback(
    async (taskId: number, commentText: string) => {
      try {
        setActionLoading(true);
        await VersionControlAPI.rejectTaskReview(taskId, commentText);
        toast.success(`Changes requested for task #${taskId}.`);
        await load(tab);
      } catch (e) {
        console.error(e);
        toast.error("Reject failed.");
      } finally {
        setActionLoading(false);
      }
    },
    [load, tab]
  );

  return {
    canView,
    tab,
    setTab,
    tabs: ["REVIEW", "APPROVED", "REJECTED", "ALL"] as ReviewsTab[],
    loading,
    actionLoading,
    items,
    rejectionComments,
    authorNamesById,
    taskTitlesById,
    load,
    approve,
    reject,
  };
};
