import { RandomService } from '../../../src/infrastructure/random/random.service';

export const createFakeRandomService = (): Record<keyof RandomService, jest.Mock> => ({
  generateULID: jest.fn().mockReturnValue('01HG1KCX4Z7GGQ0G4NWMFAH4X4'),
});
