import { logger } from '@/src/lib/logger';
import { captureException, initSentry } from '@/src/lib/sentry';

let installed = false;

export function installGlobalHandlers(): void {
  if (installed) return;
  installed = true;

  initSentry();

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const tracking = require('promise/setimmediate/rejection-tracking');
  tracking.enable({
    allRejections: true,
    onUnhandled: (id: number, error: unknown) => {
      logger.error('UnhandledRejection', id, error);
      captureException(error);
    },
    onHandled: (id: number) => {
      logger.debug('Rejection handled', id);
    },
  });

  const errorUtils = (
    globalThis as unknown as {
      ErrorUtils?: {
        setGlobalHandler: (h: (e: Error, isFatal?: boolean) => void) => void;
        getGlobalHandler: () => (e: Error, isFatal?: boolean) => void;
      };
    }
  ).ErrorUtils;
  if (errorUtils) {
    const previous = errorUtils.getGlobalHandler();
    errorUtils.setGlobalHandler((error, isFatal) => {
      logger.error('GlobalError', { isFatal }, error);
      captureException(error);
      previous?.(error, isFatal);
    });
  }
}
