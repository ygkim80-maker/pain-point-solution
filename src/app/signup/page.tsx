import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { SignupForm } from "@/components/SignupForm";

export default async function SignupPage() {
  const user = await getCurrentUser();
  if (user) redirect("/");

  const departments = await prisma.user.findMany({
    select: { department: true },
    distinct: ["department"],
  });

  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <h1 className="mb-6 text-xl font-semibold">회원가입</h1>
      <SignupForm departmentOptions={departments.map((d) => d.department)} />
      <p className="mt-4 text-sm text-neutral-500">
        이미 계정이 있으신가요?{" "}
        <Link href="/login" className="font-medium text-neutral-900 underline">
          로그인
        </Link>
      </p>
    </div>
  );
}
