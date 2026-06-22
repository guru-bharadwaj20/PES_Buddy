import { cn } from "@/lib/utils";

type Status =
  | "PENDING"
  | "ACCEPTED"
  | "REJECTED"
  | "PREPARING"
  | "COMPLETED"
  | "CANCELLED"
  | "ONGOING"
  | "ACTIVE"
  | "DELIVERED";

const STATUS_MAP: Record<Status, { label: string; className: string }> = {
  PENDING: { label: "Pending", className: "status-pending" },
  ACCEPTED: { label: "Accepted", className: "status-accepted" },
  REJECTED: { label: "Rejected", className: "status-rejected" },
  PREPARING: { label: "Preparing", className: "status-preparing" },
  COMPLETED: { label: "Completed", className: "status-completed" },
  CANCELLED: { label: "Cancelled", className: "status-cancelled" },
  ONGOING: { label: "Ongoing", className: "status-ongoing" },
  ACTIVE: { label: "Active", className: "status-accepted" },
  DELIVERED: { label: "Delivered", className: "status-completed" },
};

interface StatusBadgeProps {
  status: Status | string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = STATUS_MAP[status as Status] ?? {
    label: status,
    className: "status-pending",
  };

  return (
    <span
      className={cn(
        "px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wide",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
