import { Body, Controller, HttpStatus, Inject, Post, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { MedicalRecordService } from './medical-record.service';
import { MedicalRecordRegisterDto } from './dto/medicalRecordRegisterDto.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('medical-record')
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
          error,
        });
      }
    }

}
