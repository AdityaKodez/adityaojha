import type { RegistryHealth } from "@/config/registry-health";
import { fetchRegistryHealth } from "@/lib/registry-health";
import { RegistryStatusPills } from "@/components/showcase/registry-status-pills";

/**
 * The credentials strip under the component catalog on `/components`.
 *
 * Reads the live entry for `@akoder` out of the shadcn registry directory, so
 * the pills are the published record rather than a hardcoded claim. When
 * shadcn cannot be reached the strip stays hidden instead of showing a number
 * that no longer matches the directory.
 */
export async function RegistryStatus() {
  const health = await fetchRegistryHealth();
  if (!health) return null;

  return (
    <section
      aria-label="Registry status"
      className="border-t border-dashed px-6 pt-4 pb-2"
    >
      <RegistryStatusPills health={health} />
    </section>
  );
}
