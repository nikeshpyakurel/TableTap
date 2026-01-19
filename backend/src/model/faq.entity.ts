import { Column, Entity } from "typeorm";
import { parentEntity } from ".";

@Entity('faq')
export class FaqEntity extends parentEntity{
    @Column()
    question:string;

    @Column()
    answer:string;
}