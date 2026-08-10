"use client";

import { useDeferredValue, useState } from "react";
import { Search } from "lucide-react";
import type { AtlasTopic, LearningDomain } from "@/modules/learning/types";

const domainLabels: Record<LearningDomain, string> = {
  architecture: "Mimari ve pattern",
  backend: "Backend",
  data: "Veri",
  frontend: "Frontend",
  security: "Güvenlik",
  reliability: "Güvenilirlik",
  delivery: "Teslimat",
  ai: "AI mühendisliği",
};

const difficultyLabels: Record<AtlasTopic["difficulty"], string> = {
  foundation: "Temel",
  intermediate: "Orta",
  advanced: "İleri",
};

function percent(value?: number) {
  return Math.round((value ?? 0) * 100);
}

function evidenceLabel(value: number) {
  if (value === 0) return "değerlendirilmedi";
  if (value < 35) return "ilk kanıt";
  if (value < 70) return "gelişiyor";
  return "güçlü";
}

export default function LearningAtlasView({ topics }: { topics: AtlasTopic[] }) {
  const [query, setQuery] = useState("");
  const [domain, setDomain] = useState<LearningDomain | "all">("all");
  const deferredQuery = useDeferredValue(query.trim().toLocaleLowerCase("tr-TR"));
  const titleBySlug = new Map(topics.map((topic) => [topic.slug, topic.title]));
  const filtered = topics.filter((topic) => {
    const matchesDomain = domain === "all" || topic.domain === domain;
    const haystack = `${topic.title} ${topic.category} ${topic.summary}`.toLocaleLowerCase("tr-TR");
    return matchesDomain && (!deferredQuery || haystack.includes(deferredQuery));
  });

  return (
    <div className="academy-atlas">
      <div className="academy-atlas-tools">
        <label>
          <Search aria-hidden="true" size={16} />
          <span className="sr-only">Kavram ara</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Pattern, failure mode veya kavram ara"
          />
        </label>
        <div role="group" aria-label="Alan filtresi">
          <button
            type="button"
            data-active={domain === "all"}
            aria-pressed={domain === "all"}
            onClick={() => setDomain("all")}
          >
            Tümü
          </button>
          {(Object.entries(domainLabels) as [LearningDomain, string][]).map(([key, label]) => (
            <button
              type="button"
              key={key}
              data-active={domain === key}
              aria-pressed={domain === key}
              onClick={() => setDomain(key)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="academy-atlas-legend">
        <span><i data-state="explain" /> Açıklama kanıtı</span>
        <span><i data-state="diagnose" /> Teşhis kanıtı</span>
        <span><i data-state="apply" /> Uygulama kanıtı</span>
        <span><i data-state="transfer" /> Transfer kanıtı</span>
        <strong role="status" aria-live="polite">{filtered.length} kavram</strong>
      </div>

      <div className="academy-atlas-list">
        {filtered.length === 0 ? (
          <div className="academy-empty-state">
            <p>Aramanın veya alan filtresinin sonucunda kavram bulunamadı.</p>
            <span>Filtreleri temizleyip tüm atlası görüntüleyebilirsin.</span>
          </div>
        ) : (
        filtered.map((topic, index) => {
          const explain = percent(topic.mastery?.recall);
          const diagnose = percent(topic.mastery?.conditional);
          const apply = percent(topic.mastery?.application);
          const transfer = percent(topic.mastery?.transfer);
          return (
            <details key={topic.slug} className="academy-atlas-topic">
              <summary>
                <span className="academy-atlas-index">{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <p>{domainLabels[topic.domain]} / {topic.category}</p>
                  <h2>{topic.title}</h2>
                </div>
                {topic.patternWeight >= 4 && <span className="academy-pattern-stamp">Pattern lens</span>}
                <div className="academy-mastery-bars" aria-label="Kavram kanıt seviyeleri">
                  {[
                    { short: "E", label: "Açıklama", value: explain },
                    { short: "D", label: "Teşhis", value: diagnose },
                    { short: "A", label: "Uygulama", value: apply },
                    { short: "T", label: "Transfer", value: transfer },
                  ].map((item) => (
                    <span
                      key={item.short}
                      role="progressbar"
                      aria-label={`${item.label} kanıtı`}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={item.value}
                      aria-valuetext={evidenceLabel(item.value)}
                      style={{ "--mastery": `${item.value}%` } as React.CSSProperties}
                    >
                      {item.short} {evidenceLabel(item.value)}
                    </span>
                  ))}
                </div>
              </summary>
              <div className="academy-atlas-detail">
                <p>{topic.summary}</p>
                <dl>
                  <div><dt>Zorluk</dt><dd>{difficultyLabels[topic.difficulty]}</dd></div>
                  <div><dt>Ön koşul</dt><dd>{topic.prerequisites.length ? topic.prerequisites.map((slug) => titleBySlug.get(slug) ?? slug).join(", ") : "Doğrudan başlanabilir"}</dd></div>
                  <div><dt>Yakın kavramlar</dt><dd>{topic.related.slice(0, 4).map((slug) => titleBySlug.get(slug) ?? slug).join(", ")}</dd></div>
                  <div><dt>Kanıt sayısı</dt><dd>{topic.mastery?.exposureCount ?? 0} oturum</dd></div>
                </dl>
              </div>
            </details>
          );
        })
        )}
      </div>
    </div>
  );
}
