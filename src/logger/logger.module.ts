import { Global, Module } from '@nestjs/common';
import { LoggerClientService } from './services/logger.service';
import { LOGGER_OPTIONS, PROJECT_OPTIONS } from './constants/logger.constants';
@Global()
@Module({
  providers: [
    LoggerClientService,
    {
      provide: PROJECT_OPTIONS,
      useValue: {
        project: {
          name: 'nestJS-prod',
          version: '0.0.1',
        },
        server: {
          isProd: false,
        },
      },
    },
    {
      provide: LOGGER_OPTIONS,
      useValue: {
        level: 'trace',
        logLevelString: true,
      },
    },
  ],
  exports: [LoggerClientService, PROJECT_OPTIONS, LOGGER_OPTIONS],
})
export class LoggerModule {}
