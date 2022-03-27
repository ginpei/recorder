export function sleep(ms: number): Promise<void> {
  return new Promise((f) => window.setTimeout(f, ms));
}
