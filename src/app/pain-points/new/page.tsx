import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { PainPointForm } from "@/components/PainPointForm";

export default async function NewPainPointPage() {
  const user = await requireUser();

  const departments = await prisma.user.findMany({
    select: { department: true },
    distinct: ["department"],
  });

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="mb-6 text-xl font-semibold">새 페인포인트 등록</h1>
      <PainPointForm
        defaultDepartment={user.department}
        defaultTeam={user.team}
        departmentOptions={departments.map((d) => d.department)}
      />
    </div>
  );
}
