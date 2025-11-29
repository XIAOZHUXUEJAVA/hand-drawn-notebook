import { createClient } from "@/lib/supabase/client";
import type { Notebook, Section, Note } from "@/types";

const supabase = createClient();

// 数据库类型
interface DbNotebook {
  id: string;
  user_id: string;
  name: string;
  cover_color: string;
  created_at: string;
}

interface DbSection {
  id: string;
  user_id: string;
  notebook_id: string;
  name: string;
  color: string;
  icon: string;
  order: number;
  created_at: string;
}

interface DbNote {
  id: string;
  user_id: string;
  section_id: string;
  title: string;
  content: string;
  color: "white" | "cream" | "yellow" | "aged";
  line_style: "blue" | "gray" | "none";
  bookmarked: boolean;
  checkboxes: Note["checkboxes"];
  attachments: Note["attachments"];
  created_at: string;
  updated_at: string;
}

// 转换函数
function dbToNote(dbNote: DbNote): Note {
  return {
    id: dbNote.id,
    title: dbNote.title,
    content: dbNote.content,
    color: dbNote.color,
    lineStyle: dbNote.line_style,
    bookmarked: dbNote.bookmarked,
    checkboxes: dbNote.checkboxes || [],
    attachments: dbNote.attachments || [],
    createdAt: new Date(dbNote.created_at),
    updatedAt: new Date(dbNote.updated_at),
  };
}

function dbToSection(dbSection: DbSection, notes: Note[] = []): Section {
  return {
    id: dbSection.id,
    name: dbSection.name,
    color: dbSection.color,
    icon: dbSection.icon,
    notes,
  };
}

function dbToNotebook(
  dbNotebook: DbNotebook,
  sections: Section[] = []
): Notebook {
  return {
    id: dbNotebook.id,
    name: dbNotebook.name,
    coverColor: dbNotebook.cover_color,
    sections,
    createdAt: new Date(dbNotebook.created_at),
  };
}

// 获取用户的所有 notebooks（包含 sections 和 notes）
export async function getNotebooks() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { notebooks: [], error: "Not authenticated" };
  }

  // 获取 notebooks
  const { data: dbNotebooks, error: nbError } = await supabase
    .from("notebooks")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  if (nbError) {
    return { notebooks: [], error: nbError.message };
  }

  // 获取 sections
  const { data: dbSections, error: secError } = await supabase
    .from("sections")
    .select("*")
    .eq("user_id", user.id)
    .order("order", { ascending: true });

  if (secError) {
    return { notebooks: [], error: secError.message };
  }

  // 获取 notes
  const { data: dbNotes, error: noteError } = await supabase
    .from("notes")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (noteError) {
    return { notebooks: [], error: noteError.message };
  }

  // 组装数据
  const notesMap = new Map<string, Note[]>();
  for (const dbNote of (dbNotes as DbNote[]) || []) {
    const sectionId = dbNote.section_id;
    if (!notesMap.has(sectionId)) {
      notesMap.set(sectionId, []);
    }
    notesMap.get(sectionId)!.push(dbToNote(dbNote));
  }

  const sectionsMap = new Map<string, Section[]>();
  for (const dbSection of (dbSections as DbSection[]) || []) {
    const notebookId = dbSection.notebook_id;
    if (!sectionsMap.has(notebookId)) {
      sectionsMap.set(notebookId, []);
    }
    const notes = notesMap.get(dbSection.id) || [];
    sectionsMap.get(notebookId)!.push(dbToSection(dbSection, notes));
  }

  const notebooks: Notebook[] = ((dbNotebooks as DbNotebook[]) || []).map(
    (dbNb) => dbToNotebook(dbNb, sectionsMap.get(dbNb.id) || [])
  );

  return { notebooks, error: null };
}

// 创建 Notebook
export async function createNotebook(
  name: string,
  coverColor: string = "#3b82f6"
) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { notebook: null, error: "Not authenticated" };
  }

  const { data, error } = await supabase
    .from("notebooks")
    .insert({
      user_id: user.id,
      name,
      cover_color: coverColor,
    })
    .select()
    .single();

  if (error) {
    return { notebook: null, error: error.message };
  }

  return { notebook: dbToNotebook(data as DbNotebook, []), error: null };
}

// 创建 Section
export async function createSection(
  notebookId: string,
  name: string,
  color: string = "#60a5fa",
  icon: string = "📝"
) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { section: null, error: "Not authenticated" };
  }

  // 获取当前最大 order
  const { data: existingSections } = await supabase
    .from("sections")
    .select("order")
    .eq("notebook_id", notebookId)
    .order("order", { ascending: false })
    .limit(1);

  const nextOrder =
    existingSections && existingSections.length > 0
      ? existingSections[0].order + 1
      : 0;

  const { data, error } = await supabase
    .from("sections")
    .insert({
      user_id: user.id,
      notebook_id: notebookId,
      name,
      color,
      icon,
      order: nextOrder,
    })
    .select()
    .single();

  if (error) {
    return { section: null, error: error.message };
  }

  return { section: dbToSection(data as DbSection, []), error: null };
}

// 删除 Notebook
export async function deleteNotebook(notebookId: string) {
  const { error } = await supabase
    .from("notebooks")
    .delete()
    .eq("id", notebookId);

  return { success: !error, error: error?.message || null };
}

// 删除 Section
export async function deleteSection(sectionId: string) {
  const { error } = await supabase
    .from("sections")
    .delete()
    .eq("id", sectionId);

  return { success: !error, error: error?.message || null };
}

// 更新 Notebook
export async function updateNotebook(
  notebookId: string,
  updates: { name?: string; coverColor?: string }
) {
  const dbUpdates: Partial<DbNotebook> = {};
  if (updates.name) dbUpdates.name = updates.name;
  if (updates.coverColor) dbUpdates.cover_color = updates.coverColor;

  const { data, error } = await supabase
    .from("notebooks")
    .update(dbUpdates)
    .eq("id", notebookId)
    .select()
    .single();

  if (error) {
    return { notebook: null, error: error.message };
  }

  return { notebook: dbToNotebook(data as DbNotebook), error: null };
}

// 更新 Section
export async function updateSection(
  sectionId: string,
  updates: { name?: string; color?: string; icon?: string }
) {
  const { data, error } = await supabase
    .from("sections")
    .update(updates)
    .eq("id", sectionId)
    .select()
    .single();

  if (error) {
    return { section: null, error: error.message };
  }

  return { section: dbToSection(data as DbSection), error: null };
}
