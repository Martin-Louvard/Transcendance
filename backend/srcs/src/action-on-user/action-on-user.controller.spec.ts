import { Test, TestingModule } from '@nestjs/testing';
import { ActionOnUserController } from './action-on-user.controller';
import { ActionOnUserService } from './action-on-user.service';

describe('ActionOnUserController', () => {
  let controller: ActionOnUserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActionOnUserController],
      providers: [ActionOnUserService],
    }).compile();

    controller = module.get<ActionOnUserController>(ActionOnUserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
