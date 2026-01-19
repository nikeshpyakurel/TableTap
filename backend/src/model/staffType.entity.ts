import { Column, Entity, ManyToMany, ManyToOne, OneToMany } from "typeorm";
import { parentEntity } from ".";
import { staffEntity } from "./staff.entity";
import { staffPermissionEntity } from "./staffPermission.entity";
import { restaurantEntity } from "./Restaurant.entity";

@Entity('staffType')
export class staffTypeEntity extends parentEntity {
    @Column()
    name: string

    @OneToMany(() => staffEntity, (staff) => staff.staffType)
    staff: staffEntity[];

    @ManyToOne(() => restaurantEntity, (restaurant) => restaurant.staffType, {
        onDelete: 'CASCADE',
    })
    restaurant: restaurantEntity;

    @ManyToMany(() => staffPermissionEntity, (permission) => permission.staffType)
    permission: staffPermissionEntity[];
}