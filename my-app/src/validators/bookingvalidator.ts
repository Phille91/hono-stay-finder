import * as z from "zod";
import { zValidator } from "@hono/zod-validator";

const bookingSchema = z.object({
  booking_id: z.string().optional(),
  property_id: z.string().min(1, "Property id is necessary"),
  guest_name: z.string().min(2, "Guest name is necessary"),
  guest_email: z.string().email("Invalid email"),
  check_in: z.string().min(1, "Check-in date is necessary"),
  check_out: z.string().min(1, "Check-out date is necessary"),
  guests: z.number().min(1, "Guests needs to be min 1"),
  status: z.enum(["pending", "confirmed", "cancelled"]).optional(),
});

export const bookingValidator = zValidator("json", bookingSchema, (result, c) => {
  if (!result.success) {
    return c.json(
      {
        errors: result.error.issues.map((issue) => [issue.path.join(", "), issue.message]),
      }, 400,);
  }

  if(!result.data.booking_id) {
    result.data.booking_id = `booking_${Math.floor(1000 + Math.random() * 9000)}`;
  }
  if (!result.data.status) {
  result.data.status = "pending";
}
});
