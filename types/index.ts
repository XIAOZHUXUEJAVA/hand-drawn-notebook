export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  color: 'white' | 'cream' | 'yellow' | 'aged';
  lineStyle: 'blue' | 'gray' | 'none';
  bookmarked: boolean;
  attachments: Attachment[];
  checkboxes: Checkbox[];
}

export interface Checkbox {
  id: string;
  text: string;
  checked: boolean;
  position: { x: number; y: number };
}

export interface Attachment {
  id: string;
  type: 'image' | 'file' | 'link';
  name: string;
  url: string;
  position: { x: number; y: number };
  rotation: number;
}

export interface Section {
  id: string;
  name: string;
  color: string;
  notes: Note[];
  icon?: string;
}

export interface Notebook {
  id: string;
  name: string;
  coverColor: string;
  sections: Section[];
  createdAt: Date;
}

export type Tool = 'pen' | 'pencil' | 'ink' | 'eraser' | 'highlighter' | 'select';

export interface ToolbarState {
  activeTool: Tool;
  penColor: string;
  penSize: number;
}
