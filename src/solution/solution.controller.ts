import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { SolutionService } from './solution.service';
import { RolesGuard } from '../auth/guards';
import { Roles } from '../auth/decorators';
import { Role } from '../auth/enums';
import { CreateSolutionDto, EditSolutionDto, GetSolutionFilterDto } from './dtos';
import { UserRequest } from '../auth/types';
import { ApiException } from '@nanogiants/nestjs-swagger-api-exception-decorator';
import { ForbiddenException, UnauthorizedException } from '../auth/exceptions';
import { CompanyNotFoundException, SolutionAlreadyExistException, SolutionNotFoundException } from './exceptions';

@ApiTags('Услуги')
@Controller('solution')
export class SolutionController {
  constructor(
    private readonly solutionService: SolutionService
  ) {
  }

  @ApiOperation({summary: 'Получение услуг по фильтрам'})
  @ApiException(() => [UnauthorizedException, ForbiddenException])
  @ApiBearerAuth('JWT-auth')
  @Roles(Role.ADMIN, Role.MANAGER)
  @UseGuards(RolesGuard)
  @Get('get')
  async getFiltered(
    @Req() req: UserRequest,
    @Query() filterDto: GetSolutionFilterDto,
  ) {

  }

  @ApiOperation({summary: 'Получение услуги по ID'})
  @ApiException(() => [UnauthorizedException, ForbiddenException])
  @ApiParam({
    name: 'id',
    required: true,
    example: 1,
    description: 'ID услуги',
  })
  @ApiBearerAuth('JWT-auth')
  @Roles(Role.ADMIN, Role.MANAGER, Role.CLEANER, Role.DRIVER)
  @UseGuards(RolesGuard)
  @Get('get/:id')
  async getById(
    @Req() req: UserRequest,
    @Param('id', new ParseIntPipe()) id: number
  ) {
    return this.solutionService.getById(id, req.user.company);
  }

  @ApiOperation({summary: 'Получение всех услуг'})
  @ApiException(() => [UnauthorizedException, ForbiddenException])
  @ApiBearerAuth('JWT-auth')
  @Roles(Role.ADMIN, Role.MANAGER, Role.CLEANER, Role.DRIVER)
  @UseGuards(RolesGuard)
  @Get('getAll')
  async getAll(
    @Req() req: UserRequest,
  ) {
    return this.solutionService.getAll(req.user.company);
  }

  @ApiOperation({summary: 'Создание услуги'})
  @ApiException(() => [UnauthorizedException, ForbiddenException, CompanyNotFoundException, SolutionAlreadyExistException])
  @ApiBearerAuth('JWT-auth')
  @Roles(Role.ADMIN, Role.MANAGER)
  @UseGuards(RolesGuard)
  @Post('create')
  async create(
    @Req() req: UserRequest,
    @Body() createDto: CreateSolutionDto
  ) {
    return this.solutionService.create(createDto, req.user.company);
  }

  @ApiOperation({summary: 'Изменение услуги'})
  @ApiException(() => [UnauthorizedException, ForbiddenException, CompanyNotFoundException, SolutionAlreadyExistException, SolutionNotFoundException])
  @ApiParam({
    name: 'id',
    required: true,
    example: 1,
    description: 'ID услуги',
  })
  @ApiBearerAuth('JWT-auth')
  @Roles(Role.ADMIN, Role.MANAGER)
  @UseGuards(RolesGuard)
  @Put('edit/:id')
  async edit(
    @Req() req: UserRequest,
    @Body() editDto: EditSolutionDto,
    @Param('id', new ParseIntPipe()) id: number
  ) {
    return this.solutionService.edit(editDto, id, req.user.company);
  }

  @ApiOperation({summary: 'Удаление услуги по ID'})
  @ApiException(() => [UnauthorizedException, ForbiddenException, CompanyNotFoundException, SolutionNotFoundException])
  @ApiParam({
    name: 'id',
    required: true,
    example: 1,
    description: 'ID услуги',
  })
  @ApiBearerAuth('JWT-auth')
  @Roles(Role.ADMIN, Role.MANAGER)
  @UseGuards(RolesGuard)
  @Delete('delete/:id')
  async deleteById(
    @Req() req: UserRequest,
    @Param('id', new ParseIntPipe()) id: number
  ) {
    return this.solutionService.deleteById(req.user.company, id);
  }

  @ApiOperation({summary: 'Удаление всех услуг'})
  @ApiException(() => [UnauthorizedException, ForbiddenException, CompanyNotFoundException])
  @ApiBearerAuth('JWT-auth')
  @Roles(Role.ADMIN, Role.MANAGER)
  @UseGuards(RolesGuard)
  @Delete('deleteAll')
  async deleteAll(
    @Req() req: UserRequest,
  ) {
    return this.solutionService.deleteAll(req.user.company);
  }
}
