import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/admin', '/admin/stories'] },
    ],
    sitemap: 'https://agenticaiforgood.com/sitemap.xml',
  }
}
