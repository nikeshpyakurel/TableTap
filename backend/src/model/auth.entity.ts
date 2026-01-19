import { Column, Entity, OneToMany, OneToOne } from "typeorm";
import { parentEntity } from ".";
import { roleType } from "src/helper/types/index.type";
import { restaurantEntity } from "./Restaurant.entity";
import { superAdminEntity } from "./superAdmin.entity";
import { staffEntity } from "./staff.entity";
@Entity('Auth')
export class authEntity extends parentEntity {
    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column()
    role: roleType;

    @Column({ default: null })
    rToken: string;

    @OneToOne(() => superAdminEntity, (sAdmin) => sAdmin.auth)
    superAdmin: superAdminEntity

    @OneToOne(() => restaurantEntity, (restaurant) => restaurant.auth, {
        onDelete: 'CASCADE',
    })
    restaurant: restaurantEntity;

    @OneToOne(() => staffEntity, (staff) => staff.auth)
    staff: staffEntity;
}