import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { PaymentMethodService } from './paymentMethod.service';
import { RolesGuard } from '../auth/guards';
import { Roles } from '../auth/decorators';
import { Role } from '../auth/enums';
import { CreatePaymentMethodDto, EditPaymentMethodDto } from './dtos';
import { UserRequest } from '../auth/types';

@ApiTags('Платёжные методы')
@Controller('paymentMethod')
export class PaymentMethodController {
  constructor(
    private readonly paymentMethodService: PaymentMethodService
  ) {
  }

  @ApiOperation({summary: 'Получение платёжного метода по ID'})
  @ApiParam({
    name: 'id',
    required: true,
    example: 1,
    description: 'ID платёжного метода',
  })
  @ApiBearerAuth('JWT-auth')
  @Roles(Role.ADMIN, Role.MANAGER, Role.CLEANER, Role.DRIVER)
  @UseGuards(RolesGuard)
  @Get('get/:id')
  async getById(
    @Req() req: UserRequest,
    @Param('id', new ParseIntPipe()) id: number
  ) {
    return this.paymentMethodService.getById(id, req.user.company);
  }

  @ApiOperation({summary: 'Получение всех платёжных методов'})
  @ApiBearerAuth('JWT-auth')
  @Roles(Role.ADMIN, Role.MANAGER, Role.CLEANER, Role.DRIVER)
  @UseGuards(RolesGuard)
  @Get('getAll')
  async getAll(
    @Req() req: UserRequest,
  ) {
    return this.paymentMethodService.getAll(req.user.company);
  }

  @ApiOperation({summary: 'Создание платёжного метода'})
  @ApiBearerAuth('JWT-auth')
  @Roles(Role.ADMIN, Role.MANAGER)
  @UseGuards(RolesGuard)
  @Post('create')
  async create(
    @Req() req: UserRequest,
    @Body() createDto: CreatePaymentMethodDto
  ) {
    return this.paymentMethodService.create(createDto, req.user.company);
  }

  @ApiOperation({summary: 'Изменение платёжного метода'})
  @ApiParam({
    name: 'id',
    required: true,
    example: 1,
    description: 'ID платёжного метода',
  })
  @ApiBearerAuth('JWT-auth')
  @Roles(Role.ADMIN, Role.MANAGER)
  @UseGuards(RolesGuard)
  @Put('edit/:id')
  async edit(
    @Req() req: UserRequest,
    @Body() editDto: EditPaymentMethodDto,
    @Param('id', new ParseIntPipe()) id: number
  ) {
    return this.paymentMethodService.edit(editDto, id, req.user.company);
  }

  @ApiOperation({summary: 'Удаление платёжного метода по ID'})
  @ApiParam({
    name: 'id',
    required: true,
    example: 1,
    description: 'ID платёжного метода',
  })
  @ApiBearerAuth('JWT-auth')
  @Roles(Role.ADMIN, Role.MANAGER)
  @UseGuards(RolesGuard)
  @Delete('delete/:id')
  async deleteById(
    @Req() req: UserRequest,
    @Param('id', new ParseIntPipe()) id: number
  ) {
    return this.paymentMethodService.deleteById(req.user.company, id);
  }

  @ApiOperation({summary: 'Удаление всех платёжных методов'})
  @ApiBearerAuth('JWT-auth')
  @Roles(Role.ADMIN, Role.MANAGER)
  @UseGuards(RolesGuard)
  @Delete('deleteAll')
  async deleteAll(
    @Req() req: UserRequest,
  ) {
    return this.paymentMethodService.deleteAll(req.user.company);
  }
}
