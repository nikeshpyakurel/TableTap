import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { subscriptionEntity } from 'src/model/subscription.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { packagePaymentEntity } from 'src/model/packagePayment.entity';
import { packageEntity } from 'src/model/package.entity';
import { restaurantEntity } from 'src/model/Restaurant.entity';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(subscriptionEntity)
    private readonly subscriptionRepository: Repository<subscriptionEntity>,

    @InjectRepository(packagePaymentEntity)
    private readonly packagePaymentRepository: Repository<packagePaymentEntity>,

    @InjectRepository(packageEntity)
    private readonly packageRepository: Repository<packageEntity>,

    @InjectRepository(restaurantEntity)
    private readonly restaurantRepository: Repository<restaurantEntity>,
    private readonly dataSource: DataSource
  ) { }

  async create(createSubscriptionDto: CreateSubscriptionDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const subscription = new subscriptionEntity();
      subscription.startDate = createSubscriptionDto.startDate;
      subscription.endDate = createSubscriptionDto.endDate;
      subscription.restaurant = await this.restaurantRepository.findOne({ where: { id: createSubscriptionDto.restaurantId } });
      subscription.package = await this.packageRepository.findOne({ where: { id: createSubscriptionDto.packageId } });

      // Save the subscription
      await queryRunner.manager.save(subscription);

      // Create the packagePayment after subscription is saved
      const packagePayment = new packagePaymentEntity();
      packagePayment.subscription = subscription;
      packagePayment.mode = createSubscriptionDto.mode;
      packagePayment.proof = null;
      packagePayment.Amount = createSubscriptionDto.amount;

      // Save packagePayment
      await queryRunner.manager.save(packagePayment);
      await queryRunner.commitTransaction();
      return true;
    } catch (error) {
      // console.log(error);
      await queryRunner.rollbackTransaction();
      throw new ForbiddenException(error.errorResponse);
    } finally {
      await queryRunner.release();
    }

  }



  // Get all subscriptions
  async findAll(): Promise<subscriptionEntity[]> {
    return await this.subscriptionRepository.find({
      relations: ['restaurant', 'package', 'packagePayment'],
    });
  }

  // Get a specific subscription by ID
  async findOne(id: string, page: number = 1, limit: number = 10): Promise<subscriptionEntity | any> {
    const [subscriptions, total] = await this.subscriptionRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      relations: ['restaurant', 'package'],
    });
    return {
      data: subscriptions,
      total,
      page,
      limit,
      lastPage: Math.ceil(total / limit),
    };
  }

  // Update a subscription
  async update(id: string, updateSubscriptionDto: UpdateSubscriptionDto): Promise<subscriptionEntity> {
    const subscription = await this.findOne(id);
    const updatedSubscription = Object.assign(subscription, updateSubscriptionDto);
    return await this.subscriptionRepository.save(updatedSubscription);
  }

  // Delete a subscription
  async delete(id: string): Promise<Boolean> {
    const deleteResult = await this.subscriptionRepository.delete(id);
    if (!deleteResult.affected) {
      throw new NotFoundException(`Subscription with ID ${id} not found`);
    }
    return true
  }
}
