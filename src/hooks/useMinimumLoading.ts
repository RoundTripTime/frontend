import { useEffect, useRef, useState } from 'react';

type MinimumLoadingOptions = {
  minimumDurationMs?: number;
};

const DEFAULT_MINIMUM_DURATION_MS = 700;

export function useMinimumLoading(isLoading: boolean, options: MinimumLoadingOptions = {}) {
  const minimumDurationMs = options.minimumDurationMs ?? DEFAULT_MINIMUM_DURATION_MS;
  const loadingStartedAtRef = useRef<number | null>(isLoading ? Date.now() : null);
  const [isMinimumLoading, setIsMinimumLoading] = useState(isLoading);

  useEffect(() => {
    if (isLoading) {
      if (loadingStartedAtRef.current === null) {
        loadingStartedAtRef.current = Date.now();
      }

      setIsMinimumLoading(true);
      return;
    }

    if (loadingStartedAtRef.current === null) {
      setIsMinimumLoading(false);
      return;
    }

    const elapsedMs = Date.now() - loadingStartedAtRef.current;
    const remainingMs = Math.max(0, minimumDurationMs - elapsedMs);

    const timeoutId = setTimeout(() => {
      loadingStartedAtRef.current = null;
      setIsMinimumLoading(false);
    }, remainingMs);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [isLoading, minimumDurationMs]);

  return isLoading || isMinimumLoading;
}
