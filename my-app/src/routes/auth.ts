import { Hono } from "hono";
import { authValidator } from "../validators/authValidator.js";
import { match } from "node:assert";
const auth = new Hono({
  strict: false,
});

auth.post("/register", authValidator, async (c) => {
  const { email, password } = c.req.valid("json");

  try {
    const sb = c.get("supabase");
    const { error, data } = await sb.auth.signUp({
      email,
      password,
    });
    if (!error) {
      return c.json(
        {
          user: data.user,
        },
        201,
      );
    }
    throw error;
  } catch (e: any) {
    console.warn("Error in registering", e);
    return c.json(
      {
        message: e?.message,
      },
      400,
    );
  }
});

auth.post("/login", authValidator, async (c) => {
  const { email, password } = c.req.valid("json");

  try {
    const sb = c.get("supabase");
    const { error, data } = await sb.auth.signInWithPassword({
      email,
      password,
    });
    if (!error) {
      return c.json({
        user: data.user,
        accessToken: data.session?.access_token,
      });
    }
    throw error;
  } catch (e: any) {
    console.warn("Error in registering", e);
    return c.json(
      {
        message: e?.message,
      },
      400,
    );
  }
});

auth.get("/me", async (c) => {
  const authorization = c.req.header("Authorization");
  const token = authorization?.match(/^Bearer\s+(.+)$/i)?.[1];

  if (!token) {
    return c.json({ message: "Unauthorized" }, 401);
  }

  const sb = c.get("supabase");
  const { data, error } = await sb.auth.getUser(token);

  if (error || !data.user) {
    console.warn("GET /me token verification failed:", error?.message);
    return c.json({ message: "Unauthorized" }, 401);
  }

  return c.json({ user: data.user });
});

auth.post("/logout", async (c) => {
  const authorization = c.req.header("Authorization");
  const token = authorization?.match(/^Bearer\s+(.+)$/i)?.[1];

  if (!token) {
    return c.json({ message: "Unauthorized" }, 401);
  }

  const sb = c.get("supabase");
  const { data, error } = await sb.auth.getUser(token);

  if (error || !data.user) {
    return c.json({ message: "Unauthorized" }, 401);
  }

  const { error: signOurError } = await sb.auth.admin.signOut(token);

  if (signOurError) {
    console.error("Logout failed:", signOurError.message);
    return c.json({ message: "Could not log out" }, 500);
  }

  return c.json({ message: "Logged out successfully" });
});

export default auth;
