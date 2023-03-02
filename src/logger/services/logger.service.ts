import { Inject, Injectable } from '@nestjs/common';
import { LoggerService } from '@nestjs/common';
import pino from 'pino';
import {
  LOGGER_INTERCEPTOR_CUSTOM_NAME,
  LOGGER_OPTIONS,
  PROJECT_OPTIONS,
} from '../constants/logger.constants';
import { ILoggerOptions, LoggerLevels } from '../interfaces/logger.interfaces';
import * as _ from 'lodash';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pinoElasticSearch = require('pino-elasticsearch');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pinoMultiStream = require('pino-multi-stream').multistream;
@Injectable()
export class LoggerClientService {
  private readonly logger: pino.Logger;
  private readonly streamElastic: any;
  constructor(
    @Inject(LOGGER_OPTIONS) private readonly loggerOptions: ILoggerOptions,
    @Inject(PROJECT_OPTIONS) private readonly projectOptions,
  ) {
    const {
      server: { isProd },
      project: { name, version },
      elasticConfig,
    } = this.projectOptions;
    const formatters = this.loggerOptions.logLevelString
      ? {
          level: (label) => {
            return { level: label };
          },
        }
      : undefined;
    if (isProd) {
      if (elasticConfig && !_._.isEmpty(elasticConfig)) {
        this.streamElastic = pinoElasticSearch({
          index: `api-${name}-${version}`,
          node: 'http://localhost:9200',
          'es-version': 7,
          ...elasticConfig,
        });
        this.logger = pino(
          { level: this.loggerOptions.level, formatters },
          pinoMultiStream([
            { stream: process.stdout },
            { stream: this.streamElastic },
          ]),
        );
      }
      this.logger = pino({ level: this.loggerOptions.level, formatters });
    } else {
      this.logger = pino({
        level: this.loggerOptions.level,
        formatters,
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
          },
        },
      });
    }
  }
  public logInterceptor(message: any, context?: string) {
    const log: any = this.generateBaseInformation('info');
    log.message = 'Log Interceptor';
    log[LOGGER_INTERCEPTOR_CUSTOM_NAME] = message;
    this.logger.info(log, context);
  }
  public log(message: any, context?: string) {
    const log: any = this.generateBaseInformation('info');
    log.message = 'Log Info';
    log.custom_message = JSON.stringify(message);
    this.logger.info(log, context);
  }
  public warn(message: any, context?: string) {
    this.logger.warn(message, context);
  }
  public error(message: any, context?: string) {
    this.logger.error(message, context);
  }
  public trace(message: any, context?: string) {
    this.logger.trace(message, context);
  }
  public debug(message: any, context?: string) {
    this.logger.debug(message, context);
  }
  public fatal(message: any, context?: string) {
    this.logger.fatal(message, context);
  }
  public silent(message: any, context?: string) {
    this.logger.silent(message, context);
  }
  public generateBaseInformation(
    log_level: LoggerLevels,
    log_type = 'DEFAULT',
    timestamp?: number,
  ) {
    return {
      application_name: this.projectOptions.project.name,
      application_version: this.projectOptions.project.version,
      log_level,
      log_type,
      '@timestamp': timestamp ? timestamp.toString() : Date.now().toString(),
    };
  }
}
