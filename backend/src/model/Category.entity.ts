import { Column, Entity, ManyToMany, ManyToOne } from "typeorm";
import { parentEntity } from ".";
import { CategoryStatus } from "src/helper/types/index.type";
import { restaurantEntity } from "./Restaurant.entity";
import { productEntity } from "./Product.entity";

@Entity('Category')
export class categoryEntity extends parentEntity {
    @Column()
    name: string;

    @Column({ default: null })
    photo: string;

    @Column({ default: CategoryStatus.available })
    status: CategoryStatus;

    @ManyToOne(() => restaurantEntity, (product) => product.categories, {
        onDelete: 'CASCADE',
    })
    restaurant: restaurantEntity;

    @ManyToMany(() => productEntity, (product) => product.categories, {
        onDelete: 'CASCADE',
    })
    products: productEntity[];

}