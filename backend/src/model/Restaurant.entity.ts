import { RestaurantStatus } from "src/helper/types/index.type";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { parentEntity } from ".";
import { categoryEntity } from "./Category.entity";
import { authEntity } from "./auth.entity";
import { staffEntity } from "./staff.entity";
import { tableEntity } from "./table.entity";
import { billingEntity } from "./billing.entity";
import { staffTypeEntity } from "./staffType.entity";
import { takeAwayOrderEntity } from "./takeAwayOrder.entity";
import { subscriptionEntity } from "./subscription.entity";
import { orderEntity } from "./order.entity";

@Entity('Restaurant')
export class restaurantEntity extends parentEntity {

    @Column()
    name: string;

    @Column()
    address: string;

    @Column()
    zip_code: string;

    @Column({ default: null })
    photo: string;

    @Column({ default: null })
    coverImage: string;

    @Column({default:"#ec5b00"})
    theme:string;

    @Column({ default: null })
    phone: string;

    @Column({ default: RestaurantStatus.active })
    status: RestaurantStatus;

    @OneToMany(() => categoryEntity, (category) => category.restaurant)
    categories: categoryEntity[];

    @OneToOne(() => authEntity, (auth) => auth.restaurant, { cascade: true, onDelete: 'CASCADE' })
    @JoinColumn()
    auth: authEntity;

    @OneToMany(() => staffEntity, (staff) => staff.restaurant)
    staff: staffEntity;

    @OneToMany(() => staffTypeEntity, (staffType) => staffType.restaurant)
    staffType: staffTypeEntity[];

    @OneToMany(() => tableEntity, (table) => table.restaurant)
    table: tableEntity[];

    @OneToMany(() => takeAwayOrderEntity, (table) => table.restaurant)
    takeAwayOrder: takeAwayOrderEntity[];

    @OneToMany(() => billingEntity, (billing) => billing.restaurant)
    billing: billingEntity[];

    @OneToMany(() => subscriptionEntity, (subscription) => subscription.restaurant)
    subscription: subscriptionEntity[];

    @OneToMany(() => orderEntity, (subscription) => subscription.restaurant)
    order: orderEntity[];
}