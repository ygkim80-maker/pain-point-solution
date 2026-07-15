import { toggleVote } from "@/lib/actions";
import { SubmitButton } from "@/components/SubmitButton";

export function VoteButton({
  painPointId,
  voteCount,
  hasVoted,
}: {
  painPointId: string;
  voteCount: number;
  hasVoted: boolean;
}) {
  return (
    <form action={toggleVote}>
      <input type="hidden" name="painPointId" value={painPointId} />
      <SubmitButton
        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium transition ${
          hasVoted
            ? "border-orange-300 bg-orange-50 text-orange-700"
            : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300"
        }`}
      >
        <span>🙌</span>
        <span>{hasVoted ? "공감함" : "공감"}</span>
        <span className="tabular-nums">{voteCount}</span>
      </SubmitButton>
    </form>
  );
}
