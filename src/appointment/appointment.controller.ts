import { Body, Controller, Get, HttpStatus, Post, Put, Query, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AppointmentRegisterDto } from './dto/appointmentRegisterDto.dto';
import { AppointmentService } from './appointment.service';
import { AppointmentGetByDoctorAndMedicalRecordDto } from './dto/appointmentGetByDoctorAndMedicalRecordDto.dto';
import { Appointment } from './entities/appointments.entity';
import { AppointmentUpdateDto } from './dto/appointmentUpdateDto.dto';

@Controller('appointment')
@ApiTags('Appointment Management')
export class AppointmentController {
    constructor(private readonly appointmentsService: AppointmentService) {}

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('access-token')
    @Post('/create')
    async register(@Res() res: Response, @Body() body: AppointmentRegisterDto) {
      try {
        if (!(await this.appointmentsService.isValid(body.doctorEmail, body.medicalRecordId))) {
          return res.status(HttpStatus.BAD_REQUEST).json({
            msg: 'Doctor o Historia medica no valida'
          });
        }

        const msg = await this.appointmentsService.create(body);
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
    @Get('/getByDoctorAndMedicalRecordIds')
    async getAppointmentByDoctorAndMedicalRecordIds(
      @Res() res: Response,
      @Query() query: AppointmentGetByDoctorAndMedicalRecordDto
    ) {
      try {
        const appointment: Appointment = await this.appointmentsService.getByDoctorAndMedicalRecordIds(query.doctorId, query.medicalRecordId);
        if(!appointment) {
          return res.status(HttpStatus.BAD_REQUEST).json({
            msg: "No se encontró ninguna cita"
          });
        }
        return res.status(HttpStatus.OK).json(appointment);
      } catch (error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          msg: 'No se pudo buscar la cita',
          error
        });
      }
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('access-token')
    @Put('')
    async update(
      @Res() res: Response,
      @Query() query: AppointmentGetByDoctorAndMedicalRecordDto,
      @Body() body: AppointmentUpdateDto
    ) {
      try {
        let appointment: Appointment = await this.appointmentsService.getByDoctorAndMedicalRecordIds(query.doctorId, query.medicalRecordId);
        if(!appointment) {
          return res.status(HttpStatus.BAD_REQUEST).json({
            msg: "No se encontró ninguna cita"
          });
        }

        appointment = await this.appointmentsService.update(appointment.id, query, body);

        return res.status(HttpStatus.OK).json({
          appointment,
          msg: 'La cita fue actualizada correctamente'
        });
      } catch (error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          msg: 'No se pudo buscar la cita',
          error
        });
      }
    }
}
