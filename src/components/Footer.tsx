import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-neutral-200 py-6 text-center text-xs text-neutral-400">
      <Link href="/privacy" className="hover:text-neutral-600">
        개인정보 처리방침
      </Link>
    </footer>
  );
}
