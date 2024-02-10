import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { StatusService } from './status.service';
import { RolesGuard } from '../auth/guards';
import { Roles } from '../auth/decorators';
import { Role } from '../auth/enums';
import { CreateStatusDto, EditStatusDto } from './dtos';
import { UserRequest } from '../auth/types';

@ApiTags('Статусы')
@Controller('status')
export class StatusController {
  constructor(
    private readonly statusService: StatusService
  ) {
  }

  @ApiOperation({summary: 'Получение статуса по ID'})
  @ApiParam({
    name: 'id',
    required: true,
    example: 1,
    description: 'ID статуса',
  })
  @ApiBearerAuth('JWT-auth')
  @Roles(Role.ADMIN, Role.MANAGER, Role.CLEANER, Role.DRIVER)
  @UseGuards(RolesGuard)
  @Get('get/:id')
  async getById(
    @Req() req: UserRequest,
    @Param('id', new ParseIntPipe()) id: number
  ) {
    return this.statusService.getById(id, req.user.company);
  }

  @ApiOperation({summary: 'Получение всех статусов'})
  @ApiBearerAuth('JWT-auth')
  @Roles(Role.ADMIN, Role.MANAGER, Role.CLEANER, Role.DRIVER)
  @UseGuards(RolesGuard)
  @Get('getAll')
  async getAll(
    @Req() req: UserRequest,
  ) {
    return this.statusService.getAll(req.user.company);
  }

  @ApiOperation({summary: 'Создание статуса'})
  @ApiBearerAuth('JWT-auth')
  @Roles(Role.ADMIN, Role.MANAGER)
  @UseGuards(RolesGuard)
  @Post('create')
  async create(
    @Req() req: UserRequest,
    @Body() createDto: CreateStatusDto
  ) {
    return this.statusService.create(createDto, req.user.company);
  }

  @ApiOperation({summary: 'Изменение статуса'})
  @ApiParam({
    name: 'id',
    required: true,
    example: 1,
    description: 'ID статуса',
  })
  @ApiBearerAuth('JWT-auth')
  @Roles(Role.ADMIN, Role.MANAGER)
  @UseGuards(RolesGuard)
  @Put('edit/:id')
  async edit(
    @Req() req: UserRequest,
    @Body() editDto: EditStatusDto,
    @Param('id', new ParseIntPipe()) id: number
  ) {
    return this.statusService.edit(editDto, id, req.user.company);
  }

  @ApiOperation({summary: 'Удаление статуса по ID'})
  @ApiParam({
    name: 'id',
    required: true,
    example: 1,
    description: 'ID статуса',
  })
  @ApiBearerAuth('JWT-auth')
  @Roles(Role.ADMIN, Role.MANAGER)
  @UseGuards(RolesGuard)
  @Delete('delete/:id')
  async deleteById(
    @Req() req: UserRequest,
    @Param('id', new ParseIntPipe()) id: number
  ) {
    return this.statusService.deleteById(req.user.company, id);
  }

  @ApiOperation({summary: 'Удаление всех статусов'})
  @ApiBearerAuth('JWT-auth')
  @Roles(Role.ADMIN, Role.MANAGER)
  @UseGuards(RolesGuard)
  @Delete('deleteAll')
  async deleteAll(
    @Req() req: UserRequest,
  ) {
    return this.statusService.deleteAll(req.user.company);
  }
}
