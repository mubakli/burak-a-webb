"use client";

import { useEffect, useRef } from "react";

export default function LearningError({ reset }: { reset: () => void }) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => headingRef.current?.focus(), []);

  return (
    <main className="academy-error" id="academy-primary-content" tabIndex={-1} lang="tr">
      <p>Learning pipeline</p>
      <h1 ref={headingRef} tabIndex={-1}>Çalışma alanı güvenli biçimde durdu.</h1>
      <p>
        İlerleme kaydı veya içerik okunamadığında sessizce devam etmek yerine bu
        sınır gösterilir. Bağlantıyı kontrol edip yeniden deneyebilirsin.
      </p>
      <button type="button" onClick={reset}>Yeniden dene</button>
    </main>
  );
}
