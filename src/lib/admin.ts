import "server-only";

export function isBootstrapAdminUsername(username: string): boolean {
  const list = (process.env.ADMIN_USERNAMES ?? "")
    .split(",")
    .map((u) => u.trim())
    .filter(Boolean);
  return list.includes(username);
}

export function isSignupCodeValid(code: string): boolean {
  const expected = process.env.SIGNUP_CODE;
  if (!expected) return true; // 미설정 시 기존처럼 누구나 가입 가능 (하위 호환)
  return code === expected;
}
