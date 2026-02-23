"use client";

import { siteConfig } from "@/config/site";
import { motion } from "motion/react";

export const About = () => {
  const [firstPhrase, secondPhrase] = siteConfig.about.emphasizedPhrases;
  const [intro, restWithSecond] = siteConfig.about.body.split(firstPhrase);
  const [middle, outro] = (restWithSecond ?? "").split(secondPhrase);
  const canFormat =
    Boolean(restWithSecond) && Boolean(secondPhrase) && outro !== undefined;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: 0.1 }}
      className="no-js-visible border-t border-dashed pt-6"
    >
      <h2 className="section-heading mb-3">
        {siteConfig.about.title}
      </h2>
      <div className="px-6">
        <p className="text-lg text-muted-foreground">
          {canFormat ? (
            <>
              {intro}
              <span className="underline underline-offset-4 decoration-border">
                {firstPhrase}
              </span>{" "}
              {middle}
              <span className="underline underline-offset-4 decoration-border">
                {secondPhrase}
              </span>
              {outro}
            </>
          ) : (
            siteConfig.about.body
          )}
        </p>
      </div>
    </motion.section>
  );
};
