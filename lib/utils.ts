export function getPath(path: string): string {
  return path.startsWith('/') ? path : `/${path}`;
}
