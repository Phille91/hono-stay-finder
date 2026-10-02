import type { PostgrestSingleResponse } from "@supabase/supabase-js";

import { sb } from "../lib/supabase.js";

const TABLE_NAME = "bookings";

const SELECT_QUERY_LIST: BookingValidKey[] = [
    "booking_id",
    "property_id",
    "guest_name",
    "guest_email",
    "check_in",
    "check_out",
    "guests",
    "status"
];

const SELECT_QUERY = SELECT_QUERY_LIST.join(", ");
const QUERY_ID = "booking_id";

export async function getBookings(): Promise<Booking[]> {
    const { data, error} = await sb
        .from(TABLE_NAME)
        .select(SELECT_QUERY)

        if(!error) {
            return data as any as Booking[];
        }
        throw error;
}

export async function getBookingById(bookingId: string): Promise<Booking> {
    const { data, error}: PostgrestSingleResponse<Booking> = await sb
        .from(TABLE_NAME)
        .select(SELECT_QUERY)
        .eq(QUERY_ID, bookingId)
        .single();

    if(!error) {
        return data;
    }
    throw error;
}

export async function createBooking(bookingBody: NewBooking): Promise<Booking> {
    const { data, error}: PostgrestSingleResponse<Booking> = await sb
        .from(TABLE_NAME)
        .insert(bookingBody)
        .select(SELECT_QUERY)
        .single();

    if(!error) {
        return data;
    }
    throw error;
}

export async function updateBookingById(
    bookingId: string,
    bookingBody: Partial<NewBooking>
): Promise<Booking> {
    const { data, error }: PostgrestSingleResponse<Booking> = await sb
        .from(TABLE_NAME)
        .update(bookingBody)
        .eq(QUERY_ID, bookingId)
        .select(SELECT_QUERY)
        .single();

    if (!error) {
        return data;
    }
    throw error;
}

export async function deleteBookingById(bookingId: string): Promise<void> {
    const { error }: PostgrestSingleResponse<Booking> = await sb
        .from(TABLE_NAME)
        .delete()
        .eq(QUERY_ID, bookingId)
        .select()
        .single();

    if (!error) {
        return;
    }
    throw error;
}
