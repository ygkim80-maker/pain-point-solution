import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { LoginForm } from "@/components/LoginForm";

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) redirect("/");

  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <h1 className="mb-6 text-xl font-semibold">로그인</h1>
      <LoginForm />
      <p className="mt-4 text-sm text-neutral-500">
        계정이 없으신가요?{" "}
        <Link href="/signup" className="font-medium text-neutral-900 underline">
          회원가입
        </Link>
      </p>
      <p className="mt-1 text-sm text-neutral-500">
        비밀번호를 잊으셨나요? 관리자에게 문의해 임시 비밀번호를 발급받으세요.
      </p>
    </div>
  );
}
