import { Test, TestingModule } from '@nestjs/testing';
import { TakeawayOrderService } from './takeaway_order.service';

describe('TakeawayOrderService', () => {
  let service: TakeawayOrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TakeawayOrderService],
    }).compile();

    service = module.get<TakeawayOrderService>(TakeawayOrderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
