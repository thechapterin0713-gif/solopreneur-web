-- 1인 기업 전략 설계 웹앱 DB 스키마
-- Supabase SQL Editor에서 실행

-- 프로젝트 테이블
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL DEFAULT '새 비즈니스 전략',
  current_phase INTEGER NOT NULL DEFAULT 0,
  completed_phases INTEGER[] NOT NULL DEFAULT '{}',
  current_phase_substeps JSONB NOT NULL DEFAULT '{}',
  session_data JSONB NOT NULL DEFAULT '{}',
  outputs JSONB NOT NULL DEFAULT '{
    "01_타겟_시장.md": false,
    "02_오퍼_설계.md": false,
    "03_포지셔닝.md": false,
    "04_스토리.md": false,
    "05_리드_트래픽.md": false,
    "06_가치사다리_퍼널.md": false,
    "07_실행계획.md": false,
    "최종_요약.md": false
  }',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 메시지 테이블
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  phase INTEGER,
  substep TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 산출물 문서 테이블
CREATE TABLE output_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  filename TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  phase INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'in_progress', 'completed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(project_id, filename)
);

-- 인덱스
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_messages_project_id ON messages(project_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);
CREATE INDEX idx_output_documents_project_id ON output_documents(project_id);

-- Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE output_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own projects"
  ON projects FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage messages for their projects"
  ON messages FOR ALL USING (
    project_id IN (SELECT id FROM projects WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can manage documents for their projects"
  ON output_documents FOR ALL USING (
    project_id IN (SELECT id FROM projects WHERE user_id = auth.uid())
  );

-- updated_at 자동 갱신 트리거
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER output_documents_updated_at
  BEFORE UPDATE ON output_documents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
