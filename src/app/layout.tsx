import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Amoria - Global Tech',
    template: '%s | Amoria Global Tech'
  },
  description: 'Empowering businesses with cutting-edge technology solutions that drive digital transformation and create lasting value in tomorrow\'s connected world.',
  keywords: [
    'technology solutions',
    'digital transformation',
    'software development',
    'web portals',
    'computer programming',
    'IT consultancy',
    'cloud infrastructure',
    'payment gateway',
    'mobile banking',
    'Rwanda tech company'
  ],
  authors: [{ name: 'Amoria Global Tech' }],
  creator: 'Amoria Global Tech',
  publisher: 'Amoria Global Tech',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://amoriaglobal.com',
    siteName: 'Amoria Global Tech',
    title: 'Amoria Global Tech - Connect the Future with Innovation',
    description: 'Empowering businesses with cutting-edge technology solutions that drive digital transformation and create lasting value.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Amoria Global Tech - Technology Solutions',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Amoria Global Tech - Connect the Future with Innovation',
    description: 'Empowering businesses with cutting-edge technology solutions that drive digital transformation.',
    images: ['/twitter-image.jpg'],
    creator: '@amoriaglobaltech',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Bootstrap Icons CDN */}
        <link 
          rel="stylesheet" 
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.2/font/bootstrap-icons.css"
        />
        {/* Favicon and Apple Touch Icons */}
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#3b82f6" />
        
        {/* Preload critical fonts */}
        <link
          rel="preload"
          href="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${inter.className} antialiased`}>
        <div id="root">
          {children}
        </div>
        
        {/* Scroll behavior polyfill for older browsers */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (!('scrollBehavior' in document.documentElement.style)) {
                const script = document.createElement('script');
                script.src = 'https://cdn.jsdelivr.net/gh/iamdustan/smoothscroll@master/src/smoothscroll.js';
                document.head.appendChild(script);
              }
            `,
          }}
        />
      </body>
    </html>
  )
}