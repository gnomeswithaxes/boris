export const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

declare global { interface Window { showSaveFilePicker?: any; } }
export async function saveWithFilePicker(blob: Blob, title: string) {
  let handler: any = await window.showSaveFilePicker({
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