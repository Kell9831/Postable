
export function getCurrentTime(): string {
  const now = new Date();
  const timestamp = now.toISOString().slice(0, 19).replace("T", " ");
  return timestamp;
}