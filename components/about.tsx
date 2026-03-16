"use client";

import { useMemo, type ReactNode } from "react";
import { motion } from "motion/react";
import { siteConfig } from "@/config/site";

function renderHighlightedText(text: string, phrases: string[]): ReactNode[] {
  let nodes: ReactNode[] = [text];

  phrases.forEach((phrase, phraseIndex) => {
    nodes = nodes.flatMap((node, nodeIndex) => {
      if (typeof node !== "string" || !phrase) {
        return [node];
      }

      const parts = node.split(phrase);
      if (parts.length === 1) {
        return [node];
      }

      const result: ReactNode[] = [];

      parts.forEach((part, partIndex) => {
        if (part) {
          result.push(part);
        }

        if (partIndex < parts.length - 1) {
          result.push(
            <span
              key={`phrase-${phraseIndex}-${nodeIndex}-${partIndex}`}
              className="rounded-sm bg-primary/50 px-1 text-foreground"
            >
              {phrase}
            </span>,
          );
        }
      });

      return result;
    });
  });

  return nodes;
}

export const About = () => {
  const [firstPhrase, secondPhrase] = siteConfig.about.emphasizedPhrases;

  const sentences = useMemo(
    () => siteConfig.about.body.split(/(?<=\.)\s+/).filter(Boolean),
    [],
  );

  const highlightPhrases = [firstPhrase, secondPhrase].filter(Boolean);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="no-js-visible border-t border-dashed pt-6"
      id="about"
    >
      <h2 className="section-heading mb-3">{siteConfig.about.title}</h2>
      <div className="px-2">
        <div className="space-y-1 pl-4 md:pl-5">
          {sentences.map((sentence, index) => (
            <motion.p
              key={`${sentence}-${index}`}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.24, delay: index * 0.06 }}
              className="micro-transition group relative text-[1.03rem] leading-8 text-muted-foreground hover:text-foreground focus-within:text-foreground"
            >
              {renderHighlightedText(sentence, highlightPhrases)}
            </motion.p>
          ))}
        </div>
      </div>
    </motion.section>
  );
};
