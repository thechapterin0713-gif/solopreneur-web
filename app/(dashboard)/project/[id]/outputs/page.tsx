"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, Download } from "lucide-react";
import { cn } from "@/lib/utils";

interface OutputDoc {
  id: string;
  filename: string;
  content: string;
  status: string;
}

const OUTPUT_FILES = [
  "01_타겟_시장.md",
  "02_오퍼_설계.md",
  "03_포지셔닝.md",
  "04_스토리.md",
  "05_리드_트래픽.md",
  "06_가치사다리_퍼널.md",
  "07_실행계획.md",
  "최종_요약.md",
];

export default function OutputsPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  const supabase = createClient();

  const [documents, setDocuments] = useState<OutputDoc[]>([]);
  const [selectedFile, setSelectedFile] = useState<string>(OUTPUT_FILES[0]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("output_documents")
        .select("id, filename, content, status")
        .eq("project_id", projectId);

      if (data) setDocuments(data as OutputDoc[]);
      setLoading(false);
    }
    load();
  }, [projectId, supabase]);

  const selectedDoc = documents.find((d) => d.filename === selectedFile);

  function handleDownload() {
    if (!selectedDoc) return;
    const blob = new Blob([selectedDoc.content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = selectedDoc.filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground text-sm">불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <header className="border-b px-4 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push(`/project/${projectId}`)}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <h1 className="text-sm font-medium">산출물 문서</h1>
        </div>
        {selectedDoc && (
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
          >
            <Download className="h-3.5 w-3.5" />
            다운로드
          </button>
        )}
      </header>

      <div className="flex-1 flex overflow-hidden">
        <aside className="w-56 border-r overflow-y-auto p-3 space-y-1 shrink-0">
          {OUTPUT_FILES.map((filename) => {
            const doc = documents.find((d) => d.filename === filename);
            const hasContent = doc && doc.content.length > 0;
            return (
              <button
                key={filename}
                onClick={() => setSelectedFile(filename)}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-md text-xs transition-colors",
                  selectedFile === filename
                    ? "bg-primary/10 text-primary font-medium"
                    : "hover:bg-muted text-foreground",
                  !hasContent && "text-muted-foreground"
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="truncate">{filename.replace(".md", "")}</span>
                  {hasContent && (
                    <span
                      className={cn(
                        "text-[10px] px-1.5 py-0.5 rounded-full",
                        doc?.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      )}
                    >
                      {doc?.status === "completed" ? "완료" : "작성중"}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </aside>

        <main className="flex-1 overflow-y-auto p-8">
          {selectedDoc && selectedDoc.content ? (
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {selectedDoc.content}
              </ReactMarkdown>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
              아직 작성되지 않은 문서입니다. 해당 Phase를 진행하면 자동으로 생성됩니다.
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
