export function HowIWork() {
  return (
    <section className="px-6">
      <h2 className="text-xl font-semibold mb-3">How I work</h2>
      <ul className="space-y-1.5 text-sm text-muted-foreground list-disc list-inside">
        <li>
          <span className="font-medium text-foreground">Scope Control:</span>{" "}
          Requirements are locked before code. No feature creep.
        </li>
        <li>
          <span className="font-medium text-foreground">Speed:</span> I ship
          continuously. You see progress every day.
        </li>
        <li>
          <span className="font-medium text-foreground">Communication:</span>{" "}
          Async-first. No daily standups.
        </li>
      </ul>
    </section>
  );
}
