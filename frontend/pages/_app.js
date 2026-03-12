import '../styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AuthProvider } from '../context/AuthContext';
import { DefaultSeo } from 'next-seo';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const SEO_CONFIG = {
  titleTemplate:   '%s | WildSmiles',
  defaultTitle:    'WildSmiles — Africa\'s Premier Tours & Travel',
  description:     'Discover extraordinary African adventures with WildSmiles. Safaris, gorilla trekking, beach retreats, and more. Book your dream trip today.',
  openGraph: {
    type:    'website',
    locale:  'en_US',
    url:     process.env.NEXT_PUBLIC_SITE_URL,
    siteName:'WildSmiles',
    images:  [{ url: `${process.env.NEXT_PUBLIC_SITE_URL}/images/og-image.jpg`, width: 1200, height: 630 }],
  },
  twitter: {
    handle:      '@wildsmiles',
    site:        '@wildsmiles',
    cardType:    'summary_large_image',
  },
};

export default function App({ Component, pageProps }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <DefaultSeo {...SEO_CONFIG} />
        <Component {...pageProps} />
        <ToastContainer
          position="top-right"
          autoClose={4000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </AuthProvider>
    </QueryClientProvider>
  );
}
