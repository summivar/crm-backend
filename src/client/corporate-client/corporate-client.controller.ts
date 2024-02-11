import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Req, UseGuards } from '@nestjs/common';
import { CorporateClientService } from './corporate-client.service';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../auth/decorators';
import { Role } from '../../auth/enums';
import { RolesGuard } from '../../auth/guards';
import { UserRequest } from '../../auth/types';
import { CreateCorporateClientDto, EditCorporateClientDto } from './dtos';

@ApiTags('Юридические клиенты')
@Controller('corporate-client')
export class CorporateClientController {
  constructor(private corporateClientService: CorporateClientService) {
  }

  @ApiOperation({summary: 'Получение юр.клиента по ID'})
  @ApiParam({
    name: 'id',
    required: true,
    example: 1,
    description: 'ID юр.клиента',
  })
  @ApiBearerAuth('JWT-auth')
  @Roles(Role.ADMIN, Role.MANAGER, Role.CLEANER, Role.DRIVER)
  @UseGuards(RolesGuard)
  @Get('get/:id')
  async getById(
    @Req() req: UserRequest,
    @Param('id', new ParseIntPipe()) id: number
  ) {
    return this.corporateClientService.getById(id, req.user.company);
  }

  @ApiOperation({summary: 'Получение всех юр.клиентов'})
  @ApiBearerAuth('JWT-auth')
  @Roles(Role.ADMIN, Role.MANAGER, Role.CLEANER, Role.DRIVER)
  @UseGuards(RolesGuard)
  @Get('getAll')
  async getAll(
    @Req() req: UserRequest,
  ) {
    return this.corporateClientService.getAll(req.user.company);
  }

  @ApiOperation({summary: 'Создание юр.клиента'})
  @ApiBearerAuth('JWT-auth')
  @Roles(Role.ADMIN, Role.MANAGER)
  @UseGuards(RolesGuard)
  @Post('create')
  async create(
    @Req() req: UserRequest,
    @Body() createDto: CreateCorporateClientDto
  ) {
    return this.corporateClientService.create(createDto, req.user.company);
  }

  @ApiOperation({summary: 'Изменение юр.клиента'})
  @ApiParam({
    name: 'id',
    required: true,
    example: 1,
    description: 'ID юр.клиента',
  })
  @ApiBearerAuth('JWT-auth')
  @Roles(Role.ADMIN, Role.MANAGER)
  @UseGuards(RolesGuard)
  @Put('edit/:id')
  async edit(
    @Req() req: UserRequest,
    @Body() editDto: EditCorporateClientDto,
    @Param('id', new ParseIntPipe()) id: number
  ) {
    return this.corporateClientService.edit(editDto, id, req.user.company);
  }

  @ApiOperation({summary: 'Удаление юр.клиента по ID'})
  @ApiParam({
    name: 'id',
    required: true,
    example: 1,
    description: 'ID юр.клиента',
  })
  @ApiBearerAuth('JWT-auth')
  @Roles(Role.ADMIN, Role.MANAGER)
  @UseGuards(RolesGuard)
  @Delete('delete/:id')
  async deleteById(
    @Req() req: UserRequest,
    @Param('id', new ParseIntPipe()) id: number
  ) {
    return this.corporateClientService.deleteById(req.user.company, id);
  }

  @ApiOperation({summary: 'Удаление всех юр.клиентов'})
  @ApiBearerAuth('JWT-auth')
  @Roles(Role.ADMIN, Role.MANAGER)
  @UseGuards(RolesGuard)
  @Delete('deleteAll')
  async deleteAll(
    @Req() req: UserRequest,
  ) {
    return this.corporateClientService.deleteAll(req.user.company);
  }
}
