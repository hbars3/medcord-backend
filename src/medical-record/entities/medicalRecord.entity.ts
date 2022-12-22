import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('medical_records')
export class MedicalRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({
    length: 12,
  })
  dni: string;

  @Column()
  birthplace: string;

  @Column({
    type: Date,
  })
  birthdate: Date;

  @Column({
    enum: ['Peruvian', 'Venezuelan', 'Other'],
  })
  nationality: string;

  @Column({
    enum: ['Male', 'Female', 'Other'],
  })
  gender: string;

  @Column()
  address: string;

  @Column()
  telephone: string;
}