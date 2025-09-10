"use client";

import { ApiError } from "@/app/api/api";
import { Routes } from "@/types/note";
import { login, RegisterRequest } from "@/lib/clientApi";
import { useAuthStore } from "@/lib/store/authStore";
import Form from "next/form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import css from "./SignIn.module.css";
import toast from "react-hot-toast";

const SignIn = () => {
  const router = useRouter();
  const [error, setError] = useState("");
  const setUser = useAuthStore((state) => state.setUser);

  const handleSubmit = async (formData: FormData) => {
    setError("");
    try {
      const formValues = Object.fromEntries(formData) as RegisterRequest;
      const response = await login(formValues);
      if (response) {
        setUser(response);
        toast.success("You have successfully logged in!");
        router.push(Routes.Profile);
      } else {
        setError("Invalid email or password");
      }
    } catch (e) {
      const error = e as ApiError;
      setError(
        error.response?.data?.error ?? error.message ?? "Oops... some error"
      );
    }
  };

  return (
    <main className={css.mainContent}>
      <Form className={css.form} action={handleSubmit}>
        <h1 className={css.formTitle}>Sign in</h1>

        <div className={css.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            className={css.input}
            required
          />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            className={css.input}
            required
          />
        </div>

        <div className={css.actions}>
          <button type="submit" className={css.submitButton}>
            Log in
          </button>
        </div>

        {error && <p className={css.error}>{error}</p>}
      </Form>
    </main>
  );
};

export default SignIn;
