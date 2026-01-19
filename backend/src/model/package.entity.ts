import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { parentEntity } from ".";
import { subscriptionEntity } from "./subscription.entity";

@Entity('package')
export class packageEntity extends parentEntity {
    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    total_categories: number;

    @Column()
    total_table: number;

    @Column({ type: 'decimal' })
    monthly_price: number;

    @Column({ type: 'decimal' })
    yearly_price: number;

    @Column({ nullable: true })
    total_products: number;

    @Column({ nullable: true })
    total_user: number;

    @OneToMany(() => subscriptionEntity, (subscription) => subscription.package)
    subscription: subscriptionEntity[];
}