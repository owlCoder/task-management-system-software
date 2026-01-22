import React from "react";

type ReviewStatus = "REVIEW" | "APPROVED" | "REJECTED";

const getConfig = (status: ReviewStatus) => {
  switch (status) {
    case "REVIEW":
      return {
        container: "bg-yellow-950/40 text-yellow-400 border-yellow-500/50",
        dot: "bg-yellow-500 shadow-yellow-500/50",
        label: "IN REVIEW",
      };
    case "APPROVED":
      return {
        container: "bg-blue-950/40 text-blue-400 border-blue-500/50",
        dot: "bg-blue-500 shadow-blue-500/50",
        label: "APPROVED",
      };
    case "REJECTED":
      return {
        container: "bg-red-950/40 text-red-400 border-red-500/50",
        dot: "bg-red-500 shadow-red-500/50",
        label: "CHANGES REQ.",
      };
    default:
      return {
        container: "bg-slate-900/40 text-slate-400 border-slate-500/20",
        dot: "bg-slate-500",
        label: status,
      };
  }
};

export const ReviewStatusBadge: React.FC<{ status: ReviewStatus }> = ({ status }) => {
  const c = getConfig(status);

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 px-2.5 py-1
        rounded-md text-[10px] font-extrabold uppercase tracking-wider border
        bg-black/20 shadow-lg shadow-black/20
        ${c.container}
      `}
    >
      <span className={`w-2 h-2 rounded-full ${c.dot} shadow-[0_0_8px_currentColor]`} />
      {c.label}
    </span>
  );
};
