import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { prettyJSON } from "hono/pretty-json";

import properties from "./routes/properties.js";
import bookings from "./routes/bookings.js";
import auth from "./routes/auth.js";
import { optionalAuth } from "./middleware/auth.js";
import { cors } from "hono/cors";
import { env } from "node:process";
const app = new Hono({ strict: false });

app.use(prettyJSON());

app.use("*", optionalAuth);

const frontendUrl = process.env.FRONTEND_URL;
if (!frontendUrl) {
  throw new Error("Frontend_URL must be set");
}

app.use(
  "*",
  cors({
    origin: frontendUrl,
    credentials: true,
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type"],
  }),
);

app.get("/", (c) => {
  return c.json({
    name: "Stay Finder",
  });
});

app.route("/properties", properties);
app.route("/bookings", bookings);
app.route("/auth", auth);
serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
