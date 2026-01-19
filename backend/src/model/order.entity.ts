// order.entity.ts
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { parentEntity } from '.';
import { orderStatus, orderType } from 'src/helper/types/index.type';
import { sessionEntity } from './session.entity';
import { orderItemEntity } from './orderItem.entity';
import { billingEntity } from './billing.entity';
import { restaurantEntity } from './Restaurant.entity';

@Entity('order')
export class orderEntity extends parentEntity {
  @Column({ default: orderType.table })
  type: orderType;

  @Column({ default: null })
  remarks: string;

  @Column({ default: orderStatus.pending })
  status: orderStatus;

  @OneToOne(() => sessionEntity, (session) => session.order, {
    onDelete: 'CASCADE', cascade: true
  })
  @JoinColumn({ name: 'sessionId' })
  session: sessionEntity;

  @OneToMany(() => orderItemEntity, (item) => item.order, { cascade: true })
  orderItem: orderItemEntity[];

  @OneToOne(() => billingEntity, (billing) => billing.order, {
    onDelete: 'CASCADE',
  })
  billing: billingEntity;

  @ManyToOne(() => restaurantEntity, (res) => res.order, {
    onDelete: 'CASCADE',
  })
  restaurant: restaurantEntity;
}
