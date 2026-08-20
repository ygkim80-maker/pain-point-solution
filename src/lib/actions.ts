"use server";

import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { createSession, destroySession } from "@/lib/auth";
import { requireUser, requireAdmin } from "@/lib/session";
import { isBootstrapAdminUsername, isSignupCodeValid } from "@/lib/admin";
import { notifySlack } from "@/lib/slack";
import {
  CATEGORIES,
  STATUS_ORDER,
  STATUS_LABEL,
  REACTION_ORDER,
  type PainPointStatus,
  type ReactionType,
} from "@/lib/constants";

function appUrl() {
  return (
    process.env.NEXT_PUBLIC_APP_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")
  );
}

export type ActionState = { error?: string };

export async function signup(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const username = String(formData.get("username") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const nickname = String(formData.get("nickname") ?? "").trim();
  const department = String(formData.get("department") ?? "").trim();
  const team = String(formData.get("team") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const signupCode = String(formData.get("signupCode") ?? "");

  if (!username || !name || !nickname || !department || !team) {
    return { error: "모든 항목을 입력해주세요." };
  }
  if (!isSignupCodeValid(signupCode)) {
    return { error: "가입 코드가 올바르지 않습니다. 관리자에게 문의해주세요." };
  }
  if (!/^[a-zA-Z0-9_.-]{3,32}$/.test(username)) {
    return { error: "아이디는 영문/숫자/._- 조합 3~32자로 입력해주세요." };
  }
  if (password.length < 8) {
    return { error: "비밀번호는 8자 이상으로 설정해주세요." };
  }

  const existing = await prisma.user.findUnique({ where: { username } });
  if (existing) {
    return { error: "이미 사용 중인 아이디입니다." };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      username,
      name,
      nickname,
      department,
      team,
      passwordHash,
      isAdmin: isBootstrapAdminUsername(username),
    },
  });

  await createSession(user.id);
  redirect("/");
}

const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000;

export async function login(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) {
    return { error: "아이디 또는 비밀번호가 올바르지 않습니다." };
  }

  if (user.lockedUntil && user.lockedUntil.getTime() > Date.now()) {
    const minutes = Math.ceil((user.lockedUntil.getTime() - Date.now()) / 60000);
    return { error: `로그인 시도가 많아 잠시 잠겼습니다. ${minutes}분 후 다시 시도해주세요.` };
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    const failedLoginCount = user.failedLoginCount + 1;
    const lockedOut = failedLoginCount >= MAX_LOGIN_ATTEMPTS;
    await prisma.user.update({
      where: { id: user.id },
      data: {
        failedLoginCount: lockedOut ? 0 : failedLoginCount,
        lockedUntil: lockedOut ? new Date(Date.now() + LOCKOUT_MS) : null,
      },
    });
    return { error: "아이디 또는 비밀번호가 올바르지 않습니다." };
  }

  const isAdmin = user.isAdmin || isBootstrapAdminUsername(user.username);
  await prisma.user.update({
    where: { id: user.id },
    data: { failedLoginCount: 0, lockedUntil: null, isAdmin },
  });

  await createSession(user.id);
  redirect("/");
}

export async function logout() {
  await destroySession();
  redirect("/login");
}

export async function createPainPoint(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireUser();

  const title = String(formData.get("title") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const department = String(formData.get("department") ?? "").trim();
  const team = String(formData.get("team") ?? "").trim();

  if (!title || !content || !department || !team) {
    return { error: "제목, 내용, 부서, 팀을 모두 입력해주세요." };
  }
  if (!CATEGORIES.includes(category as (typeof CATEGORIES)[number])) {
    return { error: "카테고리를 선택해주세요." };
  }

  const painPoint = await prisma.painPoint.create({
    data: { title, content, category, department, team, authorId: user.id },
  });

  await notifySlack(
    `🧩 새 페인포인트: *${title}*\n${department}/${team} · ${user.nickname}\n${appUrl()}/pain-points/${painPoint.id}`
  );

  revalidatePath("/");
  redirect(`/pain-points/${painPoint.id}`);
}

export async function addComment(formData: FormData) {
  const user = await requireUser();

  const painPointId = String(formData.get("painPointId") ?? "");
  const content = String(formData.get("content") ?? "").trim();
  if (!painPointId || !content) return;

  const [, painPoint] = await Promise.all([
    prisma.comment.create({ data: { content, painPointId, authorId: user.id } }),
    prisma.painPoint.findUnique({ where: { id: painPointId }, select: { title: true } }),
  ]);

  if (painPoint) {
    await notifySlack(
      `💬 "${painPoint.title}"에 새 의견: ${user.nickname}\n${content}\n${appUrl()}/pain-points/${painPointId}#comments`
    );
  }

  revalidatePath(`/pain-points/${painPointId}`);
  redirect(`/pain-points/${painPointId}#comments`);
}

export async function toggleReaction(formData: FormData) {
  const user = await requireUser();

  const painPointId = String(formData.get("painPointId") ?? "");
  const type = String(formData.get("type") ?? "");
  if (!painPointId || !REACTION_ORDER.includes(type as ReactionType)) return;

  const existing = await prisma.vote.findUnique({
    where: { painPointId_userId_type: { painPointId, userId: user.id, type: type as ReactionType } },
  });

  if (existing) {
    await prisma.vote.delete({ where: { id: existing.id } });
  } else {
    await prisma.vote.create({ data: { painPointId, userId: user.id, type: type as ReactionType } });
  }

  revalidatePath("/");
  revalidatePath(`/pain-points/${painPointId}`);
}

export async function updateStatus(formData: FormData) {
  await requireAdmin();

  const painPointId = String(formData.get("painPointId") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!painPointId || !STATUS_ORDER.includes(status as PainPointStatus)) return;

  const painPoint = await prisma.painPoint.update({
    where: { id: painPointId },
    data: { status: status as PainPointStatus },
  });

  await notifySlack(
    `🔄 "${painPoint.title}" 상태가 [${STATUS_LABEL[status as PainPointStatus]}]로 변경되었습니다.\n${appUrl()}/pain-points/${painPointId}`
  );

  revalidatePath("/");
  revalidatePath(`/pain-points/${painPointId}`);
}

function generateTempPassword() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
  const bytes = crypto.randomBytes(12);
  let result = "";
  for (const byte of bytes) result += alphabet[byte % alphabet.length];
  return result;
}

export type ResetPasswordState = { error?: string; success?: { username: string; tempPassword: string } };

export async function resetUserPassword(
  _prevState: ResetPasswordState,
  formData: FormData
): Promise<ResetPasswordState> {
  await requireAdmin();

  const userId = String(formData.get("userId") ?? "");
  const target = await prisma.user.findUnique({ where: { id: userId } });
  if (!target) {
    return { error: "사용자를 찾을 수 없습니다." };
  }

  const tempPassword = generateTempPassword();
  const passwordHash = await bcrypt.hash(tempPassword, 10);
  await prisma.user.update({ where: { id: userId }, data: { passwordHash } });

  return { success: { username: target.username, tempPassword } };
}

export async function updateProfile(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireUser();

  const name = String(formData.get("name") ?? "").trim();
  const nickname = String(formData.get("nickname") ?? "").trim();
  const department = String(formData.get("department") ?? "").trim();
  const team = String(formData.get("team") ?? "").trim();

  if (!name || !nickname || !department || !team) {
    return { error: "모든 항목을 입력해주세요." };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { name, nickname, department, team },
  });

  revalidatePath("/");
  revalidatePath("/me");
  redirect("/me?saved=1");
}
