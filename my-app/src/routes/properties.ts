import { Hono } from "hono";
import { propertyOptionalValidator, propertyValidator } from "../validators/propertyValidator.js";
import { supabase } from "../lib/supabase.js";

const properties = new Hono({ strict: false });

properties.get("/", async (c) => {
  try {
    const {data, error} = await supabase
    .from("properties")
    .select("*")
    .overrideTypes<Property[], {merge: false}>();

    if(!error){
      return c.json(data)
    }
    throw error

  } catch (e) {
    console.warn("Error is fetching from SB database", e)
      return c.json([])
    }
});

properties.get("/:id", async (c) => {
  const id = c.req.param("id");
  const { data, error} = await supabase
    .from("properties")
    .select("*")
    .eq("property_id", id)
    .maybeSingle();

    if(error){
      return c.json({ error: error.message}, 500)
    }
    if(!data){
      return c.json({ error: "Property not found"}, 404)
    }
    return c.json(data)

});

properties.post("/", propertyValidator, async (c) => {
  const { property_id, ...body }  = c.req.valid("json")
  const { data, error} = await supabase
    .from("properties")
    .insert(body)
    .select()
    .maybeSingle();

    if(error) return c.json({ error: error.message}, 400);
    if(!data) return c.json({ error: "Property not found"}, 404); 
    return c.json(data)
  
});

// Extra: "Updaterande" av en Property PUT/PATCH (för patch kolla Partial types)
// om den finns tänk en blandning mellan GET + POST
properties.patch("/:id", propertyOptionalValidator, async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json<Partial<Omit<Property, "property_id">>>();
  
  if(Object.keys(body).length === 0) {
    return c.json({ error: "No fields to update "}, 400)
  }
  
  const { data, error }  = await supabase
    .from("properties")
    .update(body)
    .eq("property_id", id)
    .select()
    .maybeSingle();

  if(error) return c.json({ error: error.message }, 400);
  if(!data) return c.json({ error: "Property not found"}, 404)
  return c.json(data)
})

properties.delete("/:id", async (c) => {
  const id = c.req.param("id");
  const { data, error } = await supabase
    .from("properties")
    .delete()
    .eq("property_id", id)
    .select()

  if(error) return c.json({ error: error.message }, 500);
  if(!data || data.length === 0) return c.json({ error: "Property not found"}, 404)
  return c.body(null, 204)    
});
export default properties;