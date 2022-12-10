import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PermissionDto } from './dto/permission.dto';
import { Permission } from './entities/permissions.entity';

@Injectable()
export class PermissionsService {
    constructor(
        @InjectRepository(Permission) private permissionRepository: Repository<Permission>
    ) {}

    createPermission(permission: PermissionDto) {
        const newPermission = this.permissionRepository.create(permission);
        return this.permissionRepository.save(newPermission);
    }

    getPermissions() {
        return this.permissionRepository.find();
    }

    deletePermission(id: number) {
        this.permissionRepository.delete(id);
    }

    updatePermission(id: number, permission: PermissionDto) {
        return this.permissionRepository.update({id}, permission);
    }
}
