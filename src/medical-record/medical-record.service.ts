import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MedicalRecord } from './entities/medicalRecord.entity';
import { MedicalRecordRegisterDto } from './dto/medicalRecordRegisterDto.dto';

@Injectable()
export class MedicalRecordService {
  constructor(
    @InjectRepository(MedicalRecord)
    private medicalRecordsRepository: Repository<MedicalRecord>,
  ) {}

  async create(body: MedicalRecordRegisterDto) {
    const newMedicalRecord = this.medicalRecordsRepository.create(body);
    await this.medicalRecordsRepository.save(newMedicalRecord);
    return {
      medicalRecord: newMedicalRecord,
    };
  }
}
