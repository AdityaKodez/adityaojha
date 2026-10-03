import { siteConfig } from "@/config/site";
import { splitSentences } from "@/lib/sentences";

const sentences = splitSentences(siteConfig.about.body);

export const About = () => {
  return (
    <section className="no-js-visible border-t border-dashed pt-6">
      <h2 className="section-heading mb-3">{siteConfig.about.title}</h2>
      <div className="px-2">
        <div className="space-y-1 pl-4 md:pl-5">
          {sentences.map((sentence, index) => (
            <p
              key={`${sentence}-${index}`}
              className="micro-transition group relative text-base leading-8 text-muted-foreground hover:text-foreground focus-within:text-foreground"
            >
              {sentence}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
};
