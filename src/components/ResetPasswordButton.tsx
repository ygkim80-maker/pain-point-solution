"use client";

import { useActionState } from "react";
import { resetUserPassword, type ResetPasswordState } from "@/lib/actions";
import { SubmitButton } from "@/components/SubmitButton";

const initialState: ResetPasswordState = {};

export function ResetPasswordButton({ userId }: { userId: string }) {
  const [state, formAction] = useActionState(resetUserPassword, initialState);

  if (state.success) {
    return (
      <div className="text-xs">
        <p className="text-neutral-500">
          임시 비밀번호가 발급되었습니다. 아래 값을 <strong>{state.success.username}</strong>{" "}
          님에게 직접 전달해주세요 (다시 확인할 수 없습니다):
        </p>
        <code className="mt-1 inline-block rounded bg-neutral-100 px-2 py-1 font-mono text-sm">
          {state.success.tempPassword}
        </code>
      </div>
    );
  }

  return (
    <form action={formAction}>
      <input type="hidden" name="userId" value={userId} />
      <SubmitButton
        pendingText="재설정 중..."
        className="rounded-md border border-neutral-200 px-2.5 py-1 text-xs font-medium text-neutral-600 hover:border-neutral-300"
      >
        비밀번호 재설정
      </SubmitButton>
      {state.error && <p className="mt-1 text-xs text-red-600">{state.error}</p>}
    </form>
  );
}
