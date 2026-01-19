import { Test, TestingModule } from '@nestjs/testing';
import { TakeawayOrderController } from './takeaway_order.controller';
import { TakeawayOrderService } from './takeaway_order.service';

describe('TakeawayOrderController', () => {
  let controller: TakeawayOrderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TakeawayOrderController],
      providers: [TakeawayOrderService],
    }).compile();

    controller = module.get<TakeawayOrderController>(TakeawayOrderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
