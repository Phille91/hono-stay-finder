import type { Context } from "hono";

export default function dbError(c: Context, e: any) {
  console.warn("DB error", e?.code, e?.message);

  switch (e?.code) {
    case "PGRST116":
      return c.json({ error: "Not found" }, 404);
    case "42501":
      return c.json({ error: "Forbidden" }, 403);
    case "22P02":
    case "23514":
      return c.json({ error: "Invalid data" }, 400);
    default:
      return c.json({ error: "Server error" }, 500);
  }
}
