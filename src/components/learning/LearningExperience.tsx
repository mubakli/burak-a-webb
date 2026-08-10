"use client";

import {
  startTransition,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  CircleDot,
  Clock3,
  ExternalLink,
  FlaskConical,
  Lightbulb,
  RotateCcw,
  Save,
  ShieldCheck,
} from "lucide-react";
import LearningDiagram from "@/components/learning/LearningDiagram";
import {
  readLearningDraft,
  removeLearningDraft,
  subscribeToLearningDrafts,
  writeLearningDraft,
} from "@/components/learning/learningDraftStore";
import type {
  LearningResponse,
  LearningSessionBundle,
  LearningSessionMode,
} from "@/modules/learning/types";
import {
  MIN_DEEP_LAB_CHARACTERS,
  MIN_EVIDENCE_CHARACTERS,
  canonicalizeCompletionPayload,
  fixedEvidenceStepIds,
  getRequiredLabItems,
  validateLearningCompletion,
} from "@/modules/learning/workflow";

type SessionRecovery = {
  baseRevision: number;
  mode: LearningSessionMode;
  responses: LearningResponse[];
  createdAt: string;
};

const steps = [
  { id: "orientation", label: "Yönelim" },
  { id: "recall:bundle", label: "Geri çağır" },
  { id: "prediction", label: "Vakayı tahmin et" },
  { id: "model", label: "Modeli kur" },
  { id: "example", label: "Karşılaştır" },
  { id: "lab", label: "Mikro-lab" },
  { id: "transfer", label: "Transfer" },
  { id: "reflection", label: "Yansıt" },
  { id: "receipt", label: "Oturum fişi" },
] as const;

function parseDrafts(raw: string, fallback: Record<string, LearningResponse>) {
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return fallback;
    const validEntries = Object.entries(parsed).filter(
      (entry): entry is [string, LearningResponse] => {
        const value = entry[1];
        return (
          typeof value === "object" &&
          value !== null &&
          "stepId" in value &&
          typeof value.stepId === "string" &&
          "updatedAt" in value &&
          typeof value.updatedAt === "string"
        );
      },
    );
    return validEntries.length > 0
      ? { ...fallback, ...Object.fromEntries(validEntries) }
      : fallback;
  } catch {
    return fallback;
  }
}

function parseRecovery(raw: string): SessionRecovery | null {
  try {
    const parsed = JSON.parse(raw) as Partial<SessionRecovery>;
    if (
      typeof parsed.baseRevision !== "number" ||
      !parsed.mode ||
      !["quick", "standard", "deep"].includes(parsed.mode) ||
      !Array.isArray(parsed.responses) ||
      typeof parsed.createdAt !== "string"
    ) {
      return null;
    }
    const responses = parsed.responses.filter(
      (response): response is LearningResponse =>
        Boolean(
          response &&
            typeof response === "object" &&
            typeof response.stepId === "string" &&
            typeof response.updatedAt === "string",
        ),
    );
    return { ...parsed, mode: parsed.mode, responses } as SessionRecovery;
  } catch {
    return null;
  }
}

function writeDrafts(key: string, drafts: Record<string, LearningResponse>) {
  return writeLearningDraft(key, JSON.stringify(drafts));
}

function writeMode(key: string, mode: LearningSessionMode) {
  writeLearningDraft(key, mode);
}

const modeDetails: Record<
  LearningSessionMode,
  { label: string; time: string; evidence: string }
> = {
  quick: {
    label: "Kısa",
    time: "12-18 dk",
    evidence: "Öğrenme döngüsünün kısa uygulaması",
  },
  standard: {
    label: "Standart",
    time: "25-35 dk",
    evidence: "Tam öğrenme döngüsü ve mikro-lab",
  },
  deep: {
    label: "Derin",
    time: "50-75 dk",
    evidence: "Ayrıntılı uygulama planı ve transfer denemesi",
  },
};

function ConfidenceControl({
  value,
  onChange,
  disabled = false,
}: {
  value?: 1 | 2 | 3;
  onChange: (value: 1 | 2 | 3) => void;
  disabled?: boolean;
}) {
  return (
    <fieldset className="academy-confidence">
      <legend>Cevabından önce ne kadar eminsin?</legend>
      {[
        { value: 1 as const, label: "Emin değilim" },
        { value: 2 as const, label: "Kısmen eminim" },
        { value: 3 as const, label: "Eminim" },
      ].map((option) => (
        <label key={option.value}>
          <input
            type="radio"
            name="confidence"
            value={option.value}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
            disabled={disabled}
            required
          />
          <span>{option.label}</span>
        </label>
      ))}
    </fieldset>
  );
}

function responseMap(responses: LearningResponse[]) {
  return Object.fromEntries(responses.map((response) => [response.stepId, response]));
}

