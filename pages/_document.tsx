import Document, { DocumentContext, Head, Html, Main, NextScript } from 'next/document'

import { meta } from 'config'

class MainDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html lang="de">
        <Head>
          <meta name="application-name" content={meta.title} />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="default" />
          <meta name="apple-mobile-web-app-title" content={meta.title} />
          <meta name="description" content={meta.description} />
          <meta name="format-detection" content="telephone=no" />
          <meta name="mobile-web-app-capable" content="yes" />
          {/* <meta name="msapplication-config" content="/icons/browserconfig.xml" /> */}
          <meta name="msapplication-TileColor" content="#14b8a6" />
          <meta name="msapplication-tap-highlight" content="no" />
          <meta name="theme-color" content="#14b8a6" />

          <link rel="apple-touch-icon" sizes="180x180" href="/pwa/apple-touch-icon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/pwa/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/pwa/favicon-16x16.png" />
          <link rel="shortcut icon" href="/pwa/favicon.ico" />
          <link rel="manifest" href="/pwa/manifest.json" />

          <meta property="og:type" content="website" />
          <meta property="og:title" content={meta.title} />
          <meta property="og:description" content={meta.description} />
          <meta property="og:site_name" content={meta.title} />
          <meta property="og:url" content={meta.url} />
          <meta property="og:image" content={`${meta.url}/icon-512x512.png`} />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MainDocument
