type BookingStatus = "pending" | "confirmed" | "cancelled";

interface Booking {
  booking_id: string;
  property_id: string;
  guest_name: string;
  guest_id: string;
  guest_email: string;
  check_in: string;
  check_out: string;
  guests: number;
  status: BookingStatus;
}

type NewBooking = Omit<Booking, "booking_id" | "guest_id" | "status">;

type UpdateBooking = Partial<NewBooking> & {
  status?: "confirmed" | "cancelled";
};

type BookingValidKey = keyof Booking;
