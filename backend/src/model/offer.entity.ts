// import { Column, JoinTable, ManyToMany } from "typeorm";
// import { parentEntity } from ".";
// import { offerProductsEntity } from "./offerProducts.entity";

// export class offerEntity extends parentEntity{
// @Column()
// name:string;

// @Column()
// discountPercent:number;

// @ManyToMany(()=>offerProductsEntity,(op)=>op.offer)
// @JoinTable({name:'offerProductId'})
// offerProduct:offerProductsEntity[];

// }