"use client";

import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, KeyRound } from "lucide-react";

export default function LearningLoginForm({ configured }: { configured: boolean }) {
  const router = useRouter();
  const [accessKey, setAccessKey] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [message, setMessage] = useState("");

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!configured) return;
    setStatus("submitting");
    setMessage("");

    startTransition(async () => {
      try {
        const response = await fetch("/api/learning/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ accessKey }),
        });
        const result = (await response.json()) as { error?: string };
        if (!response.ok) {
          throw new Error(
            response.status === 429
              ? "Çok fazla giriş denemesi yapıldı; belirtilen süreden sonra yeniden dene."
              : result.error ?? "Erişim anahtarı doğrulanamadı.",
          );
        }

        router.replace("/learning");
        router.refresh();
      } catch (error) {
        setStatus("error");
        setMessage(
          error instanceof Error ? error.message : "Giriş isteği tamamlanamadı.",
        );
      }
    });
  }

  return (
    <form
      className="academy-login-form"
      onSubmit={submit}
      aria-busy={status === "submitting"}
    >
      <label htmlFor="learning-access-key">Özel erişim anahtarı</label>
      <div>
        <KeyRound aria-hidden="true" size={18} />
        <input
          id="learning-access-key"
          name="accessKey"
          type="password"
          value={accessKey}
          onChange={(event) => setAccessKey(event.target.value)}
          autoComplete="current-password"
          disabled={!configured || status === "submitting"}
          aria-invalid={status === "error"}
          aria-describedby={message ? "learning-login-error" : undefined}
          required
        />
      </div>
      <button type="submit" disabled={!configured || status === "submitting"}>
        {status === "submitting" ? "Doğrulanıyor" : "Çalışma alanına gir"}
        <ArrowRight aria-hidden="true" size={16} />
      </button>
      {!configured && (
        <p role="status">
          Production erişimi için `LEARNING_ACCESS_KEY` ve
          `LEARNING_SESSION_SECRET` yapılandırılmalı.
        </p>
      )}
      {message && <p id="learning-login-error" role="alert">{message}</p>}
    </form>
  );
}
