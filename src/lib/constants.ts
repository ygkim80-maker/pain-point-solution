export const CATEGORIES = [
  "프로세스",
  "시스템/툴",
  "커뮤니케이션",
  "인력/조직",
  "업무환경",
  "기타",
] as const;

export type PainPointStatus = "OPEN" | "DISCUSSING" | "RESOLVED";

export const STATUS_ORDER: PainPointStatus[] = ["OPEN", "DISCUSSING", "RESOLVED"];

export const STATUS_LABEL: Record<PainPointStatus, string> = {
  OPEN: "제안됨",
  DISCUSSING: "논의중",
  RESOLVED: "해결됨",
};

export const STATUS_BADGE_CLASS: Record<PainPointStatus, string> = {
  OPEN: "bg-amber-100 text-amber-800 border-amber-200",
  DISCUSSING: "bg-blue-100 text-blue-800 border-blue-200",
  RESOLVED: "bg-emerald-100 text-emerald-800 border-emerald-200",
};

export type ReactionType = "EMPATHY" | "SAME";

export const REACTION_ORDER: ReactionType[] = ["EMPATHY", "SAME"];

export const REACTION_ICON: Record<ReactionType, string> = {
  EMPATHY: "🙌",
  SAME: "🙋",
};

export const REACTION_LABEL: Record<ReactionType, string> = {
  EMPATHY: "공감",
  SAME: "저도요",
};

export const REACTION_LABEL_ACTIVE: Record<ReactionType, string> = {
  EMPATHY: "공감함",
  SAME: "저도 겪음",
};

export const TRENDING_WINDOW_DAYS = 3;

export function trendingCutoff(): Date {
  return new Date(Date.now() - TRENDING_WINDOW_DAYS * 24 * 60 * 60 * 1000);
}
