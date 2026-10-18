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

interface SaveFilePickerOptions {
  suggestedName?: string
  types?: { description?: string; accept: Record<string, string[]> }[]
}
declare global { interface Window { showSaveFilePicker?(options?: SaveFilePickerOptions): Promise<FileSystemFileHandle> } }

function downloadBlob(blob: Blob, title: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = title
  link.click()
  URL.revokeObjectURL(url)
}

export async function saveWithFilePicker(blob: Blob, title: string) {
  if (!window.showSaveFilePicker) {
    downloadBlob(blob, title)
    return
  }
  const handler = await window.showSaveFilePicker({
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