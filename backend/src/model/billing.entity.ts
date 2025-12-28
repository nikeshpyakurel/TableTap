import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { parentEntity } from '.';
import { restaurantEntity } from './Restaurant.entity';
import { orderEntity } from './order.entity';
import { takeAwayOrderEntity } from './takeAwayOrder.entity';
import { billPaymentEntity } from './billPayment.entity';
import { staffEntity } from './staff.entity';
import { billingStatus } from 'src/helper/types/index.type';

@Entity('billing')
export class billingEntity extends parentEntity {
  @Column()
  totalPaidAmount: number;

  @Column({ default: 0 })
  discount: number;

  @Column()
  status: billingStatus;

  @ManyToOne(() => restaurantEntity, (restaurant) => restaurant.billing, {
    onDelete: 'CASCADE',
  })
  restaurant: restaurantEntity;

  @OneToOne(() => orderEntity, (order) => order.billing, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'orderId' })
  order: orderEntity;  

  @OneToOne(() => takeAwayOrderEntity, (order) => order.billing, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'takeAwayOrder' })
  takeAwayOrder: takeAwayOrderEntity;

  @OneToMany(() => billPaymentEntity, (payment) => payment.billing, {
    onDelete: 'CASCADE',
  })
  payment: billPaymentEntity[];

  // @OneToOne(() => staffEntity, (staff) => staff.billing, {
  //   onDelete: 'CASCADE',
  // })
  // @JoinColumn({ name: 'staffId' })
  // staff: staffEntity;
}