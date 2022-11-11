import {Entity, Column, PrimaryGeneratedColumn} from 'typeorm'

@Entity()
export class Note {

    @PrimaryGeneratedColumn()
    id: number

    @Column({
        default: ''
    })
    title: string;

    @Column({
        default: ''
    })
    description: string;

    @Column({
        default: false
    })
    archived: boolean;

}