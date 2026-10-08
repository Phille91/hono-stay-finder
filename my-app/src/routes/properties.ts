import { Hono } from "hono";

import {
  propertyOptionalValidator,
  propertyParamValidator,
  propertyValidator,
} from "../validators/propertyValidator.js";
import {
  createProperty,
  deletePropertyById,
  getProperties,
  getPropertiesByKind,
  getPropertyById,
  updatePropertyById,
} from "../database/properties.js";
import { requireAuth } from "../middleware/auth.js";
import dbError from "../utils/dbError.js";

const properties = new Hono({ strict: false });

properties.get("/", async (c) => {
  try {
    const properties = await getProperties(c.get("supabase"), {
      maxPrice: Number(c.req.query("maxprice")) || undefined,
      location: c.req.query("location"),
      maxGuests: Number(c.req.query("maxguests")) || undefined,
    });
    return c.json(properties);
  } catch (e) {
    console.warn("Error in fetching properties from SB database", e);
    return c.json([]);
  }
});

properties.get("/kind/:kind", propertyParamValidator, async (c) => {
  const kind = c.req.valid("param").kind;
  try {
    const properties = await getPropertiesByKind(c.get("supabase"), kind, {
      maxPrice: Number(c.req.query("maxprice")) || undefined,
      location: c.req.query("location"),
      maxGuests: Number(c.req.query("maxguests")) || undefined,
    });
    return c.json(properties);
  } catch (e) {
    console.warn("Error in fetching properties from SB database", e);
    return dbError(c, e);
  }
});

// individuell GET hämta en Property om den finns baserat på ID annars null 404
properties.get("/:id", async (c) => {
  const propertyId = c.req.param("id");
  try {
    const property = await getPropertyById(c.get("supabase"), propertyId);
    return c.json(property);
  } catch (e) {
    console.warn("Error in fetching property from SB database", e);
    return dbError(c, e);
  }
});

// "Skpande" av en Propery POST genom en JSON body använd Postman eller thunderclient för detta
properties.post("/", requireAuth, propertyValidator, async (c) => {
  const propertyBody: NewProperty = c.req.valid("json");
  try {
    const property = await createProperty(c.get("supabase"), propertyBody);
    return c.json(property, 201);
  } catch (e) {
    console.warn("error in inserting property into SB DB", e);
    return dbError(c, e);
  }
});

// Extra: "Updaterande" av en Property PUT/PATCH (för patch kolla Partial types)
// om den finns tänk en blandning mellan GET + POST
properties.patch("/:id", requireAuth, propertyOptionalValidator, async (c) => {
  const propertyId = c.req.param("id");
  const propertyBody: Partial<Property> = c.req.valid("json");
  try {
    const property = await updatePropertyById(
      c.get("supabase"),
      propertyId,
      propertyBody,
    );
    return c.json(property);
  } catch (e) {
    console.log("Error updating property in SB DB", e);
    return dbError(c, e);
  }
});

// Extra: "bortagning" av en Property DELETE om den finns tänk en GET som sedan tar bort 200/204
properties.delete("/:id", requireAuth, async (c) => {
  const propertyId = c.req.param("id");
  if (!propertyId) {
    return c.json({ error: "Property ID is required" }, 400);
  }

  try {
    await deletePropertyById(c.get("supabase"), propertyId);
    return c.body(null, 204);
  } catch (e) {
    console.warn("Error in deleting property", e);
    return dbError(c, e);
  }
});
export default properties;
