import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
  ParseUUIDPipe,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { orderItemStatus, orderStatus, orderType, PermissionType, roleType } from 'src/helper/types/index.type';
import { PaginationDto } from 'src/helper/utils/pagination.dto';
import { Roles, Permissions } from 'src/middlewares/authorisation/roles.decorator';
import { AtGuard } from 'src/middlewares/access_token/at.guard';
import { RolesGuard } from 'src/middlewares/authorisation/roles.guard';

@Controller('order')
@ApiTags('Order')
@ApiResponse({ status: 201, description: 'Created Successfully' })
@ApiResponse({ status: 401, description: 'Unathorised request' })
@ApiResponse({ status: 400, description: 'Bad request' })
@ApiResponse({ status: 500, description: 'Server Error' })
export class OrderController {
  constructor(private readonly orderService: OrderService) { }

  @Post()
  @Roles(roleType.admin, roleType.staff)
  @Permissions(PermissionType.CREATE_TABLEORDER, PermissionType.CREATE_RECEPTIONORDER)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'create receptionist order' })
  @ApiBody({ type: CreateOrderDto })
  create(@Req() req: any, @Body() createOrderDto: CreateOrderDto) {
    if (req.user.role === roleType.staff) {
      const restroId = req.user.rId;
      return this.orderService.create(restroId, createOrderDto);
    }
    const restroId = req.user.sub;
    return this.orderService.create(restroId, createOrderDto);
  }

  @Get('my-order/:id')
  findMyOrder(
    @Param('id', ParseUUIDPipe) id: string
  ) {
    return this.orderService.findMyOrder(id);
  }

  @Get('restro')
  @Roles(roleType.admin, roleType.staff)
  @Permissions(PermissionType.VIEW_TABLEORDER, PermissionType.VIEW_RECEPTIONORDER)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'get order by status' })
  @ApiQuery({ name: 'status', enum: orderStatus })
  findAll(
    @Req() req: any,
    @Query() query: { status: orderStatus },
    @Query() paginationDto?: PaginationDto,
  ) {
    if (req.user.role === roleType.staff) {
      const adminId = req.user.rId;
      return this.orderService.findAll(adminId, query.status, paginationDto);
    }
    const adminId = req.user.sub;
    return this.orderService.findAll(adminId, query.status, paginationDto);
  }

  @Get('phone')
  @ApiQuery({ name: 'phone' })
  findByPhone(@Query() query: { phone: number }) {
    return this.orderService.findByPhone(query.phone);
  }

  @Get('find-phone/:id')
  findPhoneByTable(@Param('id', ParseUUIDPipe) id: string) {
    return this.orderService.findPhoneByTable(id);
  }

  @Get('order-history')
  @Roles(roleType.admin, roleType.staff)
  @Permissions(PermissionType.VIEW_RECEPTIONORDER, PermissionType.VIEW_TABLEORDER)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  findByOrderHistory(
    @Req() req: any,
    @Query() paginationDto?: PaginationDto
  ) {
    const { user } = req;
    if (user.role === roleType.staff) {
      return this.orderService.findByOrderHistory(user.rId, paginationDto);
    }
    return this.orderService.findByOrderHistory(user.sub, paginationDto);
  }

  @Get('type')
  @Roles(roleType.admin, roleType.staff)
  @Permissions(PermissionType.VIEW_TABLEORDER, PermissionType.VIEW_RECEPTIONORDER)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'get order by type' })
  @ApiQuery({ name: 'type', enum: orderType })
  findByType(@Req() req: any, @Query() query: { type: orderType }) {
    if (req.user.role === roleType.staff) {
      const restroId = req.user.rId;
      return this.orderService.findByOrderType(restroId, query.type);
    }
    const restroId = req.user.sub;
    return this.orderService.findByOrderType(restroId, query.type);
  }

  @Get('table/:id')
  findByTable(@Param('id', ParseUUIDPipe) id: string) {
    return this.orderService.findByTable(id);
  }

  @Get('itemStatus/:id')
  @ApiQuery({ name: 'status', enum: orderStatus })
  findByItemStatus(@Param('id', ParseUUIDPipe) id: string, @Query() query: { status: orderStatus }) {
    return this.orderService.findByItemStatus(id, query.status);
  }

  @Get('isSession/:tableID')
  isTableSession(@Param('tableID', ParseUUIDPipe) tableID: string) {
    return this.orderService.isTableSession(tableID);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.orderService.findOne(id);
  }

  @Get('find-phone/:id')
  @ApiOperation({ summary: 'get table info' })
  getByPhone(@Param('id') id: string) {
    return this.orderService.GetphoneByTable(id);
  }

  @Patch('orderItem/:id')
  @Roles(roleType.admin, roleType.staff)
  @Permissions(PermissionType.UPDATE_TABLEORDER)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiQuery({ name: 'status', enum: orderStatus })
  updateOrderItem(@Param('id', ParseUUIDPipe) id: string, @Query() query: { status: orderStatus }) {
    return this.orderService.updateOrderItem(id, query.status);
  }

  @Patch('table-change/:orderId')
  @Roles(roleType.admin, roleType.staff)
  @Permissions(PermissionType.UPDATE_TABLEORDER)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiQuery({ name: 'tableId' })
  changeTable(@Param('orderId', ParseUUIDPipe) orderId: string, @Query() query: { tableId: string }) {
    return this.orderService.changeTable(orderId, query.tableId);
  }

  @Patch(':id')
  @Roles(roleType.admin, roleType.staff)
  @Permissions(PermissionType.UPDATE_TABLEORDER)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiQuery({ name: 'status', enum: orderStatus })
  update(@Param('id', ParseUUIDPipe) id: string, @Query() query: { status: orderStatus }) {
    return this.orderService.update(id, query.status);
  }

  @Delete('order-item/:id')
  @Roles(roleType.admin, roleType.staff)
  @Permissions(PermissionType.DELETE_RECEPTIONORDER)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  orderItemDelete(@Param('id', ParseUUIDPipe) id: string) {
    return this.orderService.orderItemDelete(id);
  }

  @Delete('session/:id')
  @Roles(roleType.admin, roleType.staff)
  @Permissions(PermissionType.DELETE_TABLEORDER)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  removeSession(@Param('id', ParseUUIDPipe) id: string) {
    return this.orderService.removeSession(id);
  }

  @Delete(':id')
  @Roles(roleType.admin)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.orderService.remove(id);
  }
}
