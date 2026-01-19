import { Column, Entity, JoinTable, ManyToMany, ManyToOne, } from "typeorm";
import { parentEntity } from ".";
import { staffTypeEntity } from "./staffType.entity";

@Entity('permission')
export class staffPermissionEntity extends parentEntity {
    @Column()
    name: string;

    @ManyToMany(()=>staffTypeEntity,(staffType)=>staffType.permission)
    @JoinTable({name:'staff_permission'})
    staffType:staffTypeEntity[];
}