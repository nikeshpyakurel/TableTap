import { Column, Entity, JoinTable, ManyToMany, OneToMany } from "typeorm";
import { parentEntity } from ".";
import { ProductStatus } from "src/helper/types/index.type";
import { categoryEntity } from "./Category.entity";
import { productAddOnEntity } from "./Product_Addon.entity";
import { orderItemEntity } from "./orderItem.entity";
import { takeAwayOrderItemEntity } from "./takeAwayOrderItem.entity";

@Entity('Product')
export class productEntity extends parentEntity {
    @Column()
    name: string;

    @Column({ nullable: true })
    description: string

    @Column()
    price: number;

    @Column({ default: 0 })
    discount: number;

    @Column()
    isVeg: boolean;

    @Column({default: false})
    isAgeRestricted: boolean;

    @Column({ default: 0 })
    orderCount: number;

    @Column({ default: ProductStatus.available })
    status: ProductStatus;

    @Column({ nullable: true })
    photo: string;

    @Column({ default: false })
    special: boolean;

    @ManyToMany(() => categoryEntity, (category) => category.products, {
        onDelete: 'CASCADE',
    })
    @JoinTable({ name: 'category_productId' })
    categories: categoryEntity[];

    @OneToMany(() => productAddOnEntity, (productAdd) => productAdd.product, { onDelete: 'CASCADE' })
    productAddons: productAddOnEntity[];

    @OneToMany(() => takeAwayOrderItemEntity, (takeAwayItem) => takeAwayItem.product)
    takeAwayOrderItems: takeAwayOrderItemEntity[];

    @OneToMany(() => orderItemEntity, (order) => order.product)
    orderItem: orderItemEntity[];

}