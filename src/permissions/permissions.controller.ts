import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PermissionDto } from './dto/permission.dto';
import { Permission } from './entities/permissions.entity';
import { PermissionsService } from './permissions.service';

@Controller('permissions')
@ApiTags('Permission Management')
export class PermissionsController {
    constructor(private permissionService: PermissionsService) {}

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('access-token')
    createPermission(@Body() newPermission: PermissionDto) {
        return this.permissionService.createPermission(newPermission);
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('access-token')
    getPermissions(): Promise<Permission[]> {
        return this.permissionService.getPermissions();
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('access-token')
    deletePermission(@Param('id', ParseIntPipe) id: number) {
        return this.permissionService.deletePermission(id);
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('access-token')
    updatePermission(@Param('id', ParseIntPipe) id: number, @Body() permission: PermissionDto) {
        return this.permissionService.updatePermission(id, permission);
    }
}
