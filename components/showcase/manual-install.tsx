import { InstallCommand } from "@/components/showcase/copy-block";
import { SourceCodeBlock } from "@/components/showcase/source-code-block";
import {
  getDependencyCommands,
  getPrimitiveCommands,
} from "@/config/registry";
import { getRegistrySource } from "@/lib/registry-source";

/**
 * The paste-it-yourself path for a registry item.
 *
 * Dependencies, primitives, and the source itself all come from
 * `registry.json`, so a doc page can never drift from what the CLI installs and
 * no doc has to repeat "copy this file" without showing the file.
 */
export async function ManualInstall({
  componentId,
  componentTitle,
}: {
  componentId: string;
  componentTitle: string;
}) {
  const source = await getRegistrySource(componentId);
  if (!source || source.files.length === 0) return null;

  const dependencyCommands = getDependencyCommands(source.dependencies);
  const primitiveCommands = getPrimitiveCommands(source.registryDependencies);
  const fileCount = source.files.length;

  return (
    <section className="border-t border-dashed px-6 py-6">
      <h2 className="text-base font-medium tracking-tight">
        Manual installation
      </h2>
      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
        Rather not use the CLI? Everything {componentTitle} needs is below.
        Install its dependencies, then copy{" "}
        {fileCount === 1 ? "the file" : `all ${fileCount} files`} into the
        matching path in your project.
      </p>

      {dependencyCommands && (
        <div className="mt-4">
          <p className="font-mono text-[10px] tracking-wider text-muted-foreground">
            Dependencies
          </p>
          <InstallCommand
            className="mt-2"
            componentId={componentId}
            location="component_manual_install"
            commands={dependencyCommands}
          />
        </div>
      )}

      {primitiveCommands && (
        <div className="mt-4">
          <p className="font-mono text-[10px] tracking-wider text-muted-foreground">
            shadcn primitives
          </p>
          <InstallCommand
            className="mt-2"
            componentId={componentId}
            location="component_manual_install_primitives"
            commands={primitiveCommands}
          />
        </div>
      )}

      <div className="mt-5">
        <p className="font-mono text-[10px] tracking-wider text-muted-foreground">
          {fileCount === 1 ? "Source" : "Source files"}
        </p>
        <SourceCodeBlock
          className="mt-2"
          componentId={componentId}
          files={source.files.map((file) => ({
            path: file.path,
            html: file.html,
            raw: file.raw,
          }))}
        />
      </div>

      {source.assets.length > 0 && (
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
          Also ships static assets:{" "}
          {source.assets.map((asset, index) => (
            <span key={asset}>
              {index > 0 && ", "}
              <code className="rounded-sm bg-muted px-1 py-0.5 font-mono text-[11px] text-foreground">
                {asset}
              </code>
            </span>
          ))}
          . The CLI copies them for you.
        </p>
      )}
    </section>
  );
}
