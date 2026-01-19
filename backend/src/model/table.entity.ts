import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { parentEntity } from ".";
import { tableStatus } from "src/helper/types/index.type";
import { restaurantEntity } from "./Restaurant.entity";
import { sessionEntity } from "./session.entity";

@Entity('table')
export class tableEntity extends parentEntity {
    @Column()
    name: string

    @Column({ nullable: true })
    qr: string

    @Column({ default: tableStatus.available })
    status: tableStatus;

    @ManyToOne(() => restaurantEntity, (restaurant) => restaurant.table, {
        onDelete: 'CASCADE',
    })
    restaurant: restaurantEntity;

    @OneToMany(() => sessionEntity, (session) => session.table)
    session: sessionEntity[];
}