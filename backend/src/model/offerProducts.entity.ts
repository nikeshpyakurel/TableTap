// import { ManyToMany, ManyToOne } from "typeorm";
// import { parentEntity } from ".";
// import { productEntity } from "./Product.entity";
// import { offerEntity } from "./offer.entity";

// export class offerProductsEntity extends parentEntity{
//     @ManyToOne(()=>productEntity,(product)=>product.offerProduct)
//     product:productEntity;

//     @ManyToMany(()=>offerEntity,(offer)=>offer.offerProduct)
//     offer:offerEntity[];
// }