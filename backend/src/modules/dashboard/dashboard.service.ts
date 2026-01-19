import { Injectable } from '@nestjs/common';
import { CreateDashboardDto } from './dto/create-dashboard.dto';
import { UpdateDashboardDto } from './dto/update-dashboard.dto';
import { OrderService } from '../order/order.service';
import { TakeawayOrderService } from '../takeaway_order/takeaway_order.service';
import { ProductService } from '../product/product.service';
import { InjectRepository } from '@nestjs/typeorm';
import { orderEntity } from 'src/model/order.entity';
import { Repository, Between } from 'typeorm';
import {
  DateRangeType,
  dateType,
  orderStatus,
} from 'src/helper/types/index.type';
import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  setMilliseconds,
  setSeconds,
  setMinutes,
  setHours,
  subDays,
  subWeeks,
  subMonths,
} from 'date-fns';
import { productEntity } from 'src/model/Product.entity';
import { categoryEntity } from 'src/model/Category.entity';
import { tableEntity } from 'src/model/table.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(orderEntity)
    private readonly orderRepo: Repository<orderEntity>,

    @InjectRepository(productEntity)
    private readonly productRepo: Repository<productEntity>,

    @InjectRepository(categoryEntity)
    private readonly categoryRepo: Repository<categoryEntity>,

    @InjectRepository(tableEntity)
    private readonly tableRepo: Repository<tableEntity>,

    private readonly orderService: OrderService,

    private readonly takeAwayOrderService: TakeawayOrderService,
  ) { }

  async findAllSales(id: string) {
    const day = await this.findOrderSales(id, dateType.day);
    const week = await this.findOrderSales(id, dateType.week);
    const month = await this.findOrderSales(id, dateType.month);
    return { day, week, month };
  }

  async findPopularItem(id: string) {
    const products = await this.productRepo.find({
      where: {
        categories: {
          restaurant: { id },
        },
      },
      order: {
        orderCount: 'DESC',
      },
      take: 10,
    });

    return products;
  }

  async findRestroInfo(id: string) {

    const productCount = await this.productRepo.count({
      where: {
        categories: {
          restaurant: { id },
        },
      },
      relations: ['categories', 'categories.restaurant'],
    });

    const categoriesCount = await this.categoryRepo.count({
      where: { restaurant: { id } },
    });
    const tableCount = await this.tableRepo.count({
      where: { restaurant: { id } },
    });



    return {
      product: productCount,
      category: categoriesCount,
      table: tableCount,
    };
  }
  async findAllOrder(id: string) {
    const dayOrder = await this.findOrder(id, dateType.day);
    const weekOrder = await this.findOrder(id, dateType.week);
    const monthOrder = await this.findOrder(id, dateType.month);
    return {
      dayOrder,
      weekOrder,
      monthOrder,
    };
  }

  findDateRange(type: DateRangeType) {
    let startDate: Date;
    let endDate: Date;

    const now = new Date();
    switch (type) {
      case dateType.day:
        startDate = startOfDay(now);
        endDate = endOfDay(now);
        break;
      case dateType.week:
        startDate = startOfWeek(now);
        endDate = endOfWeek(now);
        break;
      case dateType.month:
        startDate = startOfMonth(now);
        endDate = endOfMonth(now);
        break;
      default:
        throw new Error(
          'Invalid type specified. Use "day", "week", or "month".',
        );
    }
    return { startDate, endDate };
  }
  findPreviousDateRange(type: DateRangeType) {
    let startDate: Date;
    let endDate: Date;

    const now = new Date();

    switch (type) {
      case dateType.day:
        const previousDay = subDays(now, 1);
        startDate = startOfDay(previousDay);
        endDate = endOfDay(previousDay);
        break;

      case dateType.week:
        const previousWeek = subWeeks(now, 1);
        startDate = startOfWeek(previousWeek);
        endDate = endOfWeek(previousWeek);
        break;

      case dateType.month:
        const previousMonth = subMonths(now, 1);
        startDate = startOfMonth(previousMonth);
        endDate = endOfMonth(previousMonth);
        break;

      default:
        throw new Error(
          'Invalid type specified. Use "day", "week", or "month".',
        );
    }

    return { startDate, endDate };
  }

  async findOrderSales(id: string, type: DateRangeType) {
    const date = this.findDateRange(type);
    const previousDate = this.findPreviousDateRange(type);
    const orders = await this.orderRepo.find({
      where: {
        restaurant: { id },
        status: orderStatus.completed,
        createdAt: Between(date.startDate, date.endDate),
      },
      relations: ['orderItem.product', 'orderItem.orderAddOn.productAddOn'],
    });

    const previousOrders = await this.orderRepo.find({
      where: {
        restaurant: { id },
        status: orderStatus.completed,
        createdAt: Between(previousDate.startDate, previousDate.endDate),
      },
      relations: ['orderItem.product', 'orderItem.orderAddOn.productAddOn'],
    });

    const totalSalesAmount =
      orders.length > 0 ? await this.findAmount(orders) : 0;
    const previousTotalSalesAmount =
      previousOrders.length > 0 ? await this.findAmount(previousOrders) : 0;

    let percentageChange = 0;
    if (previousTotalSalesAmount === 0) {
      percentageChange = totalSalesAmount > 0 ? 100 : 0;
    } else {
      percentageChange =
        ((totalSalesAmount - previousTotalSalesAmount) /
          previousTotalSalesAmount) *
        100;
    }
    return {
      totalSalesAmount,
      previousTotalSalesAmount,
      percentageChange: parseFloat(percentageChange.toFixed(2)),
    };
  }

  async findAmount(orders): Promise<number> {
    let t_amount = 0;
    orders.forEach((order) => {
      let amount = this.orderService.totalBillAmount(order);
      t_amount += amount;
    });
    return t_amount;
  }

  async findOrder(id: string, type: dateType) {
    const date = this.findDateRange(type);
    const previousDate = this.findPreviousDateRange(type);
    const orderCount = await this.orderRepo.count({
      where: {
        restaurant: { id },
        status: orderStatus.completed,
        createdAt: Between(date.startDate, date.endDate),
      },
    });
    const previousOrderCount = await this.orderRepo.count({
      where: {
        restaurant: { id },
        status: orderStatus.completed,
        createdAt: Between(previousDate.startDate, previousDate.endDate),
      },
    });

    const percentageChange = previousOrderCount
      ? ((orderCount - previousOrderCount) / previousOrderCount) * 100
      : orderCount > 0
        ? 100
        : 0;

    return {
      orderCount,
      previousOrderCount,
      percentageChange: parseFloat(percentageChange.toFixed(2)),
    };
  }
}
