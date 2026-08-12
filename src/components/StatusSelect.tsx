"use client";

import { useRef, useTransition } from "react";
import { updateStatus } from "@/lib/actions";
import { STATUS_LABEL, STATUS_ORDER, type PainPointStatus } from "@/lib/constants";

export function StatusSelect({
  painPointId,
  status,
}: {
  painPointId: string;
  status: PainPointStatus;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <form
      ref={formRef}
      action={updateStatus}
      className="inline-flex items-center gap-2"
    >
      <input type="hidden" name="painPointId" value={painPointId} />
      <select
        key={status}
        name="status"
        defaultValue={status}
        disabled={isPending}
        onChange={() => {
          startTransition(() => {
            formRef.current?.requestSubmit();
          });
        }}
        className="rounded-md border border-neutral-200 bg-white px-2 py-1 text-sm disabled:opacity-50"
      >
        {STATUS_ORDER.map((s) => (
          <option key={s} value={s}>
            {STATUS_LABEL[s]}
          </option>
        ))}
      </select>
    </form>
  );
}
