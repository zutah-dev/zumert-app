import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const getJobs = createServerFn({ method: "GET" }).handler(async () => {
  const { createClient } = await import("@supabase/supabase-js");
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_KEY!,
    { auth: { persistSession: false } }
  );

  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
});

export const createJob = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        title: z.string().min(1).max(255),
        company: z.string().min(1).max(255),
        location: z.string().max(255).default(""),
        salary: z.string().max(100).default(""),
        type: z.string().max(50).default("Full-time"),
        logo: z.string().max(10).default(""),
        tags: z.array(z.string().max(50)).max(10).default([]),
      })
      .parse(input)
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    const { data: job, error } = await supabase
      .from("jobs")
      .insert({
        ...data,
        user_id: userId,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return job;
  });
