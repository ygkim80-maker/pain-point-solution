import Link from "next/link";
import { getCurrentUser } from "@/lib/session";
import { logout } from "@/lib/actions";

export async function Header() {
  const user = await getCurrentUser();

  return (
    <header className="border-b border-neutral-200 bg-white">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-sm font-semibold text-neutral-900">
          📍 핀포인트
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          {user ? (
            <>
              <Link href="/" className="text-neutral-600 hover:text-neutral-900">
                피드
              </Link>
              <Link
                href="/pain-points/new"
                className="text-neutral-600 hover:text-neutral-900"
              >
                새 페인포인트
              </Link>
              <Link href="/stats" className="text-neutral-600 hover:text-neutral-900">
                통계
              </Link>
              {user.isAdmin && (
                <Link
                  href="/admin/users"
                  className="text-neutral-600 hover:text-neutral-900"
                >
                  관리자
                </Link>
              )}
              <Link
                href="/me"
                className="text-neutral-400 hover:text-neutral-700"
                title="내 정보 수정"
              >
                {user.department}/{user.team} · {user.nickname}
              </Link>
              <form action={logout}>
                <button
                  type="submit"
                  className="text-neutral-500 hover:text-neutral-900"
                >
                  로그아웃
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="text-neutral-600 hover:text-neutral-900">
                로그인
              </Link>
              <Link href="/signup" className="text-neutral-600 hover:text-neutral-900">
                회원가입
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
