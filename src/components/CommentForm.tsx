import { addComment } from "@/lib/actions";
import { SubmitButton } from "@/components/SubmitButton";

export function CommentForm({ painPointId }: { painPointId: string }) {
  return (
    <form action={addComment} className="flex flex-col gap-2">
      <input type="hidden" name="painPointId" value={painPointId} />
      <textarea
        name="content"
        required
        rows={3}
        placeholder="함께 고민할 의견이나 해결 아이디어를 남겨주세요..."
        className="w-full rounded-md border border-neutral-200 px-3 py-2 text-sm focus:border-neutral-400 focus:outline-none"
      />
      <div>
        <SubmitButton pendingText="등록 중...">의견 남기기</SubmitButton>
      </div>
    </form>
  );
}
