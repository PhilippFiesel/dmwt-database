import '@/styles/global.css' //mit gobals.css aufruf für die post und mit gobal.css aufruf für index (momentan)

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />
}
