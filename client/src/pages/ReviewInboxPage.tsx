import React, { useEffect, useState } from "react";
import Sidebar from "../components/dashboard/sidebar/Sidebar";
import { useAuth } from "../hooks/useAuthHook";
import toast from "react-hot-toast";

import { ReviewInboxList } from "../components/version/ReviewInboxList";
import { RejectReviewModal } from "../components/version/RejectReviewModal";

import { VersionControlAPI } from "../api/version/VersionControlAPI";
import { TaskReviewDTO } from "../models/version/TaskReviewDTO";

const isPM = (role?: string | null) =>
  role ? role.toLowerCase().includes("manager") : false;

const ReviewInboxPage: React.FC = () => {
  const { token, user } = useAuth();
  if (!token) return null;

  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<TaskReviewDTO[]>([]);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectTaskId, setRejectTaskId] = useState<number | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const canView = isPM(user?.role);

  const load = async () => {
    try {
      setLoading(true);
      const data = await VersionControlAPI.getTasksInReview();
      setItems(data ?? []);
    } catch (e) {
      console.error(e);
      setItems([]);
      toast.error("Failed to load review inbox.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!canView) {
      setLoading(false);
      setItems([]);
      return;
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canView, token]);

  const approve = async (taskId: number) => {
    try {
      setActionLoading(true);
      await VersionControlAPI.approveTaskReview(taskId);
      toast.success(`Task #${taskId} approved.`);
      await load();
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
      await load();
    } catch (e) {
      console.error(e);
      toast.error("Reject failed.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />

      <main className="flex-1 p-6 flex flex-col overflow-hidden">
        <div className="w-full max-w-4xl mx-auto flex flex-col h-full">
          <header className="flex flex-col gap-2 mb-6 flex-shrink-0">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">
              Review Inbox
            </h1>
            <p className="text-sm text-white/50">
              Tasks waiting for Project Manager approval.
            </p>
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
                onApprove={approve}
                onReject={openReject}
                disabled={actionLoading}
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
