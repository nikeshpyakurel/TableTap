// session.entity.ts
import { Column, Entity, ManyToOne, OneToOne } from 'typeorm';
import { parentEntity } from '.';
import { tableEntity } from './table.entity';
import { orderEntity } from './order.entity';

@Entity('session')
export class sessionEntity extends parentEntity {
  @Column({ type: 'bigint' })
  phone: number;

  @Column({ default: new Date() })
  startedAt: Date;

  @Column({ nullable: true, default: null })
  endedAt: Date;

  @ManyToOne(() => tableEntity, (table) => table.session, { onDelete: 'CASCADE',cascade:true })
  table: tableEntity;

  @OneToOne(() => orderEntity, (order) => order.session,{onDelete:'CASCADE'})
  order: orderEntity;
}
