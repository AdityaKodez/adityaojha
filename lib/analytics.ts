import type posthog from "posthog-js";

type PostHog = typeof posthog;

let posthogClient: Promise<PostHog | null> | null = null;

/**
 * Lazily loads and initializes PostHog the first time it is needed, so its
 * bundle never competes with hydration. Resolves to null when no key is
 * configured or the load fails; callers must treat it as optional.
 */
export function getPostHog(): Promise<PostHog | null> {
  if (typeof window === "undefined") return Promise.resolve(null);

  const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!posthogKey) return Promise.resolve(null);

  if (!posthogClient) {
    posthogClient = import("posthog-js")
      .then((mod) => {
        mod.default.init(posthogKey, {
          api_host:
            process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
          person_profiles: "identified_only",
          capture_pageview: false, // Handled manually by PostHogPageView for App Router accuracy
          capture_pageleave: true,
          autocapture: true,
        });
        return mod.default;
      })
      .catch(() => null);
  }

  return posthogClient;
}

export type EventMap = {
  registry_command_copied: {
    component_id: string;
    package_manager: string;
    command: string;
    location: string;
  };
  registry_setup_snippet_copied: {
    namespace: string;
    location: string;
  };
  component_tab_switched: {
    component_id: string;
    tab: "preview" | "code";
  };
  component_demo_source_copied: {
    component_id: string;
  };
  package_manager_changed: {
    selected_manager: string;
    component_id?: string;
  };
  project_clicked: {
    project_id: string;
    project_title: string;
    target_type: "case_study" | "external_url";
    url?: string;
  };
  project_live_preview_clicked: {
    project_id: string;
    live_url: string;
  };
  project_source_code_clicked: {
    project_id: string;
    github_url: string;
  };
  project_year_toggled: {
    year: number;
    action: "expand" | "collapse";
  };
  theme_toggled: {
    theme: "light" | "dark";
    method: "button" | "shortcut_key";
  };
  github_repo_clicked: {
    repo_url: string;
    star_count?: string | null;
  };
  social_handle_copied: {
    platform: string;
    handle: string;
    method: "click" | "shortcut_key";
    location?: string;
  };
  social_link_clicked: {
    platform: string;
    url: string;
    location?: string;
  };
  bookmarks_tab_switched: {
    tab: "certifications" | "bookmarks";
  };
  bookmark_clicked: {
    item_id: string;
    title: string;
    domain: string;
    collection: "certifications" | "bookmarks";
  };
  bookmarks_expanded_toggled: {
    collection: "certifications" | "bookmarks";
    expanded: boolean;
  };
  prose_code_copied: {
    page_path?: string;
  };
  section_rail_clicked: {
    target_section_id: string;
    current_section_id?: string;
  };
  hero_wave_hovered: {
    interaction_type: "hover" | "touch";
  };
  ask_ai_opened: {
    location: string;
    trigger_type: "bubble" | "pill";
  };
  components_view_switched: {
    view: "list" | "cards";
    previous_view: "list" | "cards";
  };
  vader_lightsaber_toggled: {
    action: "ignite" | "extinguish";
  };
  campfire_toggled: {
    action: "light" | "extinguish";
  };
};

/**
 * Type-safe wrapper for capturing analytics events via PostHog.
 * Gracefully no-ops in non-browser environments, before PostHog has loaded,
 * or when PostHog is disabled.
 */
export function trackEvent<K extends keyof EventMap>(
  eventName: K,
  properties: EventMap[K]
): void {
  if (typeof window === "undefined") return;
  getPostHog()
    .then((client) => client?.capture(eventName, properties))
    .catch((err) => {
      if (process.env.NODE_ENV === "development") {
        console.error(`[PostHog Event Error] ${eventName}:`, err);
      }
    });
}
