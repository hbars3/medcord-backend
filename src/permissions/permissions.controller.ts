import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PermissionDto } from './dto/permission.dto';
import { Permission } from './entities/permissions.entity';
import { PermissionsService } from './permissions.service';

@Controller('permissions')
@ApiTags('Permission Management')
export class PermissionsController {
    constructor(private permissionService: PermissionsService) {}

    @Post()
    createPermission(@Body() newPermission: PermissionDto) {
        return this.permissionService.createPermission(newPermission);
    }

    @Get()
    getPermissions(): Promise<Permission[]> {
        return this.permissionService.getPermissions();
    }

    @Delete(':id')
    deletePermission(@Param('id', ParseIntPipe) id: number) {
        return this.permissionService.deletePermission(id);
    }

    @Put(':id')
    updatePermission(@Param('id', ParseIntPipe) id: number, @Body() permission: PermissionDto) {
        return this.permissionService.updatePermission(id, permission);
    }
}
