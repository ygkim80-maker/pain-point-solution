"use client";

import { useActionState } from "react";
import { createPainPoint, type ActionState } from "@/lib/actions";
import { SubmitButton } from "@/components/SubmitButton";
import { CATEGORIES } from "@/lib/constants";

const initialState: ActionState = {};

export function PainPointForm({
  defaultDepartment,
  defaultTeam,
  departmentOptions,
}: {
  defaultDepartment: string;
  defaultTeam: string;
  departmentOptions: string[];
}) {
  const [state, formAction] = useActionState(createPainPoint, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-neutral-700" htmlFor="title">
          제목
        </label>
        <input
          id="title"
          name="title"
          required
          placeholder="한 줄로 페인포인트를 요약해주세요"
          className="rounded-md border border-neutral-200 px-3 py-2 text-sm focus:border-neutral-400 focus:outline-none"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-neutral-700" htmlFor="content">
          내용
        </label>
        <textarea
          id="content"
          name="content"
          required
          rows={6}
          placeholder="어떤 상황에서 어떤 불편함을 겪고 있는지 구체적으로 적어주세요."
          className="rounded-md border border-neutral-200 px-3 py-2 text-sm focus:border-neutral-400 focus:outline-none"
        />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-neutral-700" htmlFor="category">
            카테고리
          </label>
          <select
            id="category"
            name="category"
            defaultValue={CATEGORIES[0]}
            className="rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm focus:border-neutral-400 focus:outline-none"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-neutral-700" htmlFor="department">
            부서
          </label>
          <input
            id="department"
            name="department"
            required
            defaultValue={defaultDepartment}
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
            defaultValue={defaultTeam}
            className="rounded-md border border-neutral-200 px-3 py-2 text-sm focus:border-neutral-400 focus:outline-none"
          />
        </div>
      </div>
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      <div>
        <SubmitButton pendingText="등록 중...">페인포인트 등록</SubmitButton>
      </div>
    </form>
  );
}
