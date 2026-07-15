import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { StatusBadge } from "@/components/StatusBadge";
import { STATUS_LABEL, STATUS_ORDER, type PainPointStatus } from "@/lib/constants";
import { timeAgo } from "@/lib/format";

type SearchParams = { department?: string; status?: string; sort?: string };

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { department, status, sort } = await searchParams;

  const where = {
    ...(department ? { department } : {}),
    ...(status && STATUS_ORDER.includes(status as PainPointStatus)
      ? { status: status as PainPointStatus }
      : {}),
  };

  const orderBy =
    sort === "votes"
      ? [{ votes: { _count: "desc" as const } }, { createdAt: "desc" as const }]
      : [{ createdAt: "desc" as const }];

  const [painPoints, departments] = await Promise.all([
    prisma.painPoint.findMany({
      where,
      orderBy,
      include: {
        author: { select: { name: true } },
        _count: { select: { comments: true, votes: true } },
      },
    }),
    prisma.user.findMany({ select: { department: true }, distinct: ["department"] }),
  ]);

  const departmentOptions = departments.map((d) => d.department);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold">페인포인트 피드</h1>
          <p className="mt-1 text-sm text-neutral-500">
            부서/팀의 불편함을 공유하고 댓글로 함께 해결책을 찾아보세요.
          </p>
        </div>
        <Link
          href="/pain-points/new"
          className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700"
        >
          + 새 페인포인트
        </Link>
      </div>

      <FilterBar
        departmentOptions={departmentOptions}
        current={{ department, status, sort }}
      />

      {painPoints.length === 0 ? (
        <div className="mt-10 rounded-lg border border-dashed border-neutral-300 p-8 text-center text-sm text-neutral-500">
          아직 등록된 페인포인트가 없습니다. 첫 번째로 공유해보세요!
        </div>
      ) : (
        <ul className="mt-4 flex flex-col gap-3">
          {painPoints.map((p) => (
            <li key={p.id}>
              <Link
                href={`/pain-points/${p.id}`}
                className="block rounded-lg border border-neutral-200 bg-white p-4 transition hover:border-neutral-300 hover:shadow-sm"
              >
                <div className="flex items-center gap-2 text-xs text-neutral-500">
                  <span className="rounded-full bg-neutral-100 px-2 py-0.5">
                    {p.department} / {p.team}
                  </span>
                  <span className="rounded-full bg-neutral-100 px-2 py-0.5">
                    {p.category}
                  </span>
                  <StatusBadge status={p.status} />
                </div>
                <h2 className="mt-2 text-base font-semibold text-neutral-900">
                  {p.title}
                </h2>
                <p className="mt-1 line-clamp-2 text-sm text-neutral-600">
                  {p.content}
                </p>
                <div className="mt-3 flex items-center gap-4 text-xs text-neutral-500">
                  <span>{p.author.name}</span>
                  <span>{timeAgo(p.createdAt)}</span>
                  <span>🙌 {p._count.votes}</span>
                  <span>💬 {p._count.comments}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function FilterBar({
  departmentOptions,
  current,
}: {
  departmentOptions: string[];
  current: SearchParams;
}) {
  const buildHref = (next: Partial<SearchParams>) => {
    const merged = { ...current, ...next };
    const params = new URLSearchParams();
    if (merged.department) params.set("department", merged.department);
    if (merged.status) params.set("status", merged.status);
    if (merged.sort) params.set("sort", merged.sort);
    const qs = params.toString();
    return qs ? `/?${qs}` : "/";
  };

  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      <span className="text-neutral-400">부서:</span>
      <FilterLink href={buildHref({ department: undefined })} active={!current.department}>
        전체
      </FilterLink>
      {departmentOptions.map((d) => (
        <FilterLink key={d} href={buildHref({ department: d })} active={current.department === d}>
          {d}
        </FilterLink>
      ))}

      <span className="ml-4 text-neutral-400">상태:</span>
      <FilterLink href={buildHref({ status: undefined })} active={!current.status}>
        전체
      </FilterLink>
      {STATUS_ORDER.map((s) => (
        <FilterLink key={s} href={buildHref({ status: s })} active={current.status === s}>
          {STATUS_LABEL[s]}
        </FilterLink>
      ))}

      <span className="ml-4 text-neutral-400">정렬:</span>
      <FilterLink href={buildHref({ sort: undefined })} active={!current.sort}>
        최신순
      </FilterLink>
      <FilterLink href={buildHref({ sort: "votes" })} active={current.sort === "votes"}>
        공감순
      </FilterLink>
    </div>
  );
}

function FilterLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`rounded-full border px-2.5 py-1 text-xs font-medium ${
        active
          ? "border-neutral-900 bg-neutral-900 text-white"
          : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300"
      }`}
    >
      {children}
    </Link>
  );
}
