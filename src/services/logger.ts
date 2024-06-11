import { logger as _logger, consoleTransport } from 'react-native-logs';

/**
 * Handle logging at various levels such as debug, info, warn, and error.
 * The library supports different transports for log outputs.
 *
 * For more details, see the [react-native-logs documentation](https://www.npmjs.com/package/react-native-logs).
 */
export const logger = _logger.createLogger<'debug' | 'info' | 'warn' | 'error'>(
  {
    levels: {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3
    },
    severity: 'debug',
    transport: consoleTransport,
    transportOptions: {
      colors: {
        info: 'blueBright',
        warn: 'yellowBright',
        error: 'redBright'
      }
    },
    async: true,
    dateFormat: 'time',
    printLevel: true,
    printDate: true,
    fixedExtLvlLength: false,
    enabled: true
  }
);
