import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { parentEntity } from ".";
import { paymentMethod } from "src/helper/types/index.type";
import { subscriptionEntity } from "./subscription.entity";
import { packageEntity } from "./package.entity";

@Entity('packagePayment')
export class packagePaymentEntity extends parentEntity {
    @Column({ type: 'decimal', nullable: true })
    paymentAt: Date;

    @Column({ type: 'decimal', nullable: true })
    Amount: number;

    @Column({ nullable: true })
    mode: string

    @Column({ nullable: true })
    proof: string

    @OneToOne(() => subscriptionEntity, (subscription) => subscription.packagePayment, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'subscriptionId' })
    subscription: subscriptionEntity;
}