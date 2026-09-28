import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async (request) => {
  const authorization = request.headers.get("Authorization");
  if (!authorization) {
    return Response.json({ error: "Authentication is required." }, { status: 401 });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !anonKey || !serviceRoleKey) {
    return Response.json({ error: "The function is missing its Supabase configuration." }, { status: 500 });
  }

  const caller = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authorization } },
  });
  const { data: { user }, error: userError } = await caller.auth.getUser();
  if (userError || !user) {
    return Response.json({ error: "Your session is no longer valid." }, { status: 401 });
  }

  const admin = createClient(supabaseUrl, serviceRoleKey);
  const { error } = await admin.auth.admin.deleteUser(user.id);
  if (error) {
    return Response.json({ error: "Unable to delete the account." }, { status: 500 });
  }

  return Response.json({ deleted: true });
});
