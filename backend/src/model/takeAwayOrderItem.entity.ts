import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { parentEntity } from ".";
import { takeAwayOrderEntity } from "./takeAwayOrder.entity";
import { takeAwayOrderAddOnEntity } from "./addOnTakeAwayOrder.entity";
import { productEntity } from "./Product.entity";

@Entity('takeAwayOrderItem')
export class takeAwayOrderItemEntity extends parentEntity {

    @Column()
    quantity: number;

    @Column()
    price: number;

    @ManyToOne(() => takeAwayOrderEntity, (order) => order.takeAwayOrderItems, { onDelete: 'CASCADE' })
    takeAwayOrder: takeAwayOrderEntity;

    @ManyToOne(() => productEntity, (product) => product.takeAwayOrderItems,{onDelete:'CASCADE'})
    @JoinColumn({ name: 'productId' })
    product: productEntity;

    @OneToMany(() => takeAwayOrderAddOnEntity, (addOn) => addOn.takeAwayOrderItem)
    takeAwayOrderAddOn: takeAwayOrderAddOnEntity[];
}