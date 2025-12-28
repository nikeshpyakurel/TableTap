import { Column, Entity } from "typeorm";
import { parentEntity } from ".";
import { BusinessType, leadStatus } from "src/helper/types/index.type";

@Entity('enquiry')
export class enquiryEntity extends parentEntity{
    @Column() 
    name:string;

    @Column()
    contact:string;

    @Column()
    email:string;

    @Column()
    businessName:string;

    @Column()
    businessType:BusinessType;

    @Column({default:leadStatus.recent})
    leadStatus:leadStatus;
}