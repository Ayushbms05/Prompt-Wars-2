/**
 * src/utils/logger.ts
 * Production-safe logger utility that wraps console methods.
 * Logging is disabled when NODE_ENV is 'production'.
 */

/** Whether logging is enabled (disabled in production). */
const isEnabled: boolean = import.meta.env.MODE !== 'production';

/** No-op function used when logging is disabled. */
const noop = (): void => {};

/**
 * Logger interface matching the subset of console methods used in the app.
 */
interface Logger {
  /** Log informational messages. */
  log: (...args: unknown[]) => void;
  /** Log warning messages. */
  warn: (...args: unknown[]) => void;
  /** Log error messages. */
  error: (...args: unknown[]) => void;
  /** Log debug messages. */
  debug: (...args: unknown[]) => void;
  /** Log informational messages. */
  info: (...args: unknown[]) => void;
}

/**
 * Application logger that wraps console methods.
 * All output is suppressed in production builds.
 */
const logger: Logger = {
  /* eslint-disable no-console */
  log: isEnabled ? (...args: unknown[]) => console.log(...args) : noop,
  warn: isEnabled ? (...args: unknown[]) => console.warn(...args) : noop,
  error: isEnabled ? (...args: unknown[]) => console.error(...args) : noop,
  debug: isEnabled ? (...args: unknown[]) => console.debug(...args) : noop,
  info: isEnabled ? (...args: unknown[]) => console.info(...args) : noop,
  /* eslint-enable no-console */
};

export default logger;
