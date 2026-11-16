import type { Metadata } from "next";
import { notFoundConfig } from "@/config/not-found";
import { NotFoundExperience } from "./not-found-experience";
import styles from "./not-found.module.css";

export const metadata: Metadata = {
  title: notFoundConfig.title,
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <main data-not-found="" className={styles.page}>
      <NotFoundExperience />
    </main>
  );
}
