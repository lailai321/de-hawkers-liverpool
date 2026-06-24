import type { MetadataRoute } from 'next'

const SITE_URL = 'https://de-hawkers-liverpool.vercel.app'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api/', '/checkout', '/order/'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
