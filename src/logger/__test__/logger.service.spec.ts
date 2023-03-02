import { Test, TestingModule } from '@nestjs/testing';
import { LoggerClientService } from '../services/logger.service';

describe('LoggerClientService', () => {
  let service: LoggerClientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LoggerClientService],
    }).compile();

    service = module.get<LoggerClientService>(LoggerClientService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
