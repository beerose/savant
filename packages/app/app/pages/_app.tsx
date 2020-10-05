import { AppProps, ErrorComponent, useRouter } from "blitz";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";
import { queryCache } from "react-query";
import LoginForm from "app/auth/components/LoginForm";

import "handsontable/dist/handsontable.full.css";

import "../application-ui/global-styles.css";

import { SSRProvider, Provider, View } from "../reusable-ui/spectrum";
import { theme } from "../reusable-ui/theme";

import React from "react";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return (
    <SSRProvider>
      <Provider theme={theme} colorScheme="dark">
        <View
          backgroundColor="default"
          height="100vh"
          className={theme.reusableTokensClassName}
        >
          <ErrorBoundary
            FallbackComponent={RootErrorFallback}
            resetKeys={[router.asPath]}
            onReset={() => {
              // This ensures the Blitz useQuery hooks will automatically refetch
              // data any time you reset the error boundary
              queryCache.resetErrorBoundaries();
            }}
          >
            <Component {...pageProps} />
          </ErrorBoundary>
        </View>
      </Provider>
    </SSRProvider>
  );
}

function RootErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  if (error?.name === "AuthenticationError") {
    return <LoginForm onSuccess={resetErrorBoundary} />;
  } else if (error?.name === "AuthorizationError") {
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

type WebVitalsMetric = {
  id: unknown;
  name: unknown;
  startTime: unknown;
  value: unknown;
  label: unknown;
};

/**
 * @see https://blitzjs.com/docs/measuring-performance#web-vitals
 */
export function reportWebVitals(metric: WebVitalsMetric) {
  console.log("web vitals", { metric });
}
