import { Column, Entity } from "typeorm";
import { parentEntity } from ".";

@Entity('image-library')
export class imgLibrary extends parentEntity {
    @Column()
    name: string;

    @Column()
    src: string;
}