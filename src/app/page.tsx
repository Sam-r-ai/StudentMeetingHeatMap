import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export default async function Page() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: todos } = await supabase.from("instruments").select();

  return <ul>{todos?.map((todo, i) => <li key={i}>{todo.name}</li>)}</ul>;
}
