import { Body, Controller, HttpStatus, Post, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AppointmentRegisterDto } from './dto/appointmentRegisterDto.dto';
import { AppointmentService } from './appointment.service';

@Controller('appointment')
@ApiTags('Appointment Management')
export class AppointmentController {
    constructor(private readonly appointmentsService: AppointmentService) {}

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('access-token')
    @Post('/create')
    async register(@Res() res: Response, @Body() body: AppointmentRegisterDto) {
      try {
        const msg = await this.appointmentsService.create(body);
        return res.status(HttpStatus.OK).json(msg);
      } catch (error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          msg: 'No se pudo crear la historia medica',
          error
        });
      }
    }
}
