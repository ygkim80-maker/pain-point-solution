import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { EditProfileForm } from "@/components/EditProfileForm";

export default async function MyProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const user = await requireUser();
  const { saved } = await searchParams;

  const departments = await prisma.user.findMany({
    select: { department: true },
    distinct: ["department"],
  });

  return (
    <div className="mx-auto max-w-sm px-4 py-10">
      <h1 className="mb-1 text-xl font-semibold">내 정보 수정</h1>
      <p className="mb-6 text-sm text-neutral-500">
        아이디는 변경할 수 없습니다. 비밀번호를 잊으신 경우 관리자에게 문의해주세요.
      </p>
      {saved && (
        <p className="mb-4 rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          저장되었습니다.
        </p>
      )}
      <EditProfileForm
        name={user.name}
        nickname={user.nickname}
        department={user.department}
        team={user.team}
        departmentOptions={departments.map((d) => d.department)}
      />
    </div>
  );
}
