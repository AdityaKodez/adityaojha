export function splitSentences(body: string): string[] {
  return body.split(/(?<=\.)\s+/).filter(Boolean);
}
