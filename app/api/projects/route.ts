import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createEmptySessionData } from "@/lib/types/session";
import { DEFAULT_OUTPUTS } from "@/lib/constants/phases";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: projects } = await supabase
    .from("projects")
    .select("id, title, current_phase, completed_phases, updated_at")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  return NextResponse.json(projects || []);
}

export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: project, error } = await supabase
    .from("projects")
    .insert({
      user_id: user.id,
      title: "새 비즈니스 전략",
      current_phase: 0,
      completed_phases: [],
      current_phase_substeps: {},
      session_data: createEmptySessionData(),
      outputs: DEFAULT_OUTPUTS,
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(project);
}
