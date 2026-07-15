"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { createSession, destroySession } from "@/lib/auth";
import { requireUser } from "@/lib/session";
import { CATEGORIES, STATUS_ORDER, type PainPointStatus } from "@/lib/constants";

export type ActionState = { error?: string };

export async function signup(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const username = String(formData.get("username") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const department = String(formData.get("department") ?? "").trim();
  const team = String(formData.get("team") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!username || !name || !department || !team) {
    return { error: "모든 항목을 입력해주세요." };
  }
  if (!/^[a-zA-Z0-9_.-]{3,32}$/.test(username)) {
    return { error: "아이디는 영문/숫자/._- 조합 3~32자로 입력해주세요." };
  }
  if (password.length < 4) {
    return { error: "비밀번호는 4자 이상으로 설정해주세요." };
  }

  const existing = await prisma.user.findUnique({ where: { username } });
  if (existing) {
    return { error: "이미 사용 중인 아이디입니다." };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { username, name, department, team, passwordHash },
  });

  await createSession(user.id);
  redirect("/");
}

export async function login(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) {
    return { error: "아이디 또는 비밀번호가 올바르지 않습니다." };
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return { error: "아이디 또는 비밀번호가 올바르지 않습니다." };
  }

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

  revalidatePath("/");
  redirect(`/pain-points/${painPoint.id}`);
}

export async function addComment(formData: FormData) {
  const user = await requireUser();

  const painPointId = String(formData.get("painPointId") ?? "");
  const content = String(formData.get("content") ?? "").trim();
  if (!painPointId || !content) return;

  await prisma.comment.create({
    data: { content, painPointId, authorId: user.id },
  });

  revalidatePath(`/pain-points/${painPointId}`);
  redirect(`/pain-points/${painPointId}#comments`);
}

export async function toggleVote(formData: FormData) {
  const user = await requireUser();

  const painPointId = String(formData.get("painPointId") ?? "");
  if (!painPointId) return;

  const existing = await prisma.vote.findUnique({
    where: { painPointId_userId: { painPointId, userId: user.id } },
  });

  if (existing) {
    await prisma.vote.delete({ where: { id: existing.id } });
  } else {
    await prisma.vote.create({ data: { painPointId, userId: user.id } });
  }

  revalidatePath("/");
  revalidatePath(`/pain-points/${painPointId}`);
}

export async function updateStatus(formData: FormData) {
  await requireUser();

  const painPointId = String(formData.get("painPointId") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!painPointId || !STATUS_ORDER.includes(status as PainPointStatus)) return;

  await prisma.painPoint.update({
    where: { id: painPointId },
    data: { status: status as PainPointStatus },
  });

  revalidatePath("/");
  revalidatePath(`/pain-points/${painPointId}`);
}
