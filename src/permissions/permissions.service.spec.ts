import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PermissionDto } from './dto/permission.dto';
import { Permission } from './entities/permissions.entity';
import { PermissionsService } from './permissions.service';

describe('PermissionsService', () => {
  const id = 1;
  const permission = new Permission();
  permission.createdAt = 'a';
  const permissionDto = new PermissionDto();
  
  const mockRepository = () => ({
    create: jest.fn().mockReturnValue(permission),
    delete: jest.fn().mockReturnThis(),
    find: jest.fn().mockReturnValue([permission]),
    save: jest.fn().mockReturnValue(permission),
    update: jest.fn().mockReturnValue(permission),
  });
  type MockRepository<Permission> = Partial<
    Record<keyof Repository<Permission>, jest.Mock>
  >;

  let permissionService: PermissionsService;
  let permissionRepository: MockRepository<Permission>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PermissionsService,
        {
          provide: getRepositoryToken(Permission),
          useValue: mockRepository(),
        },
      ],
    }).compile();

    permissionService = module.get<PermissionsService>(PermissionsService);
    permissionRepository = module.get(getRepositoryToken(Permission));
  });

  it('Should be defined', () => {
    expect(permissionService).toBeDefined();
  });

  it('Should return that it created the permission', () => {
    expect(permissionService.createPermission(permissionDto)).toEqual(
      permission,
    );
    expect(permissionRepository.create).toBeCalledTimes(1);
    expect(permissionRepository.save).toBeCalledTimes(1);
  });

  it('Should return that it returned all the permissions', () => {
    const result = permissionService.getPermissions();
    expect(result).toBeInstanceOf(Array);
    expect(result).toContain(permission);
    expect(permissionRepository.find).toBeCalledTimes(1);
  });

  it('Should return that it deleted the permission', () => {
    expect(permissionService.deletePermission(id)).toEqual(undefined);
    expect(permissionRepository.delete).toBeCalledTimes(1);
  });
  
  it('Should return that it updated the permission', () => {
    expect(permissionService.updatePermission(id, permissionDto)).toEqual(
      permission,
    );
    expect(permissionRepository.update).toBeCalledTimes(1);
  });
});
