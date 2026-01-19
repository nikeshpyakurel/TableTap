import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { parentEntity } from ".";
import { orderItemEntity } from "./orderItem.entity";
import { productAddOnEntity } from "./Product_Addon.entity";

@Entity('orderItemAddOn')
export class orderItemAddOnEntity extends parentEntity{

    @Column({default:0})
    quantity:number

    @ManyToOne(()=>productAddOnEntity,(addOn)=>addOn.orderItemAddOn,{onDelete:'CASCADE'})
    productAddOn:productAddOnEntity;

    @ManyToOne(()=>orderItemEntity,(order)=>order.orderAddOn,{onDelete:'CASCADE'})
    orderItem:orderItemEntity;

}