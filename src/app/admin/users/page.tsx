import { requireAdmin } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { ResetPasswordButton } from "@/components/ResetPasswordButton";
import { timeAgo } from "@/lib/format";

export default async function AdminUsersPage() {
  await requireAdmin();

  const users = await prisma.user.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-xl font-semibold">사용자 관리</h1>
      <p className="mt-1 text-sm text-neutral-500">
        비밀번호를 잊은 팀원에게 임시 비밀번호를 발급할 수 있습니다.
      </p>

      <ul className="mt-6 flex flex-col gap-3">
        {users.map((u) => (
          <li
            key={u.id}
            className="flex items-center justify-between gap-4 rounded-lg border border-neutral-200 bg-white p-4"
          >
            <div>
              <p className="text-sm font-medium text-neutral-900">
                {u.name} <span className="text-neutral-400">@{u.username}</span>{" "}
                {u.isAdmin && (
                  <span className="ml-1 rounded-full bg-neutral-900 px-2 py-0.5 text-[10px] font-medium text-white">
                    관리자
                  </span>
                )}
              </p>
              <p className="text-xs text-neutral-500">
                {u.department} / {u.team} · 가입 {timeAgo(u.createdAt)}
              </p>
            </div>
            <ResetPasswordButton userId={u.id} />
          </li>
        ))}
      </ul>
    </div>
  );
}
