import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Req, UseGuards } from '@nestjs/common';
import { IndividualClientService } from './individual-client.service';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../auth/decorators';
import { Role } from '../../auth/enums';
import { RolesGuard } from '../../auth/guards';
import { UserRequest } from '../../auth/types';
import { CreateIndividualClientDto, EditIndividualClientDto } from './dtos';

@ApiTags('Индивидуальные клиенты')
@Controller('individual-client')
export class IndividualClientController {
  constructor(private individualClientService: IndividualClientService) {
  }

  @ApiOperation({summary: 'Получение инд.клиента по ID'})
  @ApiParam({
    name: 'id',
    required: true,
    example: 1,
    description: 'ID инд.клиента',
  })
  @ApiBearerAuth('JWT-auth')
  @Roles(Role.ADMIN, Role.MANAGER, Role.CLEANER, Role.DRIVER)
  @UseGuards(RolesGuard)
  @Get('get/:id')
  async getById(
    @Req() req: UserRequest,
    @Param('id', new ParseIntPipe()) id: number
  ) {
    return this.individualClientService.getById(id, req.user.company);
  }

  @ApiOperation({summary: 'Получение всех инд.клиентов'})
  @ApiBearerAuth('JWT-auth')
  @Roles(Role.ADMIN, Role.MANAGER, Role.CLEANER, Role.DRIVER)
  @UseGuards(RolesGuard)
  @Get('getAll')
  async getAll(
    @Req() req: UserRequest,
  ) {
    return this.individualClientService.getAll(req.user.company);
  }

  @ApiOperation({summary: 'Создание инд.клиента'})
  @ApiBearerAuth('JWT-auth')
  @Roles(Role.ADMIN, Role.MANAGER)
  @UseGuards(RolesGuard)
  @Post('create')
  async create(
    @Req() req: UserRequest,
    @Body() createDto: CreateIndividualClientDto
  ) {
    return this.individualClientService.create(createDto, req.user.company);
  }

  @ApiOperation({summary: 'Изменение инд.клиента'})
  @ApiParam({
    name: 'id',
    required: true,
    example: 1,
    description: 'ID инд.клиента',
  })
  @ApiBearerAuth('JWT-auth')
  @Roles(Role.ADMIN, Role.MANAGER)
  @UseGuards(RolesGuard)
  @Put('edit/:id')
  async edit(
    @Req() req: UserRequest,
    @Body() editDto: EditIndividualClientDto,
    @Param('id', new ParseIntPipe()) id: number
  ) {
    return this.individualClientService.edit(editDto, id, req.user.company);
  }

  @ApiOperation({summary: 'Удаление инд.клиента по ID'})
  @ApiParam({
    name: 'id',
    required: true,
    example: 1,
    description: 'ID инд.клиента',
  })
  @ApiBearerAuth('JWT-auth')
  @Roles(Role.ADMIN, Role.MANAGER)
  @UseGuards(RolesGuard)
  @Delete('delete/:id')
  async deleteById(
    @Req() req: UserRequest,
    @Param('id', new ParseIntPipe()) id: number
  ) {
    return this.individualClientService.deleteById(req.user.company, id);
  }

  @ApiOperation({summary: 'Удаление всех инд.клиентов'})
  @ApiBearerAuth('JWT-auth')
  @Roles(Role.ADMIN, Role.MANAGER)
  @UseGuards(RolesGuard)
  @Delete('deleteAll')
  async deleteAll(
    @Req() req: UserRequest,
  ) {
    return this.individualClientService.deleteAll(req.user.company);
  }
}
