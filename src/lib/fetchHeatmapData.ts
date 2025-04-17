import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export async function fetchHeatmapData(majors: string[]) {
  const { data, error } = await supabase
    .from("heatmap_view")
    .select("*")
    .in("major_abbr", majors);

  if (error) throw new Error(error.message);
  return data;
}
