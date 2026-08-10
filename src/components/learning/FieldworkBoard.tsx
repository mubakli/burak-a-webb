"use client";

import {
  startTransition,
  useEffect,
  useState,
  useSyncExternalStore,
} from "react";
import { useRouter } from "next/navigation";
import { Check, Save } from "lucide-react";
import type { FieldworkEntry } from "@/modules/learning/types";
import {
  readLearningDraft,
  removeLearningDraft,
  subscribeToLearningDrafts,
  writeLearningDraft,
} from "@/components/learning/learningDraftStore";

type FieldworkDraft = Pick<FieldworkEntry, "status" | "evidence"> & {
  baseRevision: number;
};
type FieldworkRecovery = Pick<FieldworkEntry, "status" | "evidence"> & {
  baseRevision: number;
  createdAt: string;
};

function parseDraftMap<T>(raw: string) {
  try {
    const parsed: unknown = JSON.parse(raw);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? (parsed as Record<string, T>)
      : {};
  } catch {
    return {};
  }
}

export default function FieldworkBoard({ initialEntries }: { initialEntries: FieldworkEntry[] }) {
  const router = useRouter();
  const [entries, setEntries] = useState(initialEntries);
  const [savingIds, setSavingIds] = useState<Set<string>>(() => new Set());
  const [dirtyIds, setDirtyIds] = useState<Set<string>>(() => new Set());
  const [messages, setMessages] = useState<Record<string, string>>({});
  const draftStorageKey = "academy-fieldwork-drafts";
  const recoveryStorageKey = "academy-fieldwork-recovery";
  const draftRaw = useSyncExternalStore(
    subscribeToLearningDrafts,
    () => readLearningDraft(draftStorageKey, "{}"),
    () => "{}",
  );
  const recoveryRaw = useSyncExternalStore(
    subscribeToLearningDrafts,
    () => readLearningDraft(recoveryStorageKey, "{}"),
    () => "{}",
  );
  const localDrafts = parseDraftMap<FieldworkDraft>(draftRaw);
  const recoveries = parseDraftMap<FieldworkRecovery>(recoveryRaw);
  const staleDraftRecoveries = Object.fromEntries(
    entries.flatMap((entry) => {
      const draft = localDrafts[entry.sessionId];
      return draft && draft.baseRevision !== entry.revision
        ? [[entry.sessionId, { ...draft, createdAt: new Date().toISOString() }]]
        : [];
    }),
  ) as Record<string, FieldworkRecovery>;
  const activeRecoveries = { ...staleDraftRecoveries, ...recoveries };
  const visibleEntries = entries.map((entry) => ({
    ...entry,
    ...(localDrafts[entry.sessionId]?.baseRevision === entry.revision
      ? localDrafts[entry.sessionId]
      : {}),
  }));

  function writeMap<T>(key: string, value: Record<string, T>) {
    if (Object.keys(value).length === 0) removeLearningDraft(key);
    else writeLearningDraft(key, JSON.stringify(value));
  }

  function removeLocalState(sessionId: string) {
    const nextDrafts = { ...localDrafts };
    delete nextDrafts[sessionId];
    writeMap(draftStorageKey, nextDrafts);
    removeLearningDraft(`academy-dirty:fieldwork:${sessionId}`);
    setDirtyIds((current) => {
      const next = new Set(current);
      next.delete(sessionId);
      return next;
    });
  }

  function updateEntry(sessionId: string, patch: Partial<FieldworkEntry>) {
    setEntries((current) =>
      current.map((entry) => (entry.sessionId === sessionId ? { ...entry, ...patch } : entry)),
    );
  }

  function editEntry(sessionId: string, patch: Partial<FieldworkEntry>) {
    updateEntry(sessionId, patch);
    const current = visibleEntries.find((entry) => entry.sessionId === sessionId);
    if (current) {
      writeMap(draftStorageKey, {
        ...localDrafts,
        [sessionId]: {
          baseRevision: current.revision,
          status: patch.status ?? current.status,
          evidence: patch.evidence ?? current.evidence,
        },
      });
    }
    writeLearningDraft(`academy-dirty:fieldwork:${sessionId}`, "1");
    setDirtyIds((current) => new Set(current).add(sessionId));
    setMessages((current) => ({
      ...current,
      [sessionId]: "Kaydedilmemiş değişiklikler var.",
    }));
  }

  useEffect(() => {
    function warnBeforeUnload(event: BeforeUnloadEvent) {
      if (dirtyIds.size === 0) return;
      event.preventDefault();
    }
    window.addEventListener("beforeunload", warnBeforeUnload);
    return () => window.removeEventListener("beforeunload", warnBeforeUnload);
  }, [dirtyIds]);

  function save(entry: FieldworkEntry) {
    if (entry.status === "applied" && (entry.evidence?.trim().length ?? 0) < 40) {
      setMessages((current) => ({
        ...current,
        [entry.sessionId]: "Kanıt göndermek için en az 40 karakterlik doğrulanabilir bir not yaz.",
      }));
      return;
    }
    if (
      entry.status === "applied" &&
      !entry.immutable &&
      !window.confirm(
        "Bu kanıt gönderildikten sonra değiştirilemez. Gönderip kilitlemek istiyor musun?",
      )
    ) {
      return;
    }
    setSavingIds((current) => new Set(current).add(entry.sessionId));
    setMessages((current) => ({ ...current, [entry.sessionId]: "" }));
    startTransition(async () => {
      try {
        const response = await fetch("/api/learning/fieldwork", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId: entry.sessionId,
            expectedRevision: entry.revision,
            status: entry.status,
            evidence: entry.evidence,
          }),
        });
        const result = (await response.json()) as {
          saved?: boolean;
          revision?: number;
          updatedAt?: string;
          error?: string;
        };
        if (!response.ok || !result.saved) {
          if (response.status === 409) {
            writeMap(recoveryStorageKey, {
              ...activeRecoveries,
              [entry.sessionId]: {
                baseRevision: entry.revision,
                status: entry.status,
                evidence: entry.evidence,
                createdAt: new Date().toISOString(),
              },
            });
            const nextDrafts = { ...localDrafts };
            delete nextDrafts[entry.sessionId];
            writeMap(draftStorageKey, nextDrafts);
            router.refresh();
          }
          throw new Error(result.error ?? "Kanıt kaydedilemedi.");
        }
        updateEntry(entry.sessionId, {
          revision: result.revision ?? entry.revision + 1,
          immutable: entry.status === "applied",
          updatedAt: result.updatedAt ?? new Date().toISOString(),
        });
        setMessages((current) => ({ ...current, [entry.sessionId]: "Kanıt DB'ye kaydedildi." }));
        removeLocalState(entry.sessionId);
      } catch (error) {
        setMessages((current) => ({
          ...current,
          [entry.sessionId]: error instanceof Error ? error.message : "Kanıt kaydedilemedi.",
        }));
      } finally {
        setSavingIds((current) => {
          const next = new Set(current);
          next.delete(entry.sessionId);
          return next;
        });
      }
    });
  }

  function restoreRecovery(entry: FieldworkEntry, recovery: FieldworkRecovery) {
    editEntry(entry.sessionId, {
      status: recovery.status,
      evidence: recovery.evidence,
    });
    if (!entry.immutable) {
      const nextRecoveries = { ...recoveries };
      delete nextRecoveries[entry.sessionId];
      writeMap(recoveryStorageKey, nextRecoveries);
    }
    setMessages((current) => ({
      ...current,
      [entry.sessionId]: entry.immutable
        ? "Yerel taslak görüntülendi; sunucudaki kilitli gönderim değiştirilemez."
        : "Yerel taslak geri yüklendi; gözden geçirip yeniden kaydet.",
    }));
  }

  function discardRecovery(sessionId: string) {
    const nextRecoveries = { ...recoveries };
    delete nextRecoveries[sessionId];
    writeMap(recoveryStorageKey, nextRecoveries);
    removeLocalState(sessionId);
    setMessages((current) => ({
      ...current,
      [sessionId]: "Sunucudaki güncel saha kaydı kullanılıyor.",
    }));
  }

  if (entries.length === 0) {
    return (
      <div className="academy-empty-state">
        <p>Henüz saha görevi oluşmadı.</p>
        <span>İlk günlük oturumun mikro-lab aşaması burada uzun biçimli göreve dönüşecek.</span>
      </div>
    );
  }

  return (
    <div className="academy-fieldwork-list">
      {visibleEntries.map((entry, index) => (
        <article key={entry.sessionId}>
          {activeRecoveries[entry.sessionId] && (
            <div className="academy-fieldwork-recovery" role="alert">
              <strong>Çakışan saha taslağı korundu.</strong>
              <span>Revizyon {activeRecoveries[entry.sessionId].baseRevision} otomatik birleştirilmedi.</span>
              <button
                type="button"
                onClick={() => restoreRecovery(entry, activeRecoveries[entry.sessionId])}
              >
                {entry.immutable ? "Yerel taslağı görüntüle" : "Taslağımı geri yükle"}
              </button>
              <button type="button" onClick={() => discardRecovery(entry.sessionId)}>
                Sunucu sürümünü kullan
              </button>
            </div>
          )}
          <header>
            <span>{String(index + 1).padStart(2, "0")} / {entry.domain}</span>
            <select
              value={entry.status}
              onChange={(event) =>
                editEntry(entry.sessionId, {
                  status: event.target.value as FieldworkEntry["status"],
                })
              }
              aria-label={`${entry.topicTitle} saha durumu`}
              disabled={
                savingIds.has(entry.sessionId) ||
                entry.immutable ||
                Boolean(activeRecoveries[entry.sessionId])
              }
            >
              <option value="not_started">Bekliyor</option>
              <option value="in_progress">Devam ediyor</option>
              <option value="applied">Kanıt incelemeye gönderildi</option>
            </select>
          </header>
          <h2>{entry.topicTitle}</h2>
          <p>{entry.task}</p>
          <div className="academy-fieldwork-done">
            <Check aria-hidden="true" size={17} />
            <span><strong>Bitti sayılır:</strong> {entry.doneWhen}</span>
          </div>
          {entry.immutable && (
            <p className="academy-fieldwork-immutable" role="status">
              Bu öz bildirim gönderildi ve kanıt zincirini korumak için kilitlendi.
            </p>
          )}
          <label htmlFor={`fieldwork-evidence-${entry.sessionId}`}>
            <span>Commit, test çıktısı, ADR veya kendi kanıt notun</span>
            <textarea
              id={`fieldwork-evidence-${entry.sessionId}`}
              rows={5}
              value={entry.evidence ?? ""}
              onChange={(event) => editEntry(entry.sessionId, { evidence: event.target.value })}
              maxLength={4000}
              disabled={savingIds.has(entry.sessionId)}
              readOnly={entry.immutable || Boolean(activeRecoveries[entry.sessionId])}
              aria-describedby={`fieldwork-requirement-${entry.sessionId}`}
            />
            <small id={`fieldwork-requirement-${entry.sessionId}`}>
              İncelemeye gönderim için en az 40 karakter. Bu öz bildirim, doğrulanmış
              mastery sayılmaz. {(entry.evidence?.length ?? 0)} / 4000
            </small>
          </label>
          <footer>
            <small aria-live="polite">
              {messages[entry.sessionId] ||
                (localDrafts[entry.sessionId]?.baseRevision === entry.revision
                  ? "Bu tarayıcıda kaydedilmemiş saha taslağı var."
                  : entry.updatedAt
                    ? "Fieldwork kaydı mevcut"
                    : "Henüz fieldwork kaydı yok")}
            </small>
            <button
              type="button"
              onClick={() => save(entry)}
              disabled={
                savingIds.has(entry.sessionId) ||
                entry.immutable ||
                Boolean(activeRecoveries[entry.sessionId])
              }
            >
              <Save aria-hidden="true" size={14} />
              {savingIds.has(entry.sessionId)
                ? "Kaydediliyor"
                : entry.immutable
                  ? "Kanıt kilitli"
                  : entry.status === "applied"
                    ? "Gönder ve kilitle"
                    : "Taslağı kaydet"}
            </button>
          </footer>
        </article>
      ))}
    </div>
  );
}
