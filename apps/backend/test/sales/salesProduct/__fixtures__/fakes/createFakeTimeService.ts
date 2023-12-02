import { TimeService } from '../../../../../src/infrastructure/time/time.service';

export const createFakeTimeService = (): Record<keyof TimeService, jest.Mock> => ({
  now: jest.fn().mockReturnValue(new Date(2022, 0, 3)),
});
