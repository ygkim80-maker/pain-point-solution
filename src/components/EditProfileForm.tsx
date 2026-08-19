"use client";

import { useActionState } from "react";
import { updateProfile, type ActionState } from "@/lib/actions";
import { SubmitButton } from "@/components/SubmitButton";

const initialState: ActionState = {};

export function EditProfileForm({
  name,
  nickname,
  department,
  team,
  departmentOptions,
}: {
  name: string;
  nickname: string;
  department: string;
  team: string;
  departmentOptions: string[];
}) {
  const [state, formAction] = useActionState(updateProfile, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-neutral-700" htmlFor="name">
          이름
        </label>
        <input
          id="name"
          name="name"
          required
          defaultValue={name}
          placeholder="실명 (관리자만 확인 가능)"
          className="rounded-md border border-neutral-200 px-3 py-2 text-sm focus:border-neutral-400 focus:outline-none"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-neutral-700" htmlFor="nickname">
          닉네임
        </label>
        <input
          id="nickname"
          name="nickname"
          required
          defaultValue={nickname}
          placeholder="글/댓글에 표시될 이름"
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
            defaultValue={department}
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
            defaultValue={team}
            className="rounded-md border border-neutral-200 px-3 py-2 text-sm focus:border-neutral-400 focus:outline-none"
          />
        </div>
      </div>
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      <div>
        <SubmitButton pendingText="저장 중...">저장</SubmitButton>
      </div>
    </form>
  );
}
