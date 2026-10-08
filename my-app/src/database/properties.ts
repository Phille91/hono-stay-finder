import type {
  PostgrestFilterBuilder,
  PostgrestSingleResponse,
  SupabaseClient,
} from "@supabase/supabase-js";

const TABLE_NAME = "properties";

const SELECT_QUERY_LIST: PropertyValidKey[] = [
  "property_id",
  "owner_id",
  "title",
  "description",
  "location",
  "price_per_night",
  "max_guests",
  "kind",
  "created_at",
];

const SELECT_QUERY = SELECT_QUERY_LIST.join(", ");
const QUERY_ID = "property_id";
const QUERY_KIND = "kind";

type PropertyListFilter = Partial<{
  maxPrice: number;
  location: string;
  maxGuests: number;
  sort: "asc" | "desc";
}>;

function buildPropertiesFilter(
  query: PostgrestFilterBuilder<any, any, any, any>,
  filters: PropertyListFilter,
) {
  if (filters.maxPrice) {
    query = query.gte("price_per_night", filters.maxPrice);
  }

  if (filters.maxGuests) {
    query = query.lte("max_guests", filters.maxGuests);
  }

  if (filters.location && filters.location.trim().length > 2) {
    query = query.ilike("location", `%${filters.location}%`);
  }

  if (filters.sort) {
    query = query.order("price_per_night", {
      ascending: filters.sort === "asc",
    });
  }

  return query;
}

export async function getProperties(
  sb: SupabaseClient,
  filters: PropertyListFilter,
): Promise<Property[]> {
  let query = sb.from(TABLE_NAME).select(SELECT_QUERY);

  buildPropertiesFilter(query, filters);

  const { error, data } = await query;

  if (!error) {
    return data as any as Property[];
  }
  throw error;
}

export async function getPropertiesByKind(
  sb: SupabaseClient,
  kind: PropertyKind,
  filters: PropertyListFilter,
): Promise<Property[]> {
  const query = sb.from(TABLE_NAME).select(SELECT_QUERY).eq(QUERY_KIND, kind);

  buildPropertiesFilter(query, filters);

  const { error, data } = await query;

  if (!error) {
    return data as any as Property[];
  }
  throw error;
}

export async function getPropertyById(
  sb: SupabaseClient,
  propertyId: string,
): Promise<Property> {
  const { error, data }: PostgrestSingleResponse<Property> = await sb
    .from(TABLE_NAME)
    .select(SELECT_QUERY)
    .eq(QUERY_ID, propertyId)
    .single();

  if (!error) {
    return data;
  }
  throw error;
}

export async function createProperty(
  sb: SupabaseClient,
  propertyBody: NewProperty,
) {
  const { error, data }: PostgrestSingleResponse<Property> = await sb
    .from(TABLE_NAME)
    .insert(propertyBody)
    .select(SELECT_QUERY)
    .single();

  if (!error) {
    return data;
  }
  throw error;
}

export async function updatePropertyById(
  sb: SupabaseClient,
  propertyId: string,
  property: Partial<Property>,
): Promise<Property> {
  const { error, data }: PostgrestSingleResponse<Property> = await sb
    .from(TABLE_NAME)
    .update(property)
    .eq(QUERY_ID, propertyId)
    .select()
    .single();

  if (!error) {
    return data;
  }
  throw error;
}

export async function deletePropertyById(
  sb: SupabaseClient,
  propertyId: string,
) {
  const { error }: PostgrestSingleResponse<Property> = await sb
    .from(TABLE_NAME)
    .delete()
    .eq(QUERY_ID, propertyId)
    .select()
    .single();

  if (!error) {
    return;
  }
  throw error;
}
