import { createClient } from "@/lib/supabase/client";
import type { Note, Checkbox, Attachment } from "@/types";

const supabase = createClient();

// 数据库 Note 类型（snake_case）
interface DbNote {
  id: string;
  user_id: string;
  section_id: string;
  title: string;
  content: string;
  color: "white" | "cream" | "yellow" | "aged";
  line_style: "blue" | "gray" | "none";
  bookmarked: boolean;
  checkboxes: Checkbox[];
  attachments: Attachment[];
  created_at: string;
  updated_at: string;
}

// 转换：数据库 -> 前端
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

// 转换：前端 -> 数据库（用于更新）
function noteToDbUpdate(note: Note): Partial<DbNote> {
  return {
    title: note.title,
    content: note.content,
    color: note.color,
    line_style: note.lineStyle,
    bookmarked: note.bookmarked,
    checkboxes: note.checkboxes,
    attachments: note.attachments,
  };
}

// 获取用户的所有笔记
export async function getNotes(sectionId?: string) {
  let query = supabase.from("notes").select("*");

  if (sectionId) {
    query = query.eq("section_id", sectionId);
  }

  const { data, error } = await query.order("created_at", { ascending: false });

  if (error) {
    return { notes: [], error: error.message };
  }

  const notes = (data as DbNote[]).map(dbToNote);
  return { notes, error: null };
}

// 创建新笔记
export async function createNote(sectionId: string, note: Partial<Note>) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { note: null, error: "Not authenticated" };
  }

  const { data, error } = await supabase
    .from("notes")
    .insert({
      user_id: user.id,
      section_id: sectionId,
      title: note.title || "",
      content: note.content || "",
      color: note.color || "white",
      line_style: note.lineStyle || "blue",
      bookmarked: note.bookmarked || false,
      checkboxes: note.checkboxes || [],
      attachments: note.attachments || [],
    })
    .select()
    .single();

  if (error) {
    return { note: null, error: error.message };
  }

  return { note: dbToNote(data as DbNote), error: null };
}

// 更新笔记
export async function updateNote(noteId: string, note: Note) {
  const { data, error } = await supabase
    .from("notes")
    .update(noteToDbUpdate(note))
    .eq("id", noteId)
    .select()
    .single();

  if (error) {
    return { note: null, error: error.message };
  }

  return { note: dbToNote(data as DbNote), error: null };
}

// 检查是否为有效 UUID
function isValidUUID(id: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}

// 批量保存笔记（自动判断创建或更新）
export async function updateNotes(notes: Note[], sectionId?: string) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  const errors: string[] = [];
  const savedNotes: Note[] = [];

  for (const note of notes) {
    // 如果 ID 不是有效 UUID，则创建新记录
    if (!isValidUUID(note.id)) {
      // 需要 sectionId 来创建新笔记
      if (!sectionId) {
        // 尝试获取用户的第一个 section
        const { data: sections } = await supabase
          .from("sections")
          .select("id")
          .eq("user_id", user.id)
          .limit(1);

        if (!sections || sections.length === 0) {
          errors.push(`No section found for note "${note.title}"`);
          continue;
        }
        sectionId = sections[0].id;
      }

      const { note: newNote, error } = await createNote(sectionId!, note);
      if (error) {
        errors.push(`Failed to create note "${note.title}": ${error}`);
      } else if (newNote) {
        savedNotes.push(newNote);
      }
    } else {
      // UUID 有效，更新现有记录
      const { note: updatedNote, error } = await updateNote(note.id, note);
      if (error) {
        errors.push(`Failed to update note "${note.title}": ${error}`);
      } else if (updatedNote) {
        savedNotes.push(updatedNote);
      }
    }
  }

  return {
    success: errors.length === 0,
    notes: savedNotes,
    error: errors.length > 0 ? errors.join("; ") : null,
  };
}

// 删除笔记
export async function deleteNote(noteId: string) {
  const { error } = await supabase.from("notes").delete().eq("id", noteId);

  return { success: !error, error: error?.message || null };
}

// 保存笔记（创建或更新）
export async function saveNote(
  sectionId: string,
  note: Note,
  isNew: boolean = false
) {
  if (isNew) {
    return createNote(sectionId, note);
  }
  return updateNote(note.id, note);
}
