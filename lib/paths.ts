/** Next Link/router apply basePath themselves; browser APIs and public assets do not. */
export const basePath = '/la-umrah-travel';
export const siteOrigin = 'https://hotfoxboy.github.io';
export const siteUrl = `${siteOrigin}${basePath}/`;
export function assetPath(path: string): string {
  if (!path.startsWith('/') || path.startsWith('//')) return path;
  if (path === basePath || path.startsWith(`${basePath}/`)) return path;
  return `${basePath}${path}`;
}
export function routePath(pathname: string): string {
  const path = pathname === basePath ? '/' : pathname.startsWith(`${basePath}/`) ? pathname.slice(basePath.length) : pathname;
  return path.replace(/\/+$/, '') || '/';
}
export function absolutePageUrl(path: string): string {
  const route = routePath(path);
  return `${siteOrigin}${assetPath(route === '/' ? '/' : `${route}/`)}`;
}
