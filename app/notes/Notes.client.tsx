"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import css from "@/app/notes/Notes.module.css";
import NoteForm from "@/components/NoteForm/NoteForm";
import NoteList from "@/components/NoteList/NoteList";
import Pagination from "@/components/Pagination/Pagination";
import SearchBox from "@/components/SearchBox/SearchBox";
import Modal from "@/components/Modal/Modal";
import { fetchNotes } from "@/lib/api";

function NotesClient() {
  const [page, setPage] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const { data, isSuccess } = useQuery({
    queryKey: ["notes", page, searchQuery],
    queryFn: () => fetchNotes(page, 12, searchQuery),
    placeholderData: keepPreviousData,
    refetchOnMount: false,
  });

  const handleSearch = useDebouncedCallback((search: string) => {
    setSearchQuery(search);
    setPage(1);
  }, 1000);

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox search={searchQuery} onSearch={handleSearch} />
        {isSuccess && data.totalPages > 1 && (
          <Pagination
            totalPage={data.totalPages}
            currentPage={page}
            onPageChange={setPage}
          />
        )}
        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </header>
      {isSuccess && data.notes.length !== 0 && <NoteList notes={data.notes} />}
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm onClose={() => setIsModalOpen(false)} />
        </Modal>
      )}
    </div>
  );
}

export default NotesClient;
