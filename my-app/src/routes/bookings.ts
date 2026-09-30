import { Hono } from "hono";
import {
  bookingOptionalValidator,
  bookingValidator,
} from "../validators/bookingvalidator.js";
import { getBookings, getBookingById, createBooking, updateBookingById, deleteBookingById } from "../database/bookings.js";

const bookings = new Hono({ strict: false });

bookings.get("/", async (c) => {
  try {
    const bookings = await getBookings();
    return c.json(bookings);
  } catch (e) {
    console.warn("Error in fetching bookings from SB database", e);
    return c.json([]);
  }
});

bookings.get("/:id", async (c) => {
  const bookingId = c.req.param("id");
  try {
    const booking = await getBookingById(bookingId);
    return c.json(booking);
  } catch (e) {
    console.warn("Error in fetching booking from SB database", e);
    return c.json(null, 404);
  }
});

bookings.post("/", bookingValidator, async (c) => {
  const bookingBody: NewBooking = c.req.valid("json");
try {
  const booking = await createBooking(bookingBody);
  return c.json(booking, 201);
} catch (e) {
  console.warn("Error in creating booking", e);
  return c.json({ error: "Error creating booking" }, 500);
}
});


bookings.patch("/:id", bookingOptionalValidator, async (c) => {
  const bookingId = c.req.param("id");
  const bookingBody: Partial<NewBooking> = c.req.valid("json");
  try {
    const booking = await updateBookingById(bookingId, bookingBody);
    return c.json(booking);
  } catch (e) {
    console.warn("Error updating booking in SB database", e);
    return c.json(null, 404)
  }
});

  bookings.delete("/:id", async (c) => {
  const bookingId = c.req.param("id");
  try {
    await deleteBookingById(bookingId);
    return c.json(null, 200);
  } catch (e) {
    console.warn("Error deleting booking in SB database", e);
    return c.json(null, 404);
  }
});
export default bookings;
