export function getPath(path: string): string {
  if (path.startsWith('http') || path.startsWith('blob:') || path.startsWith('data:')) {
    return path;
  }
  
  const basePath = '/MKS-STUDIO-FINAL-LAUNCH';
  
  // Ensure we don't double prefix
  if (path.startsWith(basePath)) {
    return path;
  }
  
  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  
  return `${basePath}${normalizedPath}`;
}
