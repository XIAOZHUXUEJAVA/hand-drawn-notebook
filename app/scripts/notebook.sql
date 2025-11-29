-- 1. 用户资料表
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 笔记本表
CREATE TABLE notebooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  cover_color TEXT DEFAULT '#3b82f6',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. 分区表
CREATE TABLE sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  notebook_id UUID REFERENCES notebooks(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#60a5fa',
  icon TEXT DEFAULT '📝',
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. 笔记表 (checkboxes 和 attachments 用 JSONB)
CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  section_id UUID REFERENCES sections(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL DEFAULT '',
  content TEXT DEFAULT '',
  color TEXT DEFAULT 'white' CHECK (color IN ('white', 'cream', 'yellow', 'aged')),
  line_style TEXT DEFAULT 'blue' CHECK (line_style IN ('blue', 'gray', 'none')),
  bookmarked BOOLEAN DEFAULT FALSE,
  checkboxes JSONB DEFAULT '[]',
  attachments JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. 启用 RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE notebooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- 6. RLS 策略 (所有表都用冗余的 user_id，策略统一简单)
-- profiles 需要分开写 INSERT 和 SELECT/UPDATE/DELETE 策略
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete own profile" ON profiles
  FOR DELETE USING (user_id = auth.uid());

CREATE POLICY "Users can manage own notebooks" ON notebooks
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Users can manage own sections" ON sections
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Users can manage own notes" ON notes
  FOR ALL USING (user_id = auth.uid());

-- 7. 自动更新 updated_at 触发器
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER notes_updated_at
  BEFORE UPDATE ON notes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- 8. 索引优化
CREATE INDEX idx_notebooks_user_id ON notebooks(user_id);
CREATE INDEX idx_sections_user_id ON sections(user_id);
CREATE INDEX idx_sections_notebook_id ON sections(notebook_id);
CREATE INDEX idx_notes_user_id ON notes(user_id);
CREATE INDEX idx_notes_section_id ON notes(section_id);