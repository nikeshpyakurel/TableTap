import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { parentEntity } from ".";
import { productEntity } from "./Product.entity";
import { orderItemAddOnEntity } from "./orderItemAddOn.entity";
import { takeAwayOrderAddOnEntity } from "./addOnTakeAwayOrder.entity";
@Entity('Product_Addon')
export class productAddOnEntity extends parentEntity {
    @Column()
    name: string;

    @Column()
    price: number;

    @ManyToOne(() => productEntity, (product) => product.productAddons, { onDelete: "CASCADE" })
    product: productEntity;

    @OneToMany(() => orderItemAddOnEntity, (product) => product.productAddOn)
    orderItemAddOn: orderItemAddOnEntity[];

    @OneToMany(() => takeAwayOrderAddOnEntity, (takeaway) => takeaway.takeAwayOrderItem)
    takeAwayOrderItem: takeAwayOrderAddOnEntity[];
}