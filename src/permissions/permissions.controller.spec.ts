import { Test, TestingModule } from '@nestjs/testing';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PermissionDto } from './dto/permissionDto.dto';
import { Permission } from './entities/permissions.entity';
import { PermissionsController } from './permissions.controller';
import { PermissionsService } from './permissions.service';

describe('PermissionsController', () => {
  let permissionController: PermissionsController;

  const permissionDto: PermissionDto = new PermissionDto();
  const permission = new Permission();
  const id: number = 1;
  const mockPermissionsService = {
    createPermission: jest.fn().mockReturnValue('Permission has been created'),
    getPermissions: jest.fn().mockReturnValue([permission]),
    deletePermission: jest.fn().mockReturnValue('Permission has been deleted'),
    updatePermission: jest.fn().mockReturnValue('Permission has been updated'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PermissionsController],
      providers: [PermissionsService],
    })
      .overrideProvider(PermissionsService)
      .useValue(mockPermissionsService)
      .compile();

    permissionController = module.get<PermissionsController>(
      PermissionsController,
    );
  });

  it('Should be defined', () => {
    expect(permissionController).toBeDefined();
  });

  it('Should ensure the JwtAuthGuard is applied to the createPermission method', async () => {
    const createGuard = Reflect.getMetadata('__guards__', PermissionsController.prototype.createPermission)
    expect(new (createGuard[0])).toBeInstanceOf(JwtAuthGuard)
  });
  it('Should return that it created the permission', () => {
    expect(permissionController.createPermission(permissionDto)).toEqual(
      'Permission has been created',
    );
    expect(mockPermissionsService.createPermission).toHaveBeenCalled();
  });

  it('Should ensure the JwtAuthGuard is applied to the getPermissions method', async () => {
    const getGuard = Reflect.getMetadata('__guards__', PermissionsController.prototype.getPermissions)
    expect(new (getGuard[0])).toBeInstanceOf(JwtAuthGuard)
  });
  it('Should return that it returned the permissions', () => {
    expect(permissionController.getPermissions()).toBeInstanceOf(Array);
    expect(permissionController.getPermissions()).toContain(permission);
    expect(mockPermissionsService.getPermissions).toHaveBeenCalled();
  });

  it('Should ensure the JwtAuthGuard is applied to the deletePermission method', async () => {
    const deleteGuard = Reflect.getMetadata('__guards__', PermissionsController.prototype.deletePermission)
    expect(new (deleteGuard[0])).toBeInstanceOf(JwtAuthGuard)
  });
  it('Should return that it deleted the permission', () => {
    expect(permissionController.deletePermission(id)).toEqual(
      'Permission has been deleted',
    );
    expect(mockPermissionsService.deletePermission).toHaveBeenCalled();
  });

  it('Should ensure the JwtAuthGuard is applied to the updatePermission method', async () => {
    const updateGuard = Reflect.getMetadata('__guards__', PermissionsController.prototype.updatePermission)
    expect(new (updateGuard[0])).toBeInstanceOf(JwtAuthGuard)
  });
  it('Should return that it updated the permission', () => {
    expect(permissionController.updatePermission(id, permissionDto)).toEqual(
      'Permission has been updated',
    );
    expect(mockPermissionsService.updatePermission).toHaveBeenCalled();
  });
});
