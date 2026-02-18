"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Plus, ArrowRight, LogOut } from "lucide-react";

interface ProjectSummary {
  id: string;
  title: string;
  current_phase: number;
  completed_phases: number[];
  updated_at: string;
}

const PHASE_NAMES = [
  "온보딩",
  "시장 & 타겟",
  "오퍼 설계",
  "포지셔닝",
  "스토리",
  "리드 & 트래픽",
  "가치 사다리",
  "실행 계획",
];

export default function DashboardPage() {
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [user, setUser] = useState<{ email?: string } | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      setUser(user);

      const res = await fetch("/api/projects");
      if (res.ok) {
        setProjects(await res.json());
      }
      setLoading(false);
    }
    load();
  }, [router, supabase.auth]);

  async function handleCreate() {
    setCreating(true);
    const res = await fetch("/api/projects", { method: "POST" });
    if (res.ok) {
      const { id } = await res.json();
      router.push(`/project/${id}`);
    }
    setCreating(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground text-sm">불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b px-6 py-4 flex items-center justify-between">
        <h1 className="text-lg font-bold">1인 기업 전략 설계</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">{user?.email}</span>
          <button onClick={handleLogout} className="text-sm text-muted-foreground hover:text-foreground">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">내 프로젝트</h2>
          <button
            onClick={handleCreate}
            disabled={creating}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
            {creating ? "생성 중..." : "새 프로젝트"}
          </button>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-16 border border-dashed rounded-lg">
            <p className="text-muted-foreground mb-4">아직 프로젝트가 없습니다</p>
            <button
              onClick={handleCreate}
              disabled={creating}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90"
            >
              첫 프로젝트 시작하기
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {projects.map((project) => {
              const progress = Math.round(
                (project.completed_phases.length / 8) * 100
              );
              return (
                <button
                  key={project.id}
                  onClick={() => router.push(`/project/${project.id}`)}
                  className="w-full flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors text-left"
                >
                  <div className="space-y-1">
                    <h3 className="font-medium text-sm">{project.title}</h3>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>
                        Phase {project.current_phase}: {PHASE_NAMES[project.current_phase]}
                      </span>
                      <span>진행률 {progress}%</span>
                      <span>
                        {new Date(project.updated_at).toLocaleDateString("ko-KR")}
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </button>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
