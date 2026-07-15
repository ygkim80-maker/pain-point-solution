import { STATUS_BADGE_CLASS, STATUS_LABEL, type PainPointStatus } from "@/lib/constants";

export function StatusBadge({ status }: { status: PainPointStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${STATUS_BADGE_CLASS[status]}`}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}
