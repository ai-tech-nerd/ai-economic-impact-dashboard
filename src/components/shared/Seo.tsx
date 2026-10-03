import { Helmet } from 'react-helmet-async';

const SITE_ORIGIN = 'https://aishift.michaelkristof.com';

interface SeoProps {
  /** Page title (full string, including any brand suffix) */
  title: string;
  /** Meta description — natural search phrasing, no keyword stuffing */
  description: string;
  /**
   * Canonical path for the page, e.g. "/predictions". Embed/widget variants
   * of a page should pass the main-site path so crawlers canonicalize to it.
   */
  path: string;
}

/**
 * Share image generated at deploy by scripts/og/generate.mjs:
 * "/" -> /og/index.png, "/predictions" -> /og/predictions.png,
 * "/companies/oracle" -> /og/company/oracle.png.
 */
function shareImage(path: string) {
  const company = path.match(/^\/companies\/([^/]+)$/);
  if (company) return `${SITE_ORIGIN}/og/company/${company[1]}.png`;
  const route = path === '/' ? 'index' : path.replace(/^\//, '');
  return `${SITE_ORIGIN}/og/${route}.png`;
}

/** Per-route <head> tags via react-helmet-async (provider is in App.tsx). */
export function Seo({ title, description, path }: SeoProps) {
  const url = `${SITE_ORIGIN}${path === '/' ? '/' : path}`;
  const image = shareImage(path);
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
}
