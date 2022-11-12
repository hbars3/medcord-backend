import {Entity, Column, PrimaryGeneratedColumn} from 'typeorm'

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number

    @Column({
        default: ''
    })
    name: string;

    @Column({
        default: ''
    })
    lastname: string;

    @Column({
        default: ''
    })
    gender: string;

    @Column({
        default: ''
    })
    dni: string;

    @Column({
        default: ''
    })
    email: string;

    @Column({
        default: ''
    })
    password: string;

    @Column({
        default: ''
    })
    telephone: string;

    @Column({
        default: ''
    })
    role: string;

    @Column({
        default: ''
    })
    permissions: string;

    @Column({
        default: false
    })
    verified: boolean;

}