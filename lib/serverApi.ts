import { cookies } from "next/headers";
import { FetchNotes, nextServer } from "./api";
import { User } from "@/types/user";
import { SortBy, Tags } from "./clientApi";
import { Note } from "@/types/note";

export const fetchServerNotes = async (
  search: string,
  page: number = 1,
  perPage: number = 10,
  tag?: Exclude<Tags[number], "All">,
  sortBy?: SortBy
) => {
  const cookieStore = await cookies();
  const { data } = await nextServer.get<FetchNotes>("notes", {
    params: {
      search,
      page,
      perPage,
      tag,
      sortBy,
    },
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return data;
};

export const fetchServerNoteById = async (id: string) => {
  const cookieStore = await cookies();
  const { data } = await nextServer.get<Note>(`notes/${id}`, {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return data;
};

export const checkServerSession = async () => {
  const cookieStore = await cookies();
  const response = await nextServer.get("auth/session", {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return response;
};

export const getServerMe = async () => {
  const cookieStore = await cookies();
  const { data } = await nextServer.get<User>("users/me", {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return data;
};
