import posthog from "posthog-js";

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
};

/**
 * Type-safe wrapper for capturing analytics events via PostHog.
 * Gracefully no-ops in non-browser environments or when PostHog is disabled.
 */
export function trackEvent<K extends keyof EventMap>(
  eventName: K,
  properties: EventMap[K]
): void {
  if (typeof window === "undefined") return;
  try {
    posthog.capture(eventName, properties);
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.error(`[PostHog Event Error] ${eventName}:`, err);
    }
  }
}
