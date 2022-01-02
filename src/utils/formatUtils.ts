const fileSizeLabels: string[] = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

/**
 * Formats bytes for file size status display.
 * 
 * @param bytes File size in bytes.
 * @param decimals Number of decimals to include.
 */
export function formatBytes(bytes: number, decimals: number = 2): string {
  const base: number = 1024;
  let remainder: number = bytes;
  for (var i = 0; remainder > base; i++) {
    remainder /= base;
  }
  return `${parseFloat(remainder.toFixed(decimals))} ${fileSizeLabels[i]}`;
}