export default function LearningExperience({ bundle }: { bundle: LearningSessionBundle }) {
  const router = useRouter();
  const { article, topic, dueReviews, stats } = bundle;
  const [sessionRevision, setSessionRevision] = useState(bundle.session.revision);
  const pendingStorageKey = `academy-session-pending:${bundle.session.id}`;
  const pendingRaw = useSyncExternalStore(
    subscribeToLearningDrafts,
    () => readLearningDraft(pendingStorageKey),
    () => "",
  );
  const pendingDraft = parseRecovery(pendingRaw);
  const modeStorageKey = `academy-session-mode:${bundle.session.id}:${sessionRevision}`;
  const storedMode = useSyncExternalStore(
    subscribeToLearningDrafts,
    () => readLearningDraft(modeStorageKey, bundle.session.mode),
    () => bundle.session.mode,
  );
  const pendingMatchesRevision = pendingDraft?.baseRevision === sessionRevision;
  const candidateMode = pendingMatchesRevision ? pendingDraft.mode : storedMode;
  const mode: LearningSessionMode =
    bundle.session.status === "assigned" &&
    (candidateMode === "quick" || candidateMode === "deep" || candidateMode === "standard")
      ? candidateMode
      : bundle.session.mode;
  const [currentStep, setCurrentStep] = useState(
    bundle.session.status === "completed"
      ? steps.length - 1
      : Math.min(bundle.session.currentStep, steps.length - 1),
  );
  const [maxReached, setMaxReached] = useState(
    bundle.persistence === "preview" ? steps.length - 1 : currentStep,
  );
  const initialDrafts = responseMap(bundle.session.responses);
  const initialDraftsJson = JSON.stringify(initialDrafts);
  const draftStorageKey = `academy-session-draft:${bundle.session.id}:${sessionRevision}`;
  const dirtyStorageKey = `academy-dirty:session:${bundle.session.id}`;
  const storedDrafts = useSyncExternalStore(
    subscribeToLearningDrafts,
    () => readLearningDraft(draftStorageKey, initialDraftsJson),
    () => initialDraftsJson,
  );
  const storedDraftMap = parseDrafts(storedDrafts, initialDrafts);
  const drafts = pendingMatchesRevision
    ? { ...storedDraftMap, ...responseMap(pendingDraft.responses) }
    : storedDraftMap;
  const recoveryKey = `academy-session-recovery:${bundle.session.id}`;
  const recoveryRaw = useSyncExternalStore(
    subscribeToLearningDrafts,
    () => readLearningDraft(recoveryKey),
    () => "",
  );
  const explicitRecovery = parseRecovery(recoveryRaw);
  const recovery =
    explicitRecovery ??
    (pendingDraft && pendingDraft.baseRevision !== sessionRevision
      ? pendingDraft
      : null);
  const initialSignature = JSON.stringify(
    canonicalizeCompletionPayload(bundle.session.mode, bundle.session.responses),
  );
  const currentSignature = JSON.stringify(
    canonicalizeCompletionPayload(mode, Object.values(drafts)),
  );
  const [committedSignature, setCommittedSignature] = useState(initialSignature);
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");
  const [completed, setCompleted] = useState(bundle.session.status === "completed");
  const [saveMessage, setSaveMessage] = useState("");
  const hasFocusedStep = useRef(false);

  const step = steps[currentStep];
  const draft = drafts[step.id];
  const requiredLabItems = getRequiredLabItems(
    mode,
    article.content.lab.steps.length,
  );
  const interactionLocked =
    completed ||
    saveStatus === "saving" ||
    bundle.persistence === "preview" ||
    Boolean(recovery);
  const textControlDisabled = saveStatus === "saving";
  const textControlReadOnly =
    completed || bundle.persistence === "preview" || Boolean(recovery);
  const sourcesUnlocked = completed || currentStep >= 3;
  const hasUnsavedDraft = currentSignature !== committedSignature;
  const persistenceMessage =
    saveMessage ||
    (bundle.persistence === "preview"
      ? "Salt okunur önizleme; DB bağlantısı olmadan ilerleme kaydedilmez."
      : hasUnsavedDraft
        ? "Bu tarayıcıda kaydedilmemiş taslak var; şifreli veya senkronize değil."
        : "Henüz kaydedilmemiş değişiklik yok.");

  function storePendingDraft(
    pendingMode: LearningSessionMode,
    pendingResponses: Record<string, LearningResponse>,
  ) {
    writeLearningDraft(
      pendingStorageKey,
      JSON.stringify({
        baseRevision: sessionRevision,
        mode: pendingMode,
        responses: Object.values(pendingResponses),
        createdAt: new Date().toISOString(),
      } satisfies SessionRecovery),
    );
  }

  function updateMode(nextMode: LearningSessionMode) {
    if (interactionLocked || maxReached > 0) return;
    writeMode(modeStorageKey, nextMode);
    storePendingDraft(nextMode, drafts);
    writeLearningDraft(dirtyStorageKey, "1");
    setSaveStatus("idle");
    setSaveMessage("");
  }

  function restoreRecovery() {
    if (!recovery) return;
    const recoveredDrafts = responseMap(recovery.responses);
    writeDrafts(draftStorageKey, { ...drafts, ...recoveredDrafts });
    if (bundle.session.status === "assigned") {
      writeMode(modeStorageKey, recovery.mode);
    }
    removeLearningDraft(
      `academy-session-draft:${bundle.session.id}:${recovery.baseRevision}`,
    );
    removeLearningDraft(
      `academy-session-mode:${bundle.session.id}:${recovery.baseRevision}`,
    );
    if (completed) {
      writeLearningDraft(recoveryKey, JSON.stringify(recovery));
    } else {
      removeLearningDraft(recoveryKey);
    }
    storePendingDraft(recovery.mode, { ...drafts, ...recoveredDrafts });
    writeLearningDraft(dirtyStorageKey, "1");
    setSaveStatus("idle");
    setSaveMessage(
      completed
        ? "Yerel taslak görüntülemek için geri yüklendi; tamamlanan DB kaydı değiştirilemez."
        : "Çakışan yerel taslak geri yüklendi; gözden geçirip yeniden kaydet.",
    );
  }

  function discardRecovery() {
    if (recovery) {
      removeLearningDraft(
        `academy-session-draft:${bundle.session.id}:${recovery.baseRevision}`,
      );
      removeLearningDraft(
        `academy-session-mode:${bundle.session.id}:${recovery.baseRevision}`,
      );
    }
    removeLearningDraft(draftStorageKey);
    removeLearningDraft(modeStorageKey);
    removeLearningDraft(recoveryKey);
    removeLearningDraft(pendingStorageKey);
    removeLearningDraft(dirtyStorageKey);
    setSaveMessage("Sunucudaki güncel sürüm kullanılmaya devam ediyor.");
  }

  function updateDraft(
    stepId: string,
    patch: Partial<Omit<LearningResponse, "stepId" | "updatedAt">>,
  ) {
    if (interactionLocked) return;
    const nextDrafts = {
      ...drafts,
      [stepId]: {
        ...drafts[stepId],
        ...patch,
        stepId,
        updatedAt: new Date().toISOString(),
      },
    };
    const stored = writeDrafts(draftStorageKey, nextDrafts);
    storePendingDraft(mode, nextDrafts);
    writeLearningDraft(dirtyStorageKey, "1");
    setSaveStatus("idle");
    setSaveMessage(
      stored
        ? "Bu tarayıcıda kaydedilmemiş taslak var; şifreli veya senkronize değil."
        : "Tarayıcı taslağı saklanamadı; bu sayfadan ayrılmadan DB'ye kaydet.",
    );
  }

  useEffect(() => {
    if (!hasFocusedStep.current) {
      hasFocusedStep.current = true;
      try {
        if (window.sessionStorage.getItem("academy-focus-new-topic") !== "1") {
          return;
        }
        window.sessionStorage.removeItem("academy-focus-new-topic");
      } catch {
        return;
      }
    }
    const frame = window.requestAnimationFrame(() => {
      const heading = document.querySelector<HTMLElement>("#academy-stage-title");
      heading?.focus();
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      heading?.scrollIntoView({
        block: "start",
        behavior: reduceMotion ? "auto" : "smooth",
      });
      document
        .querySelector<HTMLElement>('.academy-session-spine [aria-current="step"]')
        ?.scrollIntoView({ block: "nearest", inline: "center" });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [currentStep]);

  useEffect(() => {
    function warnBeforeUnload(event: BeforeUnloadEvent) {
      if (!hasUnsavedDraft) return;
      event.preventDefault();
    }
    window.addEventListener("beforeunload", warnBeforeUnload);
    return () => window.removeEventListener("beforeunload", warnBeforeUnload);
  }, [hasUnsavedDraft]);

  function canContinue() {
    if (step.id === "orientation" || step.id === "model" || step.id === "example") {
      return step.id !== "model" ||
        recallPrompts.every(
          (prompt) => typeof drafts[prompt.id]?.selfRating === "number",
        );
    }
    if (step.id === "lab") {
      return (
        (draft?.checkedItems?.length ?? 0) >= requiredLabItems &&
        (mode !== "deep" ||
          (draft?.answer?.trim().length ?? 0) >= MIN_DEEP_LAB_CHARACTERS)
      );
    }
    if (step.id === "recall:bundle") {
      return recallPrompts.every(
        (prompt) =>
          (drafts[prompt.id]?.answer?.trim().length ?? 0) >=
          MIN_EVIDENCE_CHARACTERS,
      );
    }
    if (step.id === "prediction" || step.id === "transfer") {
      return (
        (draft?.answer?.trim().length ?? 0) >= MIN_EVIDENCE_CHARACTERS &&
        Boolean(draft.confidence)
      );
    }
    if (step.id === "reflection") {
      return (draft?.answer?.trim().length ?? 0) >= MIN_EVIDENCE_CHARACTERS;
    }
    if (step.id === "receipt") return typeof draft?.selfRating === "number";
    return true;
  }

  function persistAndMove(nextStep: number, complete = false) {
    const allowedStepIds = new Set([
      ...fixedEvidenceStepIds,
      ...recallPrompts.map((prompt) => prompt.id),
    ]);
    const allResponses = Object.values(drafts).filter((response) =>
      allowedStepIds.has(response.stepId),
    );
    if (complete) {
      const validation = validateLearningCompletion({
        responses: allResponses,
        mode,
        recallStepIds: recallPrompts.map((prompt) => prompt.id),
        labSteps: article.content.lab.steps,
      });
      if (!validation.valid) {
        setSaveStatus("error");
        setSaveMessage(validation.message);
        const firstInvalid = validation.invalidStepIds[0];
        const invalidIndex = steps.findIndex((candidate) =>
          firstInvalid.startsWith("recall:")
            ? candidate.id === "recall:bundle"
            : candidate.id === firstInvalid,
        );
        if (invalidIndex >= 0) setCurrentStep(invalidIndex);
        return;
      }
    }
    setSaveStatus("saving");
    setSaveMessage("İlerleme veritabanına yazılıyor.");

    startTransition(async () => {
      try {
        const result = await fetch("/api/learning/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId: bundle.session.id,
            expectedRevision: sessionRevision,
            mode,
            currentStep: nextStep,
            responses: allResponses,
            complete,
          }),
        });
        if (result.status === 401) {
          window.location.assign("/learning/login");
          return;
        }
        if (result.status === 409) {
          writeLearningDraft(
            recoveryKey,
            JSON.stringify({
              baseRevision: sessionRevision,
              mode,
              responses: allResponses,
              createdAt: new Date().toISOString(),
            } satisfies SessionRecovery),
          );
          setSaveStatus("error");
          setSaveMessage("Oturum değişti; yerel taslak kurtarma alanına alındı.");
          router.refresh();
          return;
        }
        const saved = (await result.json()) as {
          saved?: boolean;
          revision?: number;
          error?: string;
        };
        if (!result.ok) throw new Error(saved.error ?? "İlerleme kaydedilemedi.");
        if (!saved.saved || typeof saved.revision !== "number") {
          throw new Error("İlerleme kalıcı olarak kaydedilemedi.");
        }

        writeDrafts(
          `academy-session-draft:${bundle.session.id}:${saved.revision}`,
          drafts,
        );
        writeMode(
          `academy-session-mode:${bundle.session.id}:${saved.revision}`,
          mode,
        );
        removeLearningDraft(draftStorageKey);
        removeLearningDraft(modeStorageKey);
        removeLearningDraft(pendingStorageKey);
        setSessionRevision(saved.revision);
        removeLearningDraft(dirtyStorageKey);
        setCommittedSignature(
          JSON.stringify(canonicalizeCompletionPayload(mode, allResponses)),
        );
        setSaveStatus("saved");
        setSaveMessage("Tüm oturum taslakları DB'ye kaydedildi.");
        setCurrentStep(nextStep);
        setMaxReached((current) => Math.max(current, nextStep));
        if (complete) {
          setCompleted(true);
          router.refresh();
        }
      } catch (error) {
        setSaveStatus("error");
        setSaveMessage(
          error instanceof Error ? error.message : "İlerleme kaydedilemedi.",
        );
      }
    });
  }

  function goBack() {
    if (currentStep === 0 || saveStatus === "saving") return;
    setCurrentStep((value) => value - 1);
  }

  function requestAnotherTopic() {
    if (bundle.session.status !== "assigned" || maxReached > 0) return;
    setSaveStatus("saving");
    setSaveMessage("Alternatif konu seçiliyor.");
    startTransition(async () => {
      try {
        const response = await fetch("/api/learning/recommendation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId: bundle.session.id,
            expectedRevision: sessionRevision,
          }),
        });
        if (response.status === 401) {
          window.location.assign("/learning/login");
          return;
        }
        const result = (await response.json()) as {
          changed?: boolean;
          preview?: boolean;
          error?: string;
        };
        if (!response.ok) {
          throw new Error(result.error ?? "Alternatif konu seçilemedi.");
        }
        if (!result.changed) {
          throw new Error(
            result.preview
              ? "DB bağlantısı kesildiği için alternatif konu kalıcı olarak atanamadı."
              : "Alternatif konu atanamadı.",
          );
        }
        try {
          window.sessionStorage.setItem("academy-focus-new-topic", "1");
        } catch {
          // Focus still remains usable through normal document navigation.
        }
        router.refresh();
      } catch (error) {
        setSaveStatus("error");
        setSaveMessage(
          error instanceof Error ? error.message : "Alternatif konu seçilemedi.",
        );
      }
    });
  }

  const recallPrompts =
    dueReviews.length > 0
      ? dueReviews.map((review) => ({
          id: `recall:${review.topicSlug}`,
          title: review.title,
          prompt: review.prompt,
          rubric: review.rubric,
        }))
      : [
          {
            id: "recall:current",
            title: topic.title,
            prompt: `${topic.title} başlığı sana ne çağrıştırıyor? Açıklamayı görmeden önce bildiğin mekanizmayı ve emin olmadığın noktayı yaz.`,
            rubric: article.content.mentalModel,
          },
        ];

  return (
    <div className="academy-session-layout">
      <nav className="academy-session-spine" aria-label="Bugünkü oturum adımları">
        <p>Oturum</p>
        <ol>
          {steps.map((item, index) => (
            <li
              key={item.id}
              data-state={
                index === currentStep
                  ? "current"
                  : bundle.persistence !== "preview" && index <= maxReached
                    ? "done"
                    : "next"
              }
            >
              <button
                type="button"
                onClick={() => index <= maxReached && setCurrentStep(index)}
                disabled={index > maxReached || saveStatus === "saving"}
                aria-current={index === currentStep ? "step" : undefined}
              >
                <span>
                  {bundle.persistence !== "preview" &&
                  index <= maxReached &&
                  index !== currentStep ? (
                    <Check aria-hidden="true" size={12} />
                  ) : (
                    index + 1
                  )}
                </span>
                {item.label}
              </button>
            </li>
          ))}
        </ol>
        <div
          className="academy-session-save"
          data-status={saveStatus}
          role="status"
          aria-live="polite"
        >
          <Save aria-hidden="true" size={13} />
          {persistenceMessage}
        </div>
      </nav>

      <section className="academy-stage" aria-labelledby="academy-stage-title">
        {recovery && (
          <div className="academy-recovery" role="alert">
            <div>
              <strong>Çakışan yerel taslak korundu.</strong>
              <span>
                DB revizyonu değiştiği için revizyon {recovery.baseRevision} üzerindeki
                yanıtlar otomatik birleştirilmedi.
              </span>
            </div>
            <button type="button" onClick={restoreRecovery}>Taslağımı geri yükle</button>
            <button type="button" onClick={discardRecovery}>Sunucu sürümünü kullan</button>
          </div>
        )}
        <header className="academy-stage-meta">
          <span>{String(currentStep + 1).padStart(2, "0")} / {steps.length}</span>
          <span>{step.label}</span>
          <span>{modeDetails[mode].time}</span>
        </header>
        <div
          className="academy-mobile-save"
          data-status={saveStatus}
          role="status"
          aria-live="polite"
        >
          <Save aria-hidden="true" size={13} />
          {persistenceMessage}
        </div>

        {step.id === "orientation" && (
          <div className="academy-stage-content academy-orientation">
            <p className="academy-eyebrow">{topic.category} / {topic.domain}</p>
            <h1 id="academy-stage-title" tabIndex={-1}>{article.content.title}</h1>
            <p className="academy-lead">
              Önce mevcut modelini ve vaka tahminini kaydet; açıklama ve kaynaklar
              daha sonra açılacak.
            </p>

            <div className="academy-why-today">
              <div>
                <CircleDot aria-hidden="true" size={19} />
                <h2>Neden bugün?</h2>
              </div>
              <ul>
                {bundle.session.selectionReasons.map((reason) => (
                  <li key={reason}>{reason}</li>
                ))}
              </ul>
              {bundle.session.status === "assigned" && maxReached === 0 && !completed && (
                <button
                  type="button"
                  onClick={requestAnotherTopic}
                  disabled={saveStatus === "saving" || bundle.persistence === "preview"}
                >
                  Bu konu bugün uygun değil · başka bir karar öner
                </button>
              )}
            </div>

            <fieldset className="academy-mode-selector">
              <legend>Bugün ne kadar derine inebilirsin?</legend>
              {Object.entries(modeDetails).map(([key, details]) => (
                <label key={key} data-selected={mode === key}>
                  <input
                    type="radio"
                    name="mode"
                    value={key}
                    checked={mode === key}
                    onChange={() => updateMode(key as LearningSessionMode)}
                    disabled={interactionLocked || maxReached > 0}
                  />
                  <strong>{details.label}</strong>
                  <span>{details.time}</span>
                  <small>{details.evidence}</small>
                </label>
              ))}
            </fieldset>

            <dl className="academy-session-contract">
              <div><dt>Kanıt</dt><dd>Tahmin + lab + transfer + reflection</dd></div>
              <div>
                <dt>Kaynak</dt>
                <dd>
                  {article.citations.filter((citation) => citation.excerpt).length} alıntı ·{" "}
                  {article.citations.length} referans
                </dd>
              </div>
              <div><dt>İçerik</dt><dd>v{article.version} · {article.origin}</dd></div>
            </dl>
          </div>
        )}

        {step.id === "recall:bundle" && (
          <div className="academy-stage-content academy-attempt-first">
            <p className="academy-eyebrow">Kaynaklar kapalı</p>
            <h1 id="academy-stage-title" tabIndex={-1}>Önce hafızandan getir.</h1>
            <p className="academy-lead">
              Tanıdık gelmesi bilmek değildir. Eksik veya yanlış olsa bile önce
              kendi mevcut modelini görünür kıl.
            </p>
            <div className="academy-prompts">
              {recallPrompts.map((prompt, index) => (
                <div key={prompt.id}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <p><strong>{prompt.title}</strong><br />{prompt.prompt}</p>
                </div>
              ))}
            </div>
            {recallPrompts.map((prompt) => (
              <label className="academy-answer-field" key={`${prompt.id}-answer`}>
                <span>{prompt.title} için yardımsız cevabın</span>
                  <textarea
                  rows={dueReviews.length > 1 ? 5 : 8}
                  maxLength={8000}
                  value={drafts[prompt.id]?.answer ?? ""}
                  onChange={(event) =>
                    updateDraft(prompt.id, { answer: event.target.value })
                  }
                    placeholder="Tanımı değil, mekanizmayı ve nedenini kendi kelimelerinle yaz..."
                    disabled={textControlDisabled}
                    readOnly={textControlReadOnly}
                    required
                  />
                  <small>En az {MIN_EVIDENCE_CHARACTERS} karakter. {drafts[prompt.id]?.answer?.length ?? 0} / 8000</small>
              </label>
            ))}
          </div>
        )}

        {step.id === "prediction" && (
          <div className="academy-stage-content academy-case-stage">
            <p className="academy-eyebrow">Failure case</p>
            <h1 id="academy-stage-title" tabIndex={-1}>Sonucu görmeden karar ver.</h1>
            <blockquote>{article.content.openingCase}</blockquote>
            <div className="academy-prediction-prompt">
              <Lightbulb aria-hidden="true" size={22} />
              <p>{article.content.predictionPrompt}</p>
            </div>
            <ConfidenceControl
              value={draft?.confidence}
              onChange={(confidence) => updateDraft(step.id, { confidence })}
              disabled={interactionLocked}
            />
            <label className="academy-answer-field">
              <span>Hipotezin</span>
              <textarea
                rows={7}
                maxLength={8000}
                value={draft?.answer ?? ""}
                onChange={(event) => updateDraft(step.id, { answer: event.target.value })}
                placeholder="Hangi varsayım kırılıyor? Olaylar hangi sırada gerçekleşiyor?"
                disabled={textControlDisabled}
                readOnly={textControlReadOnly}
                required
              />
              <small>Güven düzeyiyle birlikte en az {MIN_EVIDENCE_CHARACTERS} karakter. {draft?.answer?.length ?? 0} / 8000</small>
            </label>
          </div>
        )}

        {step.id === "model" && (
          <div className="academy-stage-content academy-model-stage">
            <p className="academy-eyebrow">Causal mental model</p>
            <h1 id="academy-stage-title" tabIndex={-1}>{article.content.durablePrinciple}</h1>
            <div className="academy-model-note">
              <ShieldCheck aria-hidden="true" size={21} />
              <p>{article.content.mentalModel}</p>
            </div>
            <p className="academy-lead">{article.content.dek}</p>
            {drafts.prediction?.answer && (
              <aside className="academy-hypothesis-review" aria-label="İlk hipotezinin değerlendirmesi">
                <p>İlk hipotezin</p>
                <blockquote>{drafts.prediction.answer}</blockquote>
                <span>
                  Aşağıdaki modelle karşılaştır: hangi varsayımın doğrulandı, hangisi
                  değişmeli? Yansıtma adımında cevabını yeniden kuracaksın.
                </span>
              </aside>
            )}
            <section className="academy-recall-feedback" aria-labelledby="academy-recall-feedback-title">
              <h2 id="academy-recall-feedback-title">Geri çağırma cevabını kontrol et</h2>
              <p>
                Rubriği cevabınla karşılaştır. Bu öz kontrol denemeyi zamanlar;
                tek başına recall mastery üretmez.
              </p>
              {recallPrompts.map((prompt) => (
                <div key={`${prompt.id}-feedback`}>
                  <h3>{prompt.title}</h3>
                  <blockquote>{drafts[prompt.id]?.answer}</blockquote>
                  <p>{prompt.rubric}</p>
                  <fieldset>
                    <legend>Cevabın rubriğe ne kadar yakındı?</legend>
                    {[
                      { value: 0 as const, label: "Temel mekanizmayı kaçırdım" },
                      { value: 2 as const, label: "Kısmen yakaladım" },
                      { value: 4 as const, label: "Mekanizma ve sınır tutarlı" },
                    ].map((option) => (
                      <label key={option.value}>
                        <input
                          type="radio"
                          name={`recall-check-${prompt.id}`}
                          value={option.value}
                          checked={drafts[prompt.id]?.selfRating === option.value}
                          onChange={() =>
                            updateDraft(prompt.id, { selfRating: option.value })
                          }
                          disabled={interactionLocked}
                          required
                        />
                        <span>{option.label}</span>
                      </label>
                    ))}
                  </fieldset>
                </div>
              ))}
            </section>
            <LearningDiagram diagram={article.content.diagram} />
            <div className="academy-lesson-sections">
              {article.content.sections.map((section) => (
                <section key={section.id}>
                  <h2>{section.heading}</h2>
                  <p>{section.body}</p>
                  {section.evidenceKeys.length > 0 && (
                    <div>
                      {section.evidenceKeys.map((key) => (
                        <a href={`#academy-citation-${key}`} key={key}>[{key}]</a>
                      ))}
                    </div>
                  )}
                </section>
              ))}
            </div>
          </div>
        )}

        {step.id === "example" && (
          <div className="academy-stage-content academy-example-stage">
            <p className="academy-eyebrow">Worked example + contrast</p>
            <h1 id="academy-stage-title" tabIndex={-1}>Aynı görünen kararları ayır.</h1>
            <section className="academy-worked-example">
              <h2>Çözümlü örnek</h2>
              <p>{article.content.workedExample}</p>
            </section>
            <section className="academy-comparison">
              <h2>{article.content.comparison.title}</h2>
              <table>
                <thead>
                  <tr>
                    <th scope="col">Yaklaşım</th>
                    <th scope="col">Ne zaman düşünülür?</th>
                    <th scope="col">Karıştırma riski</th>
                  </tr>
                </thead>
                <tbody>
                  {article.content.comparison.items.map((item) => (
                    <tr key={item.name}>
                      <th scope="row">{item.name}</th>
                      <td>{item.whenToUse}</td>
                      <td>{item.tradeoff}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          </div>
        )}

        {step.id === "lab" && (
          <div className="academy-stage-content academy-lab-stage">
            <p className="academy-eyebrow">Mikro-lab / {modeDetails[mode].label}</p>
            <h1 id="academy-stage-title" tabIndex={-1}>{article.content.lab.title}</h1>
            <p className="academy-lead">{article.content.lab.task}</p>
            <div className="academy-lab-contract">
              <FlaskConical aria-hidden="true" size={24} />
              <p><span>Bitti sayılır:</span> {article.content.lab.doneWhen}</p>
            </div>
            <fieldset className="academy-lab-steps">
              <legend>Ürettiğin kanıtları işaretle</legend>
              {article.content.lab.steps.map((item) => (
                <label key={item}>
                  <input
                    type="checkbox"
                    checked={draft?.checkedItems?.includes(item) ?? false}
                    onChange={(event) => {
                      const current = draft?.checkedItems ?? [];
                      updateDraft(step.id, {
                        checkedItems: event.target.checked
                          ? [...current, item]
                          : current.filter((candidate) => candidate !== item),
                      });
                    }}
                    disabled={interactionLocked}
                  />
                  <span><Check aria-hidden="true" size={14} />{item}</span>
                </label>
              ))}
            </fieldset>
            {mode === "deep" && (
              <label className="academy-answer-field">
                <span>Artefakt bağlantın veya ayrıntılı uygulama planın</span>
                <textarea
                  rows={6}
                  maxLength={8000}
                  value={draft?.answer ?? ""}
                  onChange={(event) => updateDraft(step.id, { answer: event.target.value })}
                  placeholder="Commit/test/ADR bağlantısı veya üreteceğin kanıtın ayrıntılı planı..."
                  disabled={textControlDisabled}
                  readOnly={textControlReadOnly}
                  required
                />
                <small>
                  En az {MIN_DEEP_LAB_CHARACTERS} karakter. {draft?.answer?.length ?? 0} / 8000
                </small>
              </label>
            )}
            <p className="academy-requirement-note">
              Bu modda ilerlemek için en az {requiredLabItems} kanıt işaretlemelisin.
              Bu kayıt exposure kanıtıdır; tek başına mastery veya projede uygulama sayılmaz.
            </p>
          </div>
        )}

        {step.id === "transfer" && (
          <div className="academy-stage-content academy-transfer-stage">
            <p className="academy-eyebrow">Near-to-far transfer</p>
            <h1 id="academy-stage-title" tabIndex={-1}>Şimdi bağlamı değiştir.</h1>
            <div className="academy-transfer-question">
              <RotateCcw aria-hidden="true" size={22} />
              <p>{article.content.transferPrompt}</p>
            </div>
            <ConfidenceControl
              value={draft?.confidence}
              onChange={(confidence) => updateDraft(step.id, { confidence })}
              disabled={interactionLocked}
            />
            <label className="academy-answer-field">
              <span>Yeni bağlamdaki kararın</span>
              <textarea
                rows={8}
                maxLength={8000}
                value={draft?.answer ?? ""}
                onChange={(event) => updateDraft(step.id, { answer: event.target.value })}
                placeholder="Aynı çözümü kopyalama. Hangi varsayımın değiştiğini ve seçimini gerekçelendir..."
                disabled={textControlDisabled}
                readOnly={textControlReadOnly}
                required
              />
              <small>Güven düzeyiyle birlikte en az {MIN_EVIDENCE_CHARACTERS} karakter. {draft?.answer?.length ?? 0} / 8000</small>
            </label>
            <div className="academy-self-rubric">
              <h2>Cevabını şu merceklerle kontrol et</h2>
              <ul>
                {topic.objectives.map((objective) => <li key={objective}>{objective}</li>)}
              </ul>
            </div>
          </div>
        )}

        {step.id === "reflection" && (
          <div className="academy-stage-content academy-reflection-stage">
            <p className="academy-eyebrow">Mental model revision</p>
            <h1 id="academy-stage-title" tabIndex={-1}>Bilgiyi kendi cümlene dönüştür.</h1>
            <blockquote>{article.content.reflectionPrompt}</blockquote>
            <label className="academy-answer-field">
              <span>Modelim + belirsiz nokta + projeye transfer</span>
              <textarea
                rows={10}
                maxLength={8000}
                value={draft?.answer ?? ""}
                onChange={(event) => updateDraft(step.id, { answer: event.target.value })}
                placeholder="Bir ekip arkadaşına nasıl anlatırdın? Nerede hâlâ emin değilsin? Yarın projende neyi kontrol edeceksin?"
                disabled={textControlDisabled}
                readOnly={textControlReadOnly}
                required
              />
              <small>En az {MIN_EVIDENCE_CHARACTERS} karakter. {draft?.answer?.length ?? 0} / 8000</small>
            </label>
            <p className="academy-privacy-note">
              Bu yanıt private learner state içinde tutulur ve ortak makale üretimine
              ya da web araştırmasına dahil edilmez.
            </p>
          </div>
        )}

        {step.id === "receipt" && (
          <div className="academy-stage-content academy-receipt-stage">
            <p className="academy-eyebrow">Session receipt</p>
            <h1 id="academy-stage-title" tabIndex={-1}>
              {completed ? "Bugünün kanıtı kaydedildi." : "Bugünkü bağımsızlığını değerlendir."}
            </h1>
            <p className="academy-lead">
              Doğru görünmek değil, yardım olmadan ne kadar karar verebildiğini
              dürüstçe kaydetmek sonraki review aralığını belirleyecek. Bu puan
              tek başına mastery değerini yükseltmez.
            </p>
            <fieldset className="academy-rating">
              <legend>Yeni bir senaryoda bu kararı ne kadar bağımsız verebilirsin?</legend>
              {[0, 1, 2, 3, 4].map((rating) => (
                <label key={rating} data-selected={draft?.selfRating === rating}>
                  <input
                    type="radio"
                    name="self-rating"
                    value={rating}
                    checked={draft?.selfRating === rating}
                    onChange={() => updateDraft(step.id, { selfRating: rating as 0 | 1 | 2 | 3 | 4 })}
                    disabled={interactionLocked}
                    required
                  />
                  <strong>{rating}</strong>
                  <span>{["Henüz değil", "Yoğun yardımla", "Kısmen", "Bağımsız", "Transfer edebilirim"][rating]}</span>
                </label>
              ))}
            </fieldset>
            <dl className="academy-receipt-grid">
              <div><dt>Konu</dt><dd>{topic.title}</dd></div>
              <div><dt>Üretilen kanıt</dt><dd>{modeDetails[mode].evidence}</dd></div>
              <div><dt>Sonraki adım</dt><dd>Öz değerlendirmene göre gecikmeli review</dd></div>
            </dl>
            {completed && (
              <div className="academy-completed-actions">
                <Link href="/learning/notebook">Kanıt Defteri’ni aç</Link>
                <Link href="/learning/fieldwork">Saha görevine devam et</Link>
              </div>
            )}
          </div>
        )}

        <footer className="academy-stage-controls">
          {saveStatus === "error" && saveMessage && (
            <p className="academy-action-error" role="alert">{saveMessage}</p>
          )}
          <button type="button" onClick={goBack} disabled={currentStep === 0 || saveStatus === "saving"}>
            <ArrowLeft aria-hidden="true" size={16} /> Geri
          </button>
          {completed && currentStep < steps.length - 1 ? (
            <button
              type="button"
              className="academy-primary-action"
              onClick={() => setCurrentStep((value) => value + 1)}
            >
              Salt okunur devam <ArrowRight aria-hidden="true" size={16} />
            </button>
          ) : bundle.persistence === "preview" && currentStep < steps.length - 1 ? (
            <button
              type="button"
              className="academy-primary-action"
              onClick={() => setCurrentStep((value) => value + 1)}
            >
              Önizlemede devam et <ArrowRight aria-hidden="true" size={16} />
            </button>
          ) : currentStep < steps.length - 1 ? (
            <button
              type="button"
              className="academy-primary-action"
              onClick={() => persistAndMove(currentStep + 1)}
              disabled={
                !canContinue() ||
                saveStatus === "saving" ||
                Boolean(recovery)
              }
            >
              Kaydet ve devam et <ArrowRight aria-hidden="true" size={16} />
            </button>
          ) : bundle.persistence === "preview" ? (
            <button type="button" className="academy-primary-action" disabled>
              DB bağlantısı olmadan kanıt kaydedilemez
            </button>
          ) : !completed ? (
            <button
              type="button"
              className="academy-primary-action"
              onClick={() => persistAndMove(currentStep, true)}
              disabled={
                !canContinue() ||
                saveStatus === "saving" ||
                Boolean(recovery)
              }
            >
              Oturum kanıtını kaydet <Check aria-hidden="true" size={16} />
            </button>
          ) : (
            <Link className="academy-primary-link" href="/learning/fieldwork">
              Saha görevini aç <ArrowRight aria-hidden="true" size={16} />
            </Link>
          )}
        </footer>
      </section>

      <aside className="academy-evidence-folio" aria-label="Oturum kaynakları ve provenance bilgisi">
        <header>
          <BookOpen aria-hidden="true" size={17} />
          <div>
            <span>Kanıt folyosu</span>
            <strong>
              {sourcesUnlocked ? `${article.citations.length} kaynak` : "Tahminden sonra açılır"}
            </strong>
          </div>
        </header>
        <div className="academy-folio-stats">
          <div><span>Çalışılan</span><strong>{stats.studiedTopics}</strong></div>
          <div><span>Saha kanıtı</span><strong>{stats.appliedTopics}</strong></div>
          <div><span>Review</span><strong>{stats.dueReviews}</strong></div>
        </div>
        {sourcesUnlocked ? (
          <>
            <section>
              <h2>Kaynaklar</h2>
              {article.citations.map((citation, index) => (
                <a
                  id={`academy-citation-${citation.key}`}
                  href={citation.url}
                  target="_blank"
                  rel="noreferrer"
                  key={citation.key}
                  aria-label={`${citation.label}, yeni sekmede açılır`}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <strong>{citation.label}</strong>
                    <small>
                      {citation.key} · {citation.authority.replace("-", " ")}
                      {citation.publishedAt
                        ? ` · ${citation.publishedAt.slice(0, 10)}`
                        : citation.fetchedAt
                          ? ` · erişim ${citation.fetchedAt.slice(0, 10)}`
                          : ""}
                    </small>
                    {citation.excerpt && <p>{citation.excerpt.slice(0, 220)}...</p>}
                  </div>
                  <ExternalLink aria-hidden="true" size={13} />
                </a>
              ))}
            </section>
            <section>
              <h2>Provenance</h2>
              <dl>
                <div><dt>İçerik</dt><dd>{article.origin}</dd></div>
                <div><dt>Sürüm</dt><dd>{article.version}</dd></div>
                <div><dt>Şema</dt><dd>{article.provenance.schemaVersion}</dd></div>
                <div><dt>Pedagoji</dt><dd>{article.provenance.pedagogyVersion}</dd></div>
              </dl>
            </section>
          </>
        ) : (
          <p className="academy-privacy-note">
            Geri çağırma ve vaka tahmini kaydedilene kadar kaynak bağlantıları gizli tutulur.
          </p>
        )}
        <div className="academy-folio-time">
          <Clock3 aria-hidden="true" size={15} />
          İçerik kaynaklarıyla birlikte sürümlenir; kullanıcı cevabı ortak içeriğe karışmaz.
        </div>
      </aside>
    </div>
  );
}
