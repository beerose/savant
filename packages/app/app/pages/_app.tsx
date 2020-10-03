import { AppProps, ErrorComponent, useRouter } from 'blitz';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { queryCache } from 'react-query';
import LoginForm from 'app/auth/components/LoginForm';
import { SSRProvider, Provider, defaultTheme } from '@adobe/react-spectrum';

import 'handsontable/dist/handsontable.full.css';
import '../reusable-ui/global-styles.css';

export default function App({ Component, pageProps }: AppProps) {
  const getLayout = Component.getLayout || ((page) => page);
  const router = useRouter();

  return (
    <SSRProvider>
      <Provider theme={defaultTheme}>
        <ErrorBoundary
          FallbackComponent={RootErrorFallback}
          resetKeys={[router.asPath]}
          onReset={() => {
            // This ensures the Blitz useQuery hooks will automatically refetch
            // data any time you reset the error boundary
            queryCache.resetErrorBoundaries();
          }}
        >
          {getLayout(<Component {...pageProps} />)}
        </ErrorBoundary>
      </Provider>
    </SSRProvider>
  );
}

function RootErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  if (error?.name === 'AuthenticationError') {
    return <LoginForm onSuccess={resetErrorBoundary} />;
  } else if (error?.name === 'AuthorizationError') {
    return (
      <ErrorComponent
        statusCode={(error as any).statusCode}
        title="Sorry, you are not authorized to access this"
      />
    );
  } else {
    return (
      <ErrorComponent
        statusCode={(error as any)?.statusCode || 400}
        title={error?.message || error?.name}
      />
    );
  }
}
