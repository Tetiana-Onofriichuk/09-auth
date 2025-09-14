export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  tag: "Work" | "Personal" | "Meeting" | "Shopping" | "Todo";
}

export type NoteId = Note["id"];
export type Tag = Note["tag"]; // існуючий тип
export type SortBy = "title" | "createdAt" | "updatedAt";

export const CATEGORIES = [
  "All",
  "Todo",
  "Work",
  "Personal",
  "Meeting",
  "Shopping",
] as const;

export type Category = (typeof CATEGORIES)[number];
export type CategoryNoAll = Exclude<Category, "All">;

// ✅ додай визначення NoteTag
export type NoteTag = Tag;

export interface NewNoteData {
  title: string;
  content?: string;
  tag: NoteTag; // тепер тип існує
}

export const enum Routes {
  Home = "/",
  NoteDetails = "/notes/",
  NotesFilter = `/notes/filter/`,
  NoteAction = "/notes/action/",
  NoteCreate = `${NoteAction}create/`,
  SignIn = "/sign-in",
  SignUp = "/sign-up",
  Profile = "/profile",
  ProfileEdit = `${Profile}/edit`,
}
