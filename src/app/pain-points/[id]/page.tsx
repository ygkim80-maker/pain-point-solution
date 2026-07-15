import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { StatusBadge } from "@/components/StatusBadge";
import { StatusSelect } from "@/components/StatusSelect";
import { VoteButton } from "@/components/VoteButton";
import { CommentForm } from "@/components/CommentForm";
import { timeAgo } from "@/lib/format";

export default async function PainPointDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireUser();
  const { id } = await params;

  const painPoint = await prisma.painPoint.findUnique({
    where: { id },
    include: {
      author: { select: { name: true, department: true, team: true } },
      votes: { select: { userId: true } },
      comments: {
        orderBy: { createdAt: "asc" },
        include: { author: { select: { name: true } } },
      },
    },
  });

  if (!painPoint) notFound();

  const hasVoted = painPoint.votes.some((v) => v.userId === user.id);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <Link href="/" className="text-sm text-neutral-500 hover:text-neutral-800">
        ← 피드로 돌아가기
      </Link>

      <div className="mt-4 rounded-lg border border-neutral-200 bg-white p-6">
        <div className="flex items-center gap-2 text-xs text-neutral-500">
          <span className="rounded-full bg-neutral-100 px-2 py-0.5">
            {painPoint.department} / {painPoint.team}
          </span>
          <span className="rounded-full bg-neutral-100 px-2 py-0.5">
            {painPoint.category}
          </span>
          <StatusBadge status={painPoint.status} />
        </div>

        <h1 className="mt-3 text-xl font-semibold text-neutral-900">
          {painPoint.title}
        </h1>
        <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-neutral-700">
          {painPoint.content}
        </p>

        <div className="mt-4 flex items-center gap-3 text-xs text-neutral-500">
          <span>
            {painPoint.author.name} · {painPoint.author.department}/{painPoint.author.team}
          </span>
          <span>{timeAgo(painPoint.createdAt)}</span>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-4">
          <VoteButton
            painPointId={painPoint.id}
            voteCount={painPoint.votes.length}
            hasVoted={hasVoted}
          />
          <div className="flex items-center gap-2 text-sm text-neutral-500">
            <span>상태 변경</span>
            <StatusSelect painPointId={painPoint.id} status={painPoint.status} />
          </div>
        </div>
      </div>

      <div id="comments" className="mt-6">
        <h2 className="mb-3 text-sm font-semibold text-neutral-700">
          💬 함께 고민하기 ({painPoint.comments.length})
        </h2>

        <ul className="flex flex-col gap-3">
          {painPoint.comments.map((c) => (
            <li
              key={c.id}
              className="rounded-lg border border-neutral-200 bg-white p-3"
            >
              <div className="flex items-center gap-2 text-xs text-neutral-500">
                <span className="font-medium text-neutral-700">{c.author.name}</span>
                <span>{timeAgo(c.createdAt)}</span>
              </div>
              <p className="mt-1 whitespace-pre-wrap text-sm text-neutral-800">
                {c.content}
              </p>
            </li>
          ))}
        </ul>

        <div className="mt-4">
          <CommentForm painPointId={painPoint.id} />
        </div>
      </div>
    </div>
  );
}
