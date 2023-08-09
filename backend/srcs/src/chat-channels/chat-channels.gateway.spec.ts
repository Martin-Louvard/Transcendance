import { Test, TestingModule } from '@nestjs/testing';
import { ChatChannelsGateway } from './chat-channels.gateway';

describe('ChatChannelsGateway', () => {
  let gateway: ChatChannelsGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatChannelsGateway],
    }).compile();

    gateway = module.get<ChatChannelsGateway>(ChatChannelsGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
