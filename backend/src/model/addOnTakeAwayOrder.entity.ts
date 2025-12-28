import { Column, Entity, ManyToOne } from "typeorm";
import { parentEntity } from ".";
import { takeAwayOrderItemEntity } from "./takeAwayOrderItem.entity";
import { productAddOnEntity } from "./Product_Addon.entity";

@Entity('takeAwayOrderItemAddOn')
export class takeAwayOrderAddOnEntity extends parentEntity {

    @ManyToOne(() => takeAwayOrderItemEntity, (order) => order.takeAwayOrderAddOn, { onDelete: 'CASCADE' })
    takeAwayOrderItem: takeAwayOrderItemEntity;

    @ManyToOne(() => productAddOnEntity, (addon) => addon.takeAwayOrderItem, { onDelete: 'CASCADE' })
    productAddOn: productAddOnEntity;



}