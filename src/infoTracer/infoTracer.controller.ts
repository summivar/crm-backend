import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { InfoTracerService } from './infoTracer.service';
import { RolesGuard } from '../auth/guards';
import { Roles } from '../auth/decorators';
import { Role } from '../auth/enums';
import { CreateInfoTracerDto, EditInfoTracerDto } from './dtos';
import { UserRequest } from '../auth/types';
import { ApiException } from '@nanogiants/nestjs-swagger-api-exception-decorator';
import { ForbiddenException, UnauthorizedException } from '../auth/exceptions';
import { CompanyNotFoundException, InfoTracerAlreadyExistException, InfoTracerNotFoundException } from './exceptions';

@ApiTags('Источник')
@Controller('infoTracer')
export class InfoTracerController {
  constructor(
    private readonly infoTracerService: InfoTracerService
  ) {
  }

  @ApiOperation({summary: 'Получение источника по ID'})
  @ApiException(() => [UnauthorizedException, ForbiddenException])
  @ApiParam({
    name: 'id',
    required: true,
    example: 1,
    description: 'ID источника',
  })
  @ApiBearerAuth('JWT-auth')
  @Roles(Role.ADMIN, Role.MANAGER, Role.CLEANER, Role.DRIVER)
  @UseGuards(RolesGuard)
  @Get('get/:id')
  async getById(
    @Req() req: UserRequest,
    @Param('id', new ParseIntPipe()) id: number
  ) {
    return this.infoTracerService.getById(id, req.user.company);
  }

  @ApiOperation({summary: 'Получение всех источников'})
  @ApiException(() => [UnauthorizedException, ForbiddenException])
  @ApiBearerAuth('JWT-auth')
  @Roles(Role.ADMIN, Role.MANAGER, Role.CLEANER, Role.DRIVER)
  @UseGuards(RolesGuard)
  @Get('getAll')
  async getAll(
    @Req() req: UserRequest,
  ) {
    return this.infoTracerService.getAll(req.user.company);
  }

  @ApiOperation({summary: 'Создание источника'})
  @ApiException(() => [UnauthorizedException, ForbiddenException, CompanyNotFoundException, InfoTracerAlreadyExistException])
  @ApiBearerAuth('JWT-auth')
  @Roles(Role.ADMIN, Role.MANAGER)
  @UseGuards(RolesGuard)
  @Post('create')
  async create(
    @Req() req: UserRequest,
    @Body() createDto: CreateInfoTracerDto
  ) {
    return this.infoTracerService.create(createDto, req.user.company);
  }

  @ApiOperation({summary: 'Изменение источника'})
  @ApiException(() => [UnauthorizedException, ForbiddenException, CompanyNotFoundException, InfoTracerAlreadyExistException, InfoTracerNotFoundException])
  @ApiParam({
    name: 'id',
    required: true,
    example: 1,
    description: 'ID источника',
  })
  @ApiBearerAuth('JWT-auth')
  @Roles(Role.ADMIN, Role.MANAGER)
  @UseGuards(RolesGuard)
  @Put('edit/:id')
  async edit(
    @Req() req: UserRequest,
    @Body() editDto: EditInfoTracerDto,
    @Param('id', new ParseIntPipe()) id: number
  ) {
    return this.infoTracerService.edit(editDto, id, req.user.company);
  }

  @ApiOperation({summary: 'Удаление источника по ID'})
  @ApiException(() => [UnauthorizedException, ForbiddenException, CompanyNotFoundException, InfoTracerNotFoundException])
  @ApiParam({
    name: 'id',
    required: true,
    example: 1,
    description: 'ID источника',
  })
  @ApiBearerAuth('JWT-auth')
  @Roles(Role.ADMIN, Role.MANAGER)
  @UseGuards(RolesGuard)
  @Delete('delete/:id')
  async deleteById(
    @Req() req: UserRequest,
    @Param('id', new ParseIntPipe()) id: number
  ) {
    return this.infoTracerService.deleteById(req.user.company, id);
  }

  @ApiOperation({summary: 'Удаление всех источников'})
  @ApiException(() => [UnauthorizedException, ForbiddenException, CompanyNotFoundException])
  @ApiBearerAuth('JWT-auth')
  @Roles(Role.ADMIN, Role.MANAGER)
  @UseGuards(RolesGuard)
  @Delete('deleteAll')
  async deleteAll(
    @Req() req: UserRequest,
  ) {
    return this.infoTracerService.deleteAll(req.user.company);
  }
}
