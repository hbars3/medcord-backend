import {Entity, Column, PrimaryGeneratedColumn, OneToMany} from 'typeorm'
import { Appointment } from '../../appointment/entities/appointments.entity';
import { MedicalRecord } from '../../medical-record/entities/medicalRecord.entity';

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
        enum: ['DOCTOR', 'NURSE', 'NONE'],
    })
    role: string;

    @OneToMany(() => Appointment, (appointment) => appointment.doctor)
    appointments: Appointment[]
}