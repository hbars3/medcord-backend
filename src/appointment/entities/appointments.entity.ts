import { User } from 'src/users/entities/users.entity';
import {Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne} from 'typeorm'
import { MedicalRecord } from '../../medical-record/entities/medicalRecord.entity';

@Entity("appointments")
export class Appointment {

    @PrimaryGeneratedColumn()
    id?: number

    @Column({
        enum: ['Medicina General', 'Oftalmologia', 'Pediatria'],
    })
    specialty: string;

    @ManyToOne(() => User, (user) => user.appointments, {
        cascade: true
    })
    @JoinColumn() 
    doctor: User;

    @ManyToOne(() => MedicalRecord, (medicalRecord) => medicalRecord.appointments, {
        cascade: true
    })
    @JoinColumn() 
    medicalRecord: MedicalRecord;

    @Column()
    date: Date;

    @Column()
    hour: Date;

    @Column({
        default: ''
    })
    analysis?: string;

    @Column({
        default: ''
    })
    diagnostic?: string;

    @Column({
        default: ''
    })
    medicines?: string;
}