"use client";

import { useSyncExternalStore } from "react";

/**
 * Shared view state for the /components showcase.
 *
 * Two consumers read it: the catalog itself (list vs. card grid) and the page
 * shell (frame width). Keeping the store in one module means both flip in the
 * same commit, so the frame never widens a frame ahead of the grid.
 */
export type CatalogView = "list" | "cards";

const STORAGE_KEY = "akoder:components-view";
const DEFAULT_VIEW: CatalogView = "list";

const viewListeners = new Set<() => void>();
let viewCache: CatalogView | null = null;

function readView(): CatalogView {
  if (typeof window === "undefined") return DEFAULT_VIEW;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === "list" || stored === "cards" ? stored : DEFAULT_VIEW;
  } catch {
    return DEFAULT_VIEW;
  }
}

function getViewSnapshot(): CatalogView {
  if (viewCache === null) viewCache = readView();
  return viewCache;
}

function getServerViewSnapshot(): CatalogView {
  return DEFAULT_VIEW;
}

function subscribeToView(onStoreChange: () => void) {
  viewListeners.add(onStoreChange);
  const onStorage = () => {
    viewCache = null;
    viewListeners.forEach((listener) => listener());
  };
  window.addEventListener("storage", onStorage);
  return () => {
    viewListeners.delete(onStoreChange);
    window.removeEventListener("storage", onStorage);
  };
}

function writeView(next: CatalogView) {
  try {
    window.localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // Ignore storage restrictions
  }
  viewCache = next;
  viewListeners.forEach((listener) => listener());
}

export function useComponentsView(): [CatalogView, (next: CatalogView) => void] {
  const view = useSyncExternalStore(
    subscribeToView,
    getViewSnapshot,
    getServerViewSnapshot,
  );
  return [view, writeView];
}
