export function getPath(path: string): string {
  if (path.startsWith('http') || path.startsWith('blob:') || path.startsWith('data:')) {
    return path;
  }
  const basePath = process.env.NODE_ENV === 'production' ? '/MKS-STUDIO-FINAL-LAUNCH' : '';
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  if (!basePath || normalizedPath.startsWith(basePath)) return normalizedPath;
  return `${basePath}${normalizedPath}`;
}
