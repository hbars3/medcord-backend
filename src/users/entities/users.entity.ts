import {Entity, Column, PrimaryGeneratedColumn} from 'typeorm'

@Entity("users")
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
        enum: ['Hombre', 'Mujer', 'Otro'],
    })
    gender: string;

    @Column({
        default: ''
    })
    dni: string;

    @Column({
        default: '',
        unique: true
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
}