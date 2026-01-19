import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { parentEntity } from ".";
import { authEntity } from "./auth.entity";
import { restaurantEntity } from "./Restaurant.entity";
import { staffTypeEntity } from "./staffType.entity";
import { billingEntity } from "./billing.entity";

@Entity('staff')
export class staffEntity extends parentEntity {
    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column()
    address: string;

    @Column({ default: null })
    photo: string;

    @Column({ type: 'bigint', unique: false, nullable: true })
    phone: number;

    @ManyToOne(() => restaurantEntity, (restaurant) => restaurant.staff, {
        onDelete: 'CASCADE',
    })
    restaurant: restaurantEntity;

    @OneToOne(() => authEntity, (auth) => auth.staff)
    @JoinColumn({ name: "authId" })
    auth: authEntity;

    @ManyToOne(() => staffTypeEntity, (role) => role.staff)
    @JoinColumn({ name: "staffTypeId" })
    staffType: staffTypeEntity;
}