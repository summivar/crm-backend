import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { OrderService } from './order.service';
import { UserRequest } from '../auth/types';
import { Roles } from '../auth/decorators';
import { Role } from '../auth/enums';
import { RolesGuard } from '../auth/guards';
import { CreateOrderDto, EditOrderDto } from './dtos';
import { GetOrdersFilterDto } from './dtos/getOrderFilter.dto';

@ApiTags('Заказы')
@Controller('order')
export class OrderController {
  constructor(private orderService: OrderService) {
  }

  @ApiOperation({ summary: 'Получение заказов по фильтрам' })
  @ApiBearerAuth('JWT-auth')
  @Roles(Role.ADMIN, Role.MANAGER)
  @UseGuards(RolesGuard)
  @Get('get')
  async getFiltered(
    @Req() req: UserRequest,
    @Query() filterDto: GetOrdersFilterDto,
  ) {
    return this.orderService.getFiltered(filterDto, req.user.company);
  }

  @ApiOperation({ summary: 'Получение заказа по ID' })
  @ApiParam({
    name: 'id',
    required: true,
    example: 1,
    description: 'ID заказа',
  })
  @ApiBearerAuth('JWT-auth')
  @Roles(Role.ADMIN, Role.MANAGER, Role.CLEANER, Role.DRIVER)
  @UseGuards(RolesGuard)
  @Get('get/:id')
  async getById(
    @Req() req: UserRequest,
    @Param('id', new ParseIntPipe()) id: number,
  ) {
    return this.orderService.getById(req.user.company, id);
  }

  @ApiOperation({ summary: 'Получение всех заказов' })
  @ApiBearerAuth('JWT-auth')
  @Roles(Role.ADMIN, Role.MANAGER)
  @UseGuards(RolesGuard)
  @Get('getAll')
  async getAll(
    @Req() req: UserRequest,
  ) {
    return this.orderService.getAll(req.user.company);
  }

  @ApiOperation({ summary: 'Создание заказа' })
  @ApiBearerAuth('JWT-auth')
  @Roles(Role.ADMIN, Role.MANAGER)
  @UseGuards(RolesGuard)
  @Post('create')
  async create(
    @Req() req: UserRequest,
    @Body() createDto: CreateOrderDto,
  ) {
    return this.orderService.create(createDto, req.user.company, req.user.id);
  }

  @ApiOperation({ summary: 'Изменение заказа' })
  @ApiParam({
    name: 'id',
    required: true,
    example: 1,
    description: 'ID заказа',
  })
  @ApiBearerAuth('JWT-auth')
  @Roles(Role.ADMIN, Role.MANAGER)
  @UseGuards(RolesGuard)
  @Put('edit/:id')
  async edit(
    @Req() req: UserRequest,
    @Body() editDto: EditOrderDto,
    @Param('id', new ParseIntPipe()) id: number,
  ) {
    return this.orderService.edit(editDto, req.user.company, id);
  }

  @ApiOperation({ summary: 'Удаление заказа по ID' })
  @ApiParam({
    name: 'id',
    required: true,
    example: 1,
    description: 'ID заказа',
  })
  @ApiBearerAuth('JWT-auth')
  @Roles(Role.ADMIN, Role.MANAGER)
  @UseGuards(RolesGuard)
  @Delete('delete/:id')
  async deleteById(
    @Req() req: UserRequest,
    @Param('id', new ParseIntPipe()) id: number,
  ) {
    return this.orderService.deleteById(req.user.company, id);
  }

  @ApiOperation({ summary: 'Удаление всех заказов' })
  @ApiBearerAuth('JWT-auth')
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Delete('deleteAll')
  async deleteAll(
    @Req() req: UserRequest,
  ) {
    return this.orderService.deleteAll(req.user.company);
  }
}
