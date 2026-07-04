export const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

// Runs `fn` over `items` with at most `limit` calls in flight at once, preserving
// input order in the result. Used to parallelise per-row Scryfall lookups without
// firing an unbounded burst of requests at the public API.
export async function mapPool<T, R>(
  items: T[],
  limit: number,
  fn: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let next = 0;
  const worker = async (): Promise<void> => {
    while (next < items.length) {
      const i = next++;
      results[i] = await fn(items[i], i);
    }
  };
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}

declare global { interface Window { showSaveFilePicker?: any; } }
export async function saveWithFilePicker(blob: Blob, title: string) {
  const handler: any = await window.showSaveFilePicker({
    suggestedName: title ?? "",
    types: [{
      description: 'Text file',
      accept: { 'text/plain': ['.txt'] },
    }],
  });
  const writable = await handler.createWritable();
  await writable.write(blob);
  writable.close();
}