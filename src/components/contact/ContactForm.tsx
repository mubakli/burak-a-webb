"use client";

import { useState } from "react";
import { Send } from "lucide-react";

type FormStatus =
  | { state: "idle"; message: "" }
  | { state: "submitting" | "success" | "error"; message: string };

export default function ContactForm() {
  const [status, setStatus] = useState<FormStatus>({ state: "idle", message: "" });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus({ state: "submitting", message: "Sending message..." });

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(formData)),
      });

      if (!response.ok) throw new Error("Request failed");

      form.reset();
      setStatus({
        state: "success",
        message: "Message sent. I will get back to you as soon as I can.",
      });
    } catch {
      setStatus({
        state: "error",
        message: "The message could not be sent. Please use the email link instead.",
      });
    }
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="form-field">
        <label htmlFor="name">Name</label>
        <input id="name" name="name" type="text" autoComplete="name" maxLength={100} required />
      </div>
      <div className="form-field">
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" autoComplete="email" maxLength={200} required />
      </div>
      <div className="form-field">
        <label htmlFor="message">What would you like to discuss?</label>
        <textarea id="message" name="message" rows={6} maxLength={5000} required />
      </div>
      <button className="button-primary" type="submit" disabled={status.state === "submitting"}>
        {status.state === "submitting" ? "Sending..." : "Send message"}
        <Send aria-hidden="true" size={15} />
      </button>
      <p className="form-status" data-state={status.state} aria-live="polite">
        {status.message}
      </p>
    </form>
  );
}
