export type LoggerLevels =
  | 'info'
  | 'warn'
  | 'error'
  | 'trace'
  | 'debug'
  | 'fatal'
  | 'silent';
export interface ILoggerOptions {
  level: LoggerLevels;
  logLevelString: boolean;
}