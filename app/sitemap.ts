import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://sorbakalim.fun', lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: 'https://sorbakalim.fun/login', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://sorbakalim.fun/register', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://sorbakalim.fun/about', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: 'https://sorbakalim.fun/privacy', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: 'https://sorbakalim.fun/terms', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ];
}
