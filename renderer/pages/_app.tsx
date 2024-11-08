import type { AppProps } from 'next/app';
import '../styles/global.css';
import { ThemeProvider } from '../components/theme-provider';
import Header from '../components/header';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider
      enableSystem
      disableTransitionOnChange
      attribute='class'
      defaultTheme='system'
    >
      <Header />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;
