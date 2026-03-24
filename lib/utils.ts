export function getPath(path: string): string {
  if (path.startsWith('http') || path.startsWith('blob:') || path.startsWith('data:')) {
    return path;
  }

  const basePath = process.env.NODE_ENV === 'production' ? '/MKS-STUDIO-FINAL-LAUNCH' : '';

  if (!basePath) {
    return path.startsWith('/') ? path : `/${path}`;
  }

  if (path.startsWith(basePath)) {
    return path;
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${basePath}${normalizedPath}`;
}
