import { Column, Entity, ManyToOne } from "typeorm";
import { parentEntity } from ".";
import { paymentMethod } from "src/helper/types/index.type";
import { billingEntity } from "./billing.entity";

@Entity('bill-payment')
export class billPaymentEntity extends parentEntity{
    @Column()
    amount:number;

    @Column()
    method:paymentMethod;

    @Column()
    remarks:string;

    @ManyToOne(()=>billingEntity,(billing)=>billing.payment,{onDelete:'CASCADE'})
    billing:billingEntity;
}