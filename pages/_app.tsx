import { AppProps } from 'next/app'
import Head from 'next/head'

import '@/assets/css/index.css'
import { meta } from 'config'

export interface MyAppProps extends AppProps {}

export default function MyApp({ Component, pageProps }: MyAppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <title>{meta.title}</title>
      </Head>
      <Component {...pageProps} />
    </>
  )
}
