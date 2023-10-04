import { Test, TestingModule } from '@nestjs/testing';
import { ActionOnUserService } from './action-on-user.service';

describe('ActionOnUserService', () => {
  let service: ActionOnUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ActionOnUserService],
    }).compile();

    service = module.get<ActionOnUserService>(ActionOnUserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
