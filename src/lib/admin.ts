import "server-only";

export function isBootstrapAdminUsername(username: string): boolean {
  const list = (process.env.ADMIN_USERNAMES ?? "")
    .split(",")
    .map((u) => u.trim())
    .filter(Boolean);
  return list.includes(username);
}
