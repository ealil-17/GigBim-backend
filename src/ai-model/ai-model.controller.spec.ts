import { Test, TestingModule } from '@nestjs/testing';
import { AiModelController } from './ai-model.controller';

describe('AiModelController', () => {
  let controller: AiModelController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AiModelController],
    }).compile();

    controller = module.get<AiModelController>(AiModelController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
