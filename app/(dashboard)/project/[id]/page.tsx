"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ChatContainer } from "@/components/chat/ChatContainer";
import { PhaseNavBar } from "@/components/phase/PhaseNavBar";
import { PhaseProgress } from "@/components/phase/PhaseProgress";
import type { Project, Message } from "@/lib/types/session";
import { ArrowLeft, FileText } from "lucide-react";
import Link from "next/link";

export default function ProjectPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  const supabase = createClient();

  const [project, setProject] = useState<Project | null>(null);
  const [messages, setMessages] = useState<Array<{ id: string; role: "user" | "assistant"; content: string }>>([]);
  const [loading, setLoading] = useState(true);

  const loadProject = useCallback(async () => {
    const { data: proj } = await supabase
      .from("projects")
      .select("*")
      .eq("id", projectId)
      .single();

    if (proj) {
      setProject(proj as Project);
    }
  }, [projectId, supabase]);

  useEffect(() => {
    async function load() {
      await loadProject();

      const { data: msgs } = await supabase
        .from("messages")
        .select("*")
        .eq("project_id", projectId)
        .order("created_at", { ascending: true });

      if (msgs && msgs.length > 0) {
        setMessages(
          msgs.map((m: Message) => ({
            id: m.id,
            role: m.role as "user" | "assistant",
            content: m.content,
          }))
        );
      }

      setLoading(false);
    }
    load();
  }, [projectId, supabase, loadProject]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground text-sm">불러오는 중...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground text-sm">프로젝트를 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <header className="border-b px-4 py-2 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/")}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <h1 className="text-sm font-medium">{project.title}</h1>
        </div>
        <Link
          href={`/project/${projectId}/outputs`}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
        >
          <FileText className="h-3.5 w-3.5" />
          산출물
        </Link>
      </header>

      <PhaseNavBar
        currentPhase={project.current_phase}
        completedPhases={project.completed_phases}
      />

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col">
          <ChatContainer
            projectId={projectId}
            initialMessages={messages}
            onPhaseUpdate={loadProject}
          />
        </div>

        <aside className="w-64 border-l overflow-y-auto hidden lg:block">
          <PhaseProgress
            currentPhase={project.current_phase}
            substeps={project.current_phase_substeps}
          />
        </aside>
      </div>
    </div>
  );
}
