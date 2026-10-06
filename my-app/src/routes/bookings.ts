import { Hono } from "hono";
import {
  bookingOptionalValidator,
  bookingValidator,
} from "../validators/bookingvalidator.js";
import {
  getBookings,
  getBookingById,
  createBooking,
  updateBookingById,
  deleteBookingById,
} from "../database/bookings.js";
import { requireAuth } from "../middleware/auth.js";

const bookings = new Hono({ strict: false });

bookings.get("/", requireAuth, async (c) => {
  try {
    const bookings = await getBookings(c.get("supabase"));
    return c.json(bookings);
  } catch (e) {
    console.warn("Error in fetching bookings from SB database", e);
    return c.json([]);
  }
});

bookings.get("/:id", requireAuth, async (c) => {
  const bookingId = c.req.param("id");

  if (!bookingId) {
    return c.json({ error: "Property ID is required" }, 400);
  }

  try {
    const booking = await getBookingById(c.get("supabase"), bookingId);
    return c.json(booking);
  } catch (e) {
    console.warn("Error in fetching booking from SB database", e);
    return c.json(null, 404);
  }
});

bookings.post("/", requireAuth, bookingValidator, async (c) => {
  const bookingBody: NewBooking = c.req.valid("json");
  try {
    const booking = await createBooking(c.get("supabase"), bookingBody);
    return c.json(booking, 201);
  } catch (e) {
    console.warn("Error in creating booking", e);
    return c.json({ error: "Error creating booking" }, 500);
  }
});

bookings.patch("/:id", requireAuth, bookingOptionalValidator, async (c) => {
  const bookingId = c.req.param("id");
  const bookingBody: Partial<NewBooking> = c.req.valid("json");
  try {
    const booking = await updateBookingById(
      c.get("supabase"),
      bookingId,
      bookingBody,
    );
    return c.json(booking);
  } catch (e) {
    console.warn("Error updating booking in SB database", e);
    return c.json(null, 404);
  }
});

bookings.delete("/:id", requireAuth, async (c) => {
  const bookingId = c.req.param("id");

  if (!bookingId) {
    return c.json({ error: "Property ID is required" }, 400);
  }

  try {
    await deleteBookingById(c.get("supabase"), bookingId);
    return c.json(null, 200);
  } catch (e) {
    console.warn("Error deleting booking in SB database", e);
    return c.json(null, 404);
  }
});
export default bookings;
