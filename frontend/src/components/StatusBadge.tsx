"use client";

import clsx from "clsx";

interface StatusBadgeProps {
  status: string;
}

const statusConfig: Record<string, { bg: string; text: string; dot: string; label: string }> = {
  pending: { bg: "bg-amber-50", text: "text-amber-800", dot: "bg-amber-500", label: "در انتظار" },
  confirmed: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500", label: "تأیید شده" },
  rejected: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500", label: "رد شده" },
  cancelled: { bg: "bg-gray-50", text: "text-gray-700", dot: "bg-gray-500", label: "لغو شده" },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.pending;
  return (
    <span className={clsx("inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-black", config.bg, config.text)}>
      <span className={clsx("h-1.5 w-1.5 rounded-full", config.dot)} />
      {config.label}
    </span>
  );
}
