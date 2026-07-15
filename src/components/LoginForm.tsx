"use client";

import { useActionState } from "react";
import { login, type ActionState } from "@/lib/actions";
import { SubmitButton } from "@/components/SubmitButton";

const initialState: ActionState = {};

export function LoginForm() {
  const [state, formAction] = useActionState(login, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-neutral-700" htmlFor="username">
          아이디
        </label>
        <input
          id="username"
          name="username"
          required
          autoComplete="username"
          className="rounded-md border border-neutral-200 px-3 py-2 text-sm focus:border-neutral-400 focus:outline-none"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-neutral-700" htmlFor="password">
          비밀번호
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="rounded-md border border-neutral-200 px-3 py-2 text-sm focus:border-neutral-400 focus:outline-none"
        />
      </div>
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      <SubmitButton pendingText="로그인 중...">로그인</SubmitButton>
    </form>
  );
}
