import { createHash } from "node:crypto";

function normalize(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(normalize);

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, nestedValue]) => [key, normalize(nestedValue)]),
    );
  }

  if (typeof value === "string") return value.normalize("NFC");
  return value;
}

export function stableJson(value: unknown) {
  return JSON.stringify(normalize(value));
}

export function fingerprint(value: unknown) {
  return createHash("sha256").update(stableJson(value)).digest("hex");
}

export function createArticleReuseKey(input: {
  topicRevisionHash: string;
  locale: string;
  level: string;
  schemaVersion: number;
  pedagogyVersion: number;
}) {
  return fingerprint({ fingerprintVersion: 1, scope: "global", ...input });
}
