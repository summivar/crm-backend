import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Put, Req,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { FILE_LIMIT } from '../constants';
import { extname } from 'path';
import { ValidationException } from '../exceptions';
import { EditUserDto, RoleUserDto } from './dtos';
import { JwtGuard, RolesGuard } from '../auth/guards';
import { UserRequest } from '../auth/types';
import { Roles } from '../auth/decorators';
import { Role } from '../auth/enums';

@ApiTags('Пользователи')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {
  }

  @ApiOperation({summary: 'Получить всех пользователей'})
  @Get('get/all')
  async getAll() {
    return this.userService.getAllUsers();
  }

  @ApiOperation({summary: 'Удаление всех пользователей ( и компаний )'})
  @Delete('deleteAll')
  async deleteAll() {
    return this.userService.deleteAll();
  }

  @ApiOperation({summary: 'Изменение пользователя'})
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('photo', {
    limits: {
      fieldSize: FILE_LIMIT.PHOTO_SIZE,
    },
    fileFilter: (req, file, callback) => {
      if (file.mimetype.startsWith('image/') && /\.(png|jpeg|jpg)$/.test(extname(file.originalname).toLowerCase())) {
        callback(null, true);
      } else {
        callback(new ValidationException('Only image files with extensions .png, .jpeg, and .jpg are allowed.'), false);
      }
    },
  }))
  @ApiParam({
    name: 'id',
    required: true,
    example: '1',
    description: 'ID пользователя',
  })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtGuard)
  @Put('edit/:id')
  async edit(
    @Req() req: UserRequest,
    @Body() editDto: EditUserDto,
    @UploadedFile() photo: Express.Multer.File,
    @Param('id', new ParseIntPipe()) id: number,
  ) {
    return this.userService.edit(editDto, id, req.user.id, photo);
  }

  @ApiOperation({summary: 'Изменение роли пользователя'})
  @ApiParam({
    name: 'id',
    required: true,
    example: '1',
    description: 'ID пользователя',
  })
  @ApiBearerAuth('JWT-auth')
  @Roles(Role.ADMIN, Role.MANAGER)
  @UseGuards(RolesGuard)
  @Put('edit/role/:id')
  async editRole(
    @Req() req: UserRequest,
    @Body() editDto: RoleUserDto,
    @Param('id', new ParseIntPipe()) id: number,
  ) {
    return this.userService.editRole(editDto, id, req.user.company);
  }
}
