import { describe, expect, it } from "vitest";
import {
  createArticleReuseKey,
  fingerprint,
  stableJson,
} from "@/modules/learning/fingerprint";

describe("shared content fingerprints", () => {
  it("is stable across object key order", () => {
    expect(stableJson({ beta: 2, alpha: { z: 3, a: 1 } })).toBe(
      stableJson({ alpha: { a: 1, z: 3 }, beta: 2 }),
    );
    expect(fingerprint({ beta: 2, alpha: 1 })).toBe(
      fingerprint({ alpha: 1, beta: 2 }),
    );
  });

  it("reuses the same canonical article requirement", () => {
    const requirement = {
      topicRevisionHash: "topic-revision-a",
      locale: "tr-TR",
      level: "foundation",
      schemaVersion: 2,
      pedagogyVersion: 2,
    };

    expect(createArticleReuseKey(requirement)).toBe(
      createArticleReuseKey({ ...requirement }),
    );
  });

  it("invalidates reuse when knowledge or pedagogy changes", () => {
    const base = {
      topicRevisionHash: "topic-revision-a",
      locale: "tr-TR",
      level: "foundation",
      schemaVersion: 2,
      pedagogyVersion: 2,
    };

    expect(createArticleReuseKey(base)).not.toBe(
      createArticleReuseKey({ ...base, topicRevisionHash: "topic-revision-b" }),
    );
    expect(createArticleReuseKey(base)).not.toBe(
      createArticleReuseKey({ ...base, pedagogyVersion: 3 }),
    );
  });
});
