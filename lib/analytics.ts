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
  playground_prop_changed: {
    component_id: string;
    prop: string;
    control: "palette" | "slider" | "toggle" | "segmented";
  };
  playground_props_copied: {
    component_id: string;
  };
  playground_props_reset: {
    component_id: string;
  };
  playground_props_toggled: {
    component_id: string;
    location: "catalog_card";
    expanded: boolean;
  };
  component_source_copied: {
    component_id: string;
    file: string;
  };
  component_source_expanded: {
    component_id: string;
    file: string;
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
  bookmark_clicked: {
    item_id: string;
    title: string;
    domain: string;
  };
  bookmarks_expanded_toggled: {
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
  component_suggestion_opened: {
    view: "list" | "cards";
  };
  component_suggestion_submitted: {
    view: "list" | "cards";
    has_reference: boolean;
  };
  component_suggestion_failed: {
    view: "list" | "cards";
    reason: "invalid" | "network" | "unavailable" | "rate_limited";
  };
  vader_lightsaber_toggled: {
    action: "ignite" | "extinguish";
  };
  campfire_toggled: {
    action: "light" | "extinguish";
  };
  sponsor_seat_claim_clicked: {
    seat: number;
    location: string;
  };
  sponsor_link_clicked: {
    sponsor_name: string;
    seat: number;
    url: string;
    location: string;
  };
  sponsor_cta_clicked: {
    location: string;
    surface: "hero" | "tier" | "footer";
    cta: "checkout" | "claim";
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
