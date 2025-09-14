"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import css from "./Notesclient.module.css";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchNotes, type NotesHttpResponse } from "@/lib/api/clientApi";
import NoteList from "@/components/NoteList/NoteList";
import Pagination from "@/components/Pagination/Pagination";
import SearchBox from "@/components/SearchBox/SearchBox";
import { type CategoryNoAll } from "@/types/note";

type NotesClientProps = {
  initialData: NotesHttpResponse;
  initialTag?: CategoryNoAll;
};

const PER_PAGE = 8;

export default function NotesClient({
  initialData,
  initialTag,
}: NotesClientProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [tag, setTag] = useState<CategoryNoAll | undefined>(initialTag);

  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput.trim());
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(t);
  }, [searchInput, initialTag]);

  useEffect(() => {
    setTag(initialTag);
    setCurrentPage(1);
  }, [initialTag]);

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ["notes", search, currentPage, tag ?? null],
    queryFn: () => fetchNotes(search, currentPage, tag),
    placeholderData: keepPreviousData,
    initialData,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: 30_000,
  });

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 1;
  const hasResults = notes.length > 0;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onSearch={setSearchInput} />
        <Link
          href="/notes/action/create"
          className={css.button}
          aria-label="Create a new note"
        >
          Create note +
        </Link>
      </header>

      <main className="notes-list">
        {isLoading && !data && <p>Loading…</p>}
        {isError && <p>Something went wrong.</p>}
        {!!data && <NoteList notes={notes} />}

        {hasResults && totalPages > 1 && (
          <Pagination
            pageCount={totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        )}

        {isFetching && !isLoading && <p>Updating…</p>}
      </main>
    </div>
  );
}
