import { Column, Entity } from "typeorm";
import { parentEntity } from ".";

@Entity('icon-library')
export class iconLibrary extends parentEntity {
    @Column()
    name: string;

    @Column()
    src: string;
}