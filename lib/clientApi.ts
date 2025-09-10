import { User } from "@/types/user";
import { FetchNotes, nextServer } from "./api";
import { Note } from "@/types/note";

export const Tags = [
  "All",
  "Todo",
  "Work",
  "Personal",
  "Meeting",
  "Shopping",
] as const;

export type Tags = typeof Tags;

export type SortBy = "created" | "updated";

export type RegisterRequest = {
  email: string;
  password: string;
};

export type EditRequest = {
  email?: string;
  username?: string;
};

interface NewNoteData {
  title: string;
  content: string;
  tag: string;
}

type CheckSessionRequest = {
  success: boolean;
};

export const fetchNotes = async (
  search: string,
  page: number = 1,
  perPage: number = 10,
  tag?: Exclude<Tags[number], "All">,
  sortBy?: SortBy
) => {
  const { data } = await nextServer.get<FetchNotes>("notes", {
    params: {
      search,
      page,
      perPage,
      tag,
      sortBy,
    },
  });
  return data;
};

export const createNote = async (note: NewNoteData) => {
  const { title, content, tag } = note;
  const { data } = await nextServer.post<Note>("notes", {
    title,
    content,
    tag,
  });
  return data;
};

export const fetchNoteById = async (id: string) => {
  const { data } = await nextServer.get<Note>(`notes/${id}`);
  return data;
};

export const deleteNote = async (id: string) => {
  const { data } = await nextServer.delete<Note>(`notes/${id}`);
  return data;
};

export const getCategories = async () => {
  const { data } = await nextServer.get<Tags>("categories");
  return data;
};

export const register = async (userData: RegisterRequest) => {
  const { data } = await nextServer.post<User>("auth/register", userData);
  return data;
};

export const login = async (userData: RegisterRequest) => {
  const { data } = await nextServer.post<User>("auth/login", userData);
  return data;
};

export const checkSession = async () => {
  const { data } = await nextServer.get<CheckSessionRequest>("auth/session");
  return data.success;
};

export const getMe = async () => {
  const { data } = await nextServer.get<User>("users/me");
  return data;
};

export const editMe = async (userData: EditRequest) => {
  const { data } = await nextServer.patch<User>("users/me", userData);
  return data;
};

export const logout = async () => {
  await nextServer.post<Promise<void>>("auth/logout");
};
