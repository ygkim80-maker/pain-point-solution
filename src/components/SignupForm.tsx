"use client";

import { useActionState } from "react";
import { signup, type ActionState } from "@/lib/actions";
import { SubmitButton } from "@/components/SubmitButton";

const initialState: ActionState = {};

export function SignupForm({ departmentOptions }: { departmentOptions: string[] }) {
  const [state, formAction] = useActionState(signup, initialState);

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
          placeholder="영문/숫자 3~32자"
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
          autoComplete="new-password"
          className="rounded-md border border-neutral-200 px-3 py-2 text-sm focus:border-neutral-400 focus:outline-none"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-neutral-700" htmlFor="name">
          이름
        </label>
        <input
          id="name"
          name="name"
          required
          className="rounded-md border border-neutral-200 px-3 py-2 text-sm focus:border-neutral-400 focus:outline-none"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-neutral-700" htmlFor="department">
            부서
          </label>
          <input
            id="department"
            name="department"
            required
            list="department-options"
            className="rounded-md border border-neutral-200 px-3 py-2 text-sm focus:border-neutral-400 focus:outline-none"
          />
          <datalist id="department-options">
            {departmentOptions.map((d) => (
              <option key={d} value={d} />
            ))}
          </datalist>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-neutral-700" htmlFor="team">
            팀
          </label>
          <input
            id="team"
            name="team"
            required
            className="rounded-md border border-neutral-200 px-3 py-2 text-sm focus:border-neutral-400 focus:outline-none"
          />
        </div>
      </div>
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      <SubmitButton pendingText="가입 중...">가입하기</SubmitButton>
    </form>
  );
}
