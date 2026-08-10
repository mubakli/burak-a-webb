const changeEvent = "academy-learning-draft-change";
const volatileStore = new Map<string, string>();

export function subscribeToLearningDrafts(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(changeEvent, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(changeEvent, onStoreChange);
  };
}

export function readLearningDraft(key: string, fallback = "") {
  const volatileValue = volatileStore.get(key);
  if (volatileValue !== undefined) return volatileValue;
  try {
    return window.localStorage.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
}

export function writeLearningDraft(key: string, value: string) {
  volatileStore.set(key, value);
  let persisted = true;
  try {
    window.localStorage.setItem(key, value);
  } catch {
    persisted = false;
  }
  window.dispatchEvent(new Event(changeEvent));
  return persisted;
}

export function removeLearningDraft(key: string) {
  volatileStore.delete(key);
  try {
    window.localStorage.removeItem(key);
  } catch {
    // The in-memory copy is still removed when browser storage is unavailable.
  }
  window.dispatchEvent(new Event(changeEvent));
}

export function clearLearningDraftStorage() {
  volatileStore.clear();
  try {
    for (let index = window.localStorage.length - 1; index >= 0; index -= 1) {
      const key = window.localStorage.key(index);
      if (key?.startsWith("academy-")) window.localStorage.removeItem(key);
    }
  } catch {
    // Storage may be unavailable in privacy-restricted browsers.
  }
  window.dispatchEvent(new Event(changeEvent));
}

export function hasDirtyLearningDrafts() {
  if ([...volatileStore.keys()].some((key) => key.startsWith("academy-dirty:"))) {
    return true;
  }
  try {
    for (let index = 0; index < window.localStorage.length; index += 1) {
      if (window.localStorage.key(index)?.startsWith("academy-dirty:")) return true;
    }
  } catch {
    return false;
  }
  return false;
}
