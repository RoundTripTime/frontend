import { currentAppEnv } from './appMode';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LEVEL_ORDER: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const minLevel: LogLevel = currentAppEnv === 'production' ? 'warn' : 'debug';

function shouldLog(level: LogLevel): boolean {
  return LEVEL_ORDER[level] >= LEVEL_ORDER[minLevel];
}

function emit(level: LogLevel, args: unknown[]): void {
  if (!shouldLog(level)) return;
  const tag = `[${level.toUpperCase()}]`;
  if (level === 'error') console.error(tag, ...args);
  else if (level === 'warn') console.warn(tag, ...args);
  else if (level === 'info') console.info(tag, ...args);
  else console.log(tag, ...args);
}

export const logger = {
  debug: (...args: unknown[]) => emit('debug', args),
  info: (...args: unknown[]) => emit('info', args),
  warn: (...args: unknown[]) => emit('warn', args),
  error: (...args: unknown[]) => emit('error', args),
  level: minLevel,
  env: currentAppEnv,
};
