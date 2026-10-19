import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { prettyJSON } from "hono/pretty-json";
import { logger } from "hono/logger";
import properties from "./routes/properties.js";
import bookings from "./routes/bookings.js";
import auth from "./routes/auth.js";
import { optionalAuth } from "./middleware/auth.js";
import { cors } from "hono/cors";
import { env } from "./env.js";
const app = new Hono({ strict: false });

app.use(logger());

app.use(
  "*",
  cors({
    origin: env.frontendUrl,
    credentials: true,
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type"],
  }),
);

app.use(prettyJSON());

app.use("*", optionalAuth);

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
    port: 8000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
