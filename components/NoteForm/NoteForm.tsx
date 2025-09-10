"use client";

import css from "./NoteForm.module.css";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote, getCategories, Tags } from "@/lib/clientApi";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { NewNoteData, useNoteDraftStore } from "@/lib/store/noteStore";
import Form from "next/form";
import { useEffect, useState } from "react";
import { Routes } from "@/types/note";

export default function NoteForm() {
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { draft, setDraft, clearDraft } = useNoteDraftStore();
  const [categories, setCategories] = useState<Tags>(Tags);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await getCategories();
      setCategories(data);
    };
    fetchCategories();
  }, []);

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setDraft({
      ...draft,
      [event.target.name]: event.target.value,
    });
  };

  const onCancel = () => {
    router.push(Routes.NotesFilter + "All");
  };

  const formScheme = Yup.object().shape({
    title: Yup.string()
      .min(3, "Title must be at least 3 characters")
      .max(50, "Title must be less or equal to 50 characters")
      .required("Title is required"),
    content: Yup.string()
      .max(500, "Content must be less or equal to 500 characters")
      .default(""),
    tag: Yup.string().oneOf(categories).default("Todo"),
  });

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      clearDraft();
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      router.push(Routes.NotesFilter + "All");
      toast.success("Note has been successfully created!");
    },
    onError: () => {
      toast.error("Error occured while creating note!");
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  const onFormSubmit = async (formData: FormData) => {
    setIsLoading(true);
    try {
      const values = Object.fromEntries(formData) as unknown as NewNoteData;
      const validatedValues = await formScheme.validate(values, {
        abortEarly: false,
      });
      setErrors({});
      mutate(validatedValues);
    } catch (errors) {
      if (errors instanceof Yup.ValidationError) {
        const newErrors: Record<string, string> = {};
        errors.inner.forEach((error) => {
          if (error.path) newErrors[error.path] = error.message;
        });
        setErrors(newErrors);
      }
      setIsLoading(false);
    }
  };

  return (
    <Form action={onFormSubmit} className={css.form}>
      {/* Примітивний індикатор завантаження */}
      {isLoading && <div className={css.loader}>Loading…</div>}

      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          type="text"
          name="title"
          id="title"
          defaultValue={draft.title}
          onChange={handleChange}
          className={css.input}
          disabled={isLoading}
        />
        {errors?.title && <span className={css.error}>{errors.title}</span>}
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          name="content"
          id="content"
          rows={8}
          defaultValue={draft.content}
          onChange={handleChange}
          className={css.textarea}
          disabled={isLoading}
        />
        {errors?.content && <span className={css.error}>{errors.content}</span>}
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          name="tag"
          id="tag"
          className={css.select}
          value={draft.tag}
          onChange={handleChange}
          disabled={isLoading}
        >
          {categories
            .filter((tag) => tag !== "All")
            .map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
        </select>
        {errors?.tag && <span className={css.error}>{errors.tag}</span>}
      </div>

      <div className={css.actions}>
        <button
          type="button"
          className={css.cancelButton}
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </button>
        <button type="submit" className={css.submitButton} disabled={isLoading}>
          {isLoading ? "Creating…" : "Create note"}
        </button>
      </div>
    </Form>
  );
}
