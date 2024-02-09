import { Body, Controller, Delete, Param, ParseIntPipe, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiConsumes, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { FILE_LIMIT } from '../constants';
import { extname } from 'path';
import { ValidationException } from '../exceptions';
import { EditUserDto, EditUserRoleDto } from './dtos';

@ApiTags('Пользователи')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {
  }

  @ApiOperation({ summary: 'Удаление всех пользователей ( и компаний )' })
  @Delete('deleteAll')
  async deleteAll() {
    return this.userService.deleteAll();
  }

  @ApiOperation({ summary: 'Изменение пользователя' })
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

  @Put('edit/:id')
  async edit(
    @Body() editDto: EditUserDto,
    @UploadedFile() photo: Express.Multer.File,
    @Param('id', new ParseIntPipe()) id: number,
  ) {
    return this.userService.edit(editDto, id, photo);
  }

  @ApiOperation({ summary: 'Изменение роли пользователя' })
  @ApiParam({
    name: 'id',
    required: true,
    example: '1',
    description: 'ID пользователя',
  })
  @Put('edit/role/:id')
  async editRole(
    @Body() editDto: EditUserRoleDto,
    @Param('id', new ParseIntPipe()) id: number,
  ) {
    return this.userService.editRole(editDto, id);
  }
}
