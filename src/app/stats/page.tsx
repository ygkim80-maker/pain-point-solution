import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { STATUS_LABEL, STATUS_ORDER, type PainPointStatus } from "@/lib/constants";

const STATUS_BAR_COLOR: Record<PainPointStatus, string> = {
  OPEN: "#f59e0b",
  DISCUSSING: "#3b82f6",
  RESOLVED: "#10b981",
};

export default async function StatsPage() {
  await requireUser();

  const [total, resolved, byDepartment, byDepartmentStatus] = await Promise.all([
    prisma.painPoint.count(),
    prisma.painPoint.count({ where: { status: "RESOLVED" } }),
    prisma.painPoint.groupBy({ by: ["department"], _count: { _all: true } }),
    prisma.painPoint.groupBy({ by: ["department", "status"], _count: { _all: true } }),
  ]);

  const departments = byDepartment
    .map((d) => ({ department: d.department, count: d._count._all }))
    .sort((a, b) => b.count - a.count);

  const statusByDept = new Map<string, Record<PainPointStatus, number>>();
  for (const d of departments) {
    statusByDept.set(d.department, { OPEN: 0, DISCUSSING: 0, RESOLVED: 0 });
  }
  for (const row of byDepartmentStatus) {
    const entry = statusByDept.get(row.department);
    if (entry) entry[row.status] = row._count._all;
  }

  const maxCount = Math.max(1, ...departments.map((d) => d.count));
  const resolveRate = total === 0 ? 0 : Math.round((resolved / total) * 100);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-xl font-semibold">부서별 통계</h1>
      <p className="mt-1 text-sm text-neutral-500">
        어느 부서에서 어떤 상태로 페인포인트가 쌓이고 있는지 한눈에 봅니다.
      </p>

      <div className="mt-6 grid grid-cols-3 gap-3">
        <StatTile label="전체 페인포인트" value={total} />
        <StatTile label="해결됨" value={resolved} />
        <StatTile label="해결률" value={`${resolveRate}%`} />
      </div>

      <section className="mt-8">
        <h2 className="mb-3 text-sm font-semibold text-neutral-700">부서별 등록 건수</h2>
        {departments.length === 0 ? (
          <p className="text-sm text-neutral-500">아직 데이터가 없습니다.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {departments.map((d) => (
              <li key={d.department} className="flex items-center gap-3">
                <span className="w-24 shrink-0 truncate text-xs text-neutral-600">
                  {d.department}
                </span>
                <div className="h-4 flex-1 rounded bg-neutral-100">
                  <div
                    className="h-4 rounded bg-neutral-900"
                    style={{ width: `${(d.count / maxCount) * 100}%` }}
                  />
                </div>
                <span className="w-8 shrink-0 text-right text-xs tabular-nums text-neutral-700">
                  {d.count}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {departments.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-3 text-sm font-semibold text-neutral-700">부서별 상태 분포</h2>

          <div className="mb-3 flex items-center gap-4 text-xs text-neutral-600">
            {STATUS_ORDER.map((s) => (
              <span key={s} className="flex items-center gap-1.5">
                <span
                  className="inline-block h-2.5 w-2.5 rounded-sm"
                  style={{ backgroundColor: STATUS_BAR_COLOR[s] }}
                />
                {STATUS_LABEL[s]}
              </span>
            ))}
          </div>

          <ul className="flex flex-col gap-2">
            {departments.map((d) => {
              const counts = statusByDept.get(d.department)!;
              const deptTotal = d.count;
              return (
                <li key={d.department} className="flex items-center gap-3">
                  <span className="w-24 shrink-0 truncate text-xs text-neutral-600">
                    {d.department}
                  </span>
                  <div className="flex h-4 flex-1 gap-0.5 overflow-hidden rounded bg-neutral-100">
                    {STATUS_ORDER.map((s) => {
                      const width = deptTotal === 0 ? 0 : (counts[s] / deptTotal) * 100;
                      if (width === 0) return null;
                      return (
                        <div
                          key={s}
                          style={{ width: `${width}%`, backgroundColor: STATUS_BAR_COLOR[s] }}
                        />
                      );
                    })}
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-max text-left text-xs">
              <thead>
                <tr className="text-neutral-400">
                  <th className="py-1 pr-4 font-normal">부서</th>
                  {STATUS_ORDER.map((s) => (
                    <th key={s} className="py-1 pr-4 font-normal">
                      {STATUS_LABEL[s]}
                    </th>
                  ))}
                  <th className="py-1 font-normal">합계</th>
                </tr>
              </thead>
              <tbody>
                {departments.map((d) => {
                  const counts = statusByDept.get(d.department)!;
                  return (
                    <tr key={d.department} className="border-t border-neutral-100">
                      <td className="py-1.5 pr-4 text-neutral-700">{d.department}</td>
                      {STATUS_ORDER.map((s) => (
                        <td key={s} className="py-1.5 pr-4 tabular-nums text-neutral-700">
                          {counts[s]}
                        </td>
                      ))}
                      <td className="py-1.5 tabular-nums font-medium text-neutral-900">
                        {d.count}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}

function StatTile({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-4">
      <p className="text-xs text-neutral-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold tabular-nums text-neutral-900">{value}</p>
    </div>
  );
}
