import { LoggerInterceptor } from '../interceptors/logger.interceptor';

describe('LoggerInterceptor', () => {
  it('should be defined', () => {
    expect(new LoggerInterceptor()).toBeDefined();
  });
});
