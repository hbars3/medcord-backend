import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Permission } from './entities/permissions.entity';
import { PermissionsController } from './permissions.controller';
import { PermissionsService } from './permissions.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Permission])
    ],
    controllers: [PermissionsController],
    providers: [PermissionsService]
})
export class PermissionsModule {}