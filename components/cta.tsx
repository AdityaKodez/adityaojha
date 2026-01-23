import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function CTA() {
  return (
    <section className="px-6">
      <h2 className="text-lg font-semibold mb-3">Ready to build?</h2>
      <p className="text-sm text-muted-foreground mb-6">
        I am currently available for scoped MVP projects. Reach out if you are
        ready to ship.
      </p>
      <div className="flex gap-3 ">
        <Button variant="outline" size="lg" asChild>
          <Link href="mailto:adityakodez@gmail.com">
            <Mail className="mr-2 h-4 w-4" />
            Email Me
          </Link>
        </Button>
        <Button variant="outline" size="lg" asChild>
          <Link
            href="https://discord.com/users/USE1243105196477911061"
            target="_blank"
          >
            <Image
              src="/discord.svg"
              alt="Discord"
              width={16}
              height={16}
              className="mr-2"
            />
            DM Me On Discord
          </Link>
        </Button>
      </div>
    </section>
  );
}
