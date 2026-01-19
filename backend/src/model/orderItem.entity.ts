import { Column, Entity, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { parentEntity } from ".";
import { orderEntity } from "./order.entity";
import { orderItemAddOnEntity } from "./orderItemAddOn.entity";
import { productEntity } from "./Product.entity";
import { orderStatus } from "src/helper/types/index.type";

@Entity('orderItem')
export class orderItemEntity extends parentEntity{
    @Column()
    quantity:number;

    @Column({default:orderStatus.pending})
    status:orderStatus;

    @ManyToOne(()=>productEntity,(product)=>product.orderItem,{onDelete:'CASCADE'})
    product:productEntity;

    @ManyToOne(()=>orderEntity,(order)=>order.orderItem,{onDelete:'CASCADE'})
    order:orderEntity;

    @OneToMany(()=>orderItemAddOnEntity,(addOn)=>addOn.orderItem)
    orderAddOn:orderItemAddOnEntity[];
    
}