import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { GetUserFilterDto, RoleUserDto } from './dtos';
import { ForbiddenException } from '../auth/exceptions';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {
  }

  async getFiltered(dto: GetUserFilterDto, companyId: number) {
    const {role} = dto;

    let query = this.userRepository.createQueryBuilder('user')
      .leftJoinAndSelect('user.company', 'company')
      .where('company.id = :companyId', {companyId: Number(companyId)});

    if (role) {
      query = query.andWhere('user.role = :role', {role});
    }

    return query.getManyAndCount();
  }

  async save(user: Partial<User>) {
    return this.userRepository.save(user);
  }

  async getUserById(userId: number) {
    return this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :userId', {userId})
      .getOne();
  }

  async getUserByPhone(phone: string) {
    return this.userRepository
      .createQueryBuilder('user')
      .leftJoin('user.company', 'company')
      .select([
        'user.id',
        'user.name',
        'user.phone',
        'user.role',
        'user.password',
        'company.id',
      ])
      .where('user.phone = :phone', {phone})
      .getOne();
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

  // async edit(dto: EditUserDto, userId: number, fromId: number, photo: Express.Multer.File) {
  //   const user = await this.userRepository.findOne({
  //     where: {
  //       id: userId
  //     },
  //     relations: {
  //       company: true
  //     }
  //   });
  //
  //   if (!user) {
  //     throw new UserNotFoundException();
  //   }
  //
  //   const editByUser = await this.userRepository.findOne({
  //     where: {
  //       id: fromId,
  //     },
  //     relations: {
  //       company: true
  //     }
  //   });
  //
  //   if (!editByUser) {
  //     throw new FromUserNotFoundException();
  //   }
  //
  //   let isForbidden = true;
  //
  //   if (userId !== fromId) {
  //     if (user.company.id === editByUser.company.id) {
  //       if (editByUser.role === Role.ADMIN || editByUser.role === Role.MANAGER) {
  //         if (user.role !== Role.ADMIN) {
  //           isForbidden = false;
  //         }
  //         throw new ForbiddenException();
  //       }
  //       throw new ForbiddenException();
  //     }
  //     throw new ForbiddenException();
  //   } else {
  //     isForbidden = false;
  //   }
  //
  //   if (isForbidden) {
  //     throw new ForbiddenException();
  //   }
  //
  //   if (dto.name) {
  //     user.name = dto.name;
  //   }
  //
  //   if (dto.surname) {
  //     user.surname = dto.surname;
  //   }
  //
  //   if (dto.middleName) {
  //     user.middleName = dto.middleName;
  //   }
  //
  //   if (dto.phone) {
  //     const candidate = await this.getUserByPhone(dto.phone);
  //     if (candidate) {
  //       throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.INVALID_DATA);
  //     }
  //     user.phone = dto.phone;
  //   }
  //
  //   if (dto.password) {
  //     user.password = await argon.hash(dto.password);
  //   }
  //
  //   if (photo?.buffer) {
  //     if (user.photoPath !== FILENAME.DEFAULT_IMG) {
  //       this.fileService.deleteFile(user.photoPath);
  //     }
  //
  //     user.photoPath = this.fileService.saveFile(photo);
  //   }
  //
  //   const newUser = await this.userRepository.save(user);
  //   const {password, refreshToken, ...userData} = newUser;
  //   return userData;
  // }

  async editRole(editDto: RoleUserDto, id: number, company: number) {
    const user = await this.userRepository.findOne({
      where: {
        id: id
      },
      relations: {
        company: true
      }
    });

    if (user.company.id !== company) {
      throw new ForbiddenException();
    }

    user.role = editDto.role;
    const savedUser = await this.userRepository.save(user);
    const {password, refreshToken, ...userData} = savedUser;

    return userData;
  }
}
