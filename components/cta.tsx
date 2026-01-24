import { Button } from "@/components/ui/button";
import Link from "next/link";
import Gmail from "@/public/stacks/gmail";
import Image from "next/image";

export function CTA() {
  return (
    <section className="px-6">
      <h2 className="text-xl font-semibold mb-3 underline underline-offset-4 decoration-border">
        Ready to build?
      </h2>
      <p className="text-lg text-muted-foreground mb-6">
        I am currently available for scoped MVP projects. Reach out if you are
        ready to ship.
      </p>
      <div className="flex gap-3 ">
        <Button variant="outline" size="lg" asChild>
          <Link
            href="mailto:adityakodez@gmail.com"
            className="flex items-center gap-2"
          >
            <Gmail size="16" />
            Email Me
          </Link>
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="flex items-center gap-2 cursor-default"
          disabled={false}
        >
          <Image src="/discord.svg" alt="Discord" width={16} height={16} />
          @t1x_faker
        </Button>
      </div>
    </section>
  );
}
