import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { EditUserDto, EditUserRoleDto } from './dtos';
import { EXCEPTION_MESSAGE, FILENAME } from '../constants';
import { FileSystemService } from '../common/file-system/file-system.service';
import { CompanyService } from '../company/company.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly fileService: FileSystemService,
    private readonly companyService: CompanyService,
  ) {
  }

  async getUserByPhone(phone: string) {
    return this.userRepository.findOneBy({
      phone: phone,
    });
  }

  async updateRefreshToken(phone: string, refreshToken: string) {
    return this.userRepository.update({
      phone,
    }, {
      refreshToken,
    });
  }

  async findByRefreshToken(refreshToken: string) {
    return this.userRepository.findOneBy({
      refreshToken: refreshToken,
    });
  }

  async edit(dto: EditUserDto, id: number, photo: Express.Multer.File) {
    const user = await this.userRepository.findOneBy({ id: id });
    if (!user) {
      throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.NOT_FOUND_BY_ID);
    }

    if (dto.name) {
      user.name = dto.name;
    }

    if (dto.surname) {
      user.surname = dto.surname;
    }

    if (dto.middleName) {
      user.middleName = dto.middleName;
    }

    if (dto.phone) {
      user.phone = dto.phone;
    }

    if (dto.password) {
      user.password = dto.password;
    }

    if (photo?.buffer) {
      if (user.photoPath !== FILENAME.DEFAULT_IMG) {
        this.fileService.deleteFile(user.photoPath);
      }

      user.photoPath = this.fileService.saveFile(photo);
    }

    return this.userRepository.save(user);
  }

  async editRole(editDto: EditUserRoleDto, id: number) {
    return this.userRepository.update({
      id: id,
    }, {
      role: editDto.role,
    });
  }

  async deleteAllUsers() {
    return this.userRepository.delete({});
  }

  async deleteAll() {
    await this.deleteAllUsers();
    await this.companyService.deleteAll();
    return true;
  }
}
