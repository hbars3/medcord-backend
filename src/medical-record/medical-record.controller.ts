import { Body, Controller, Get, HttpStatus, Post, Query, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { MedicalRecordService } from './medical-record.service';
import { MedicalRecordRegisterDto } from './dto/medicalRecordRegisterDto.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MedicalRecord } from './entities/medicalRecord.entity';
import { MedicalRecordGetByPatientDto } from './dto/medicalRecordGetByPatientDto.dto';

@Controller('medical-records')
@ApiTags('Medical Records Management')
export class MedicalRecordController {
    constructor(private readonly medicalRecordsService: MedicalRecordService) {}

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('access-token')
    @Post('/create')
    async register(@Res() res: Response, @Body() body: MedicalRecordRegisterDto) {
      try {
        const msg = await this.medicalRecordsService.create(body);
        return res.status(HttpStatus.OK).json(msg);
      } catch (error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          msg: 'No se pudo crear la historia medica',
          error
        });
      }
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('access-token')
    @Get('')
    async getMedicalRecords(
      @Res() res: Response
    ) {
      try {
        const medicalRecords: MedicalRecord[] = await this.medicalRecordsService.getMedicalRecords();
        return res.status(HttpStatus.OK).json(medicalRecords);
      } catch (error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          msg: 'No se pudo crear la historia medica',
          error
        });
      }
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('access-token')
    @Get('/getByPatientName')
    async getMedicalRecordsByPatientName(
      @Res() res: Response,
      @Query() query: MedicalRecordGetByPatientDto
    ) {
      try {
        const medicalRecord: MedicalRecord = await this.medicalRecordsService.getByPatientName(query.firstName, query.lastName);
        if(!medicalRecord) {
          return res.status(HttpStatus.BAD_REQUEST).json({
            msg: "No se encontró ninguna historia medica"
          });
        }
        return res.status(HttpStatus.OK).json(medicalRecord);
      } catch (error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          msg: 'No se pudo crear la historia medica',
          error
        });
      }
    }
}
