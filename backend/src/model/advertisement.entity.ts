import { Column, Entity } from "typeorm";
import { parentEntity } from ".";
import { adActiveStatus, adPage, adType } from "src/helper/types/index.type";


@Entity('advertisement')
export class advertisementEntity extends parentEntity {
    @Column({nullable:true})
    title: string; 
    
    @Column()
    image: string;

    @Column()
    url: string;

    @Column({default:adActiveStatus.false})
    isActive: adActiveStatus;

    // @Column({ type: "enum", enum: adPage })
    // page: adPage;

    @Column({ type: "enum", enum: adType })
    adType: adType;

    @Column({default:0})
    clickCount:number;

    @Column()
    startDate: Date;

    @Column()
    endDate: Date;


}