import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { parentEntity } from ".";
import { restaurantEntity } from "./Restaurant.entity";
import { packageEntity } from "./package.entity";
import { packagePaymentEntity } from "./packagePayment.entity";

@Entity('subscription')
export class subscriptionEntity extends parentEntity {
    @Column()
    startDate: Date;

    @Column()
    endDate: Date;

    @ManyToOne(() => restaurantEntity, (restaurant) => restaurant.subscription, {
        onDelete: 'CASCADE',
    })
    restaurant: restaurantEntity;

    @ManyToOne(() => packageEntity, (pckg) => pckg.subscription)
    package: packageEntity;

    @OneToOne(() => packagePaymentEntity, (pkg) => pkg.subscription)
    @JoinColumn({ name: 'packagePaymentId' })
    packagePayment: packagePaymentEntity;
}