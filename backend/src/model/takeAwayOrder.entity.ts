import { Column, Entity, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { parentEntity } from '.';
import { restaurantEntity } from './Restaurant.entity';
import { billingEntity } from './billing.entity';
import { takeAwayOrderItemEntity } from './takeAwayOrderItem.entity';
import { orderStatus } from 'src/helper/types/index.type';

@Entity('takeAwayOrder')
export class takeAwayOrderEntity extends parentEntity {
  @Column({default:null})
  customerName: string;

  @Column({ type: 'bigint' ,default:null})
  phone: number;

  @Column({ default: 0 })
  discount: number;

  @Column({default:orderStatus.pending})
  status:orderStatus;

  @OneToMany(() => takeAwayOrderItemEntity, (item) => item.takeAwayOrder)
  takeAwayOrderItems: takeAwayOrderItemEntity[];

  @ManyToOne(() => restaurantEntity, (restaurant) => restaurant.takeAwayOrder, {
    onDelete: 'CASCADE',
  })
  restaurant: restaurantEntity;

  @OneToOne(() => billingEntity, (billing) => billing.takeAwayOrder, {
    onDelete: 'CASCADE',
  })
  billing: billingEntity;
}
