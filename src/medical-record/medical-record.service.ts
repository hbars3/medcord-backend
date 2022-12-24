import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { MedicalRecord } from './entities/medicalRecord.entity';
import { MedicalRecordRegisterDto } from './dto/medicalRecordRegisterDto.dto';

@Injectable()
export class MedicalRecordService {
  constructor(
    @InjectRepository(MedicalRecord)
    private medicalRecordsRepository: Repository<MedicalRecord>,
  ) {}

  async create(body: MedicalRecordRegisterDto): Promise<MedicalRecord> {
    const newMedicalRecord = this.medicalRecordsRepository.create(body);
    await this.medicalRecordsRepository.save(newMedicalRecord);
    return newMedicalRecord;
  }

  async getMedicalRecords(): Promise<MedicalRecord[]> {
    const medicalRecords: MedicalRecord[] = await this.medicalRecordsRepository.find();
    return medicalRecords;
  }

  async getByPatientName(firstName: string, lastName: string): Promise<MedicalRecord> {
    const medicalRecord: MedicalRecord = await this.medicalRecordsRepository.findOne({
      where: { firstName: Like(`%${firstName}%`), lastName: Like(`%${lastName}%`) }});
      return medicalRecord;
  }

  async getById(id: number): Promise<MedicalRecord> {
    const medicalRecord: MedicalRecord = await this.medicalRecordsRepository.findOne(id);
    return medicalRecord;
  }

  async isAlreadyRegistered(id: number) {
    const medicalRecord = await this.medicalRecordsRepository.findOne(
      id, 
      { select: ['id'] });

    console.log(!!medicalRecord);
    return !!medicalRecord;
  }
}
