import type { SectionId, SectionNoteConfig } from "@/config/types";

export const sectionNotes: Partial<Record<SectionId, SectionNoteConfig>> = {
  components: {
    text: "Copy, paste,\nmake it yours",
    side: "right",
  },
  testimonials: {
    text: "Big thanks\nto these folks",
    side: "left",
  },
};
