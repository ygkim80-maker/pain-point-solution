import { toggleReaction } from "@/lib/actions";
import { SubmitButton } from "@/components/SubmitButton";
import { REACTION_ICON, REACTION_LABEL, REACTION_LABEL_ACTIVE, type ReactionType } from "@/lib/constants";

export function ReactionButton({
  painPointId,
  type,
  count,
  active,
}: {
  painPointId: string;
  type: ReactionType;
  count: number;
  active: boolean;
}) {
  return (
    <form action={toggleReaction}>
      <input type="hidden" name="painPointId" value={painPointId} />
      <input type="hidden" name="type" value={type} />
      <SubmitButton
        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium transition ${
          active
            ? "border-orange-300 bg-orange-50 text-orange-700"
            : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300"
        }`}
      >
        <span>{REACTION_ICON[type]}</span>
        <span>{active ? REACTION_LABEL_ACTIVE[type] : REACTION_LABEL[type]}</span>
        <span className="tabular-nums">{count}</span>
      </SubmitButton>
    </form>
  );
}
