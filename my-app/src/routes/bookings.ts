import { Hono } from "hono";
import fs from "fs/promises";
import { bookingValidator } from "../validators/bookingvalidator.js";

const bookingApp = new Hono({ strict: false});

const readBookings = async (): Promise<Booking[]> => {
  const data: string = await fs.readFile("src/data/bookings.json", "utf-8");
  return JSON.parse(data);
}

const writeBookings = async (bookingsList: Booking[]) => {
  await fs.writeFile(
    "src/data/bookings.json",
    JSON.stringify(bookingsList, null, 2)
  );
};

bookingApp.get("/", async (c) => {
  try {
    const bookingsList = await readBookings();

    return c.json(bookingsList);
  } catch (error) {
    return c.json([]);
  }
});

bookingApp.get("/:id", async (c) => {
  const bookingId = c.req.param("id");
  const bookingsList = await readBookings();
  const booking = bookingsList.find(  
  (b) => b.booking_id === bookingId,
  );
  if (!booking) {
    return c.json(null, 404);
  }
  return c.json(booking);
});

bookingApp.post("/", bookingValidator, async (c) => {
  try {
    const booking = c.req.valid("json") as Booking;
    const bookingsList = await readBookings();

    bookingsList.push(booking);
    await writeBookings(bookingsList);

    return c.json(booking, 201);
  } catch (error) {
    console.error(error);
    return c.json({ error: "Failed to create booking" }, 400);
  }
});


bookingApp.put("/:id", bookingValidator, async (c) => {
  const id = c.req.param("id");
  const body = c.req.valid("json") as Booking;
  const bookingList = await readBookings();

  const bookingIndex = bookingList.findIndex((b) => b.booking_id === id);
  if (bookingIndex === -1) {
    return c.json({ error: "Booking not found" }, 404);
  }

  const updatedBooking: Booking = {
    ...body,
    booking_id: id,
  };

  bookingList[bookingIndex] = updatedBooking;
  await writeBookings(bookingList);

  return c.json(updatedBooking);
});

bookingApp.delete("/:id", async (c) => {
  const bookingId = c.req.param("id");
  const bookingsList = await readBookings();

  const bookingIndex = bookingsList.findIndex(
    (b) => b.booking_id === bookingId,
  );
  if (bookingIndex === -1) {
    return c.json(null, 404);
  }
  bookingsList.splice(bookingIndex,1)
  await writeBookings(bookingsList);
  return c.json(null, 200);
});

export default bookingApp;