export const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))

// Runs `fn` over `items` with at most `limit` calls in flight at once, preserving
// input order in the result. Used to parallelise per-row Scryfall lookups without
// firing an unbounded burst of requests at the public API.
export async function mapPool<T, R>(
  items: T[],
  limit: number,
  fn: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
  const results: R[] = new Array(items.length)
  let next = 0
  const worker = async (): Promise<void> => {
    while (next < items.length) {
      const i = next++
      results[i] = await fn(items[i], i)
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker))
  return results
}

interface SaveFilePickerOptions {
  suggestedName?: string
  types?: { description?: string; accept: Record<string, string[]> }[]
}
declare global {
  interface Window {
    showSaveFilePicker?(options?: SaveFilePickerOptions): Promise<FileSystemFileHandle>
  }
}

function downloadBlob(blob: Blob, title: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = title
  document.body.appendChild(link)
  link.click()
  link.remove()
  // Revoking synchronously can cancel the download before the browser has read the blob (Safari).
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

// The picker needs a recent user gesture, so it must open before slow work; pass the content as a
// promise and it is awaited only once the file has been chosen.
export async function saveWithFilePicker(contents: Blob | Promise<Blob>, title: string) {
  if (!window.showSaveFilePicker) {
    downloadBlob(await contents, title)
    return
  }
  try {
    const handler = await window.showSaveFilePicker({
      suggestedName: title ?? '',
      types: [
        {
          description: 'Text file',
          accept: { 'text/plain': ['.txt'] },
        },
      ],
    })
    const blob = await contents
    const writable = await handler.createWritable()
    await writable.write(blob)
    await writable.close()
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') return
    throw error
  }
}
