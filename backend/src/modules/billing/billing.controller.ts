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
  ParseUUIDPipe,
} from '@nestjs/common';
import { BillingService } from './billing.service';
import { CreateBillingDto } from './dto/create-billing.dto';
import { UpdateBillingDto } from './dto/update-billing.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles, Permissions } from 'src/middlewares/authorisation/roles.decorator';
import {
  billingStatus,
  paymentMethod,
  PermissionType,
  roleType,
} from 'src/helper/types/index.type';
import { AtGuard } from 'src/middlewares/access_token/at.guard';
import { RolesGuard } from 'src/middlewares/authorisation/roles.guard';

@Controller('billing')
@ApiTags('Billing')
@ApiResponse({ status: 201, description: 'Created Successfully' })
@ApiResponse({ status: 401, description: 'Unathorised request' })
@ApiResponse({ status: 400, description: 'Bad request' })
@ApiResponse({ status: 500, description: 'Server Error' })
export class BillingController {
  constructor(private readonly billingService: BillingService) { }

  @Post()
  @Roles(roleType.admin, roleType.staff)
  @Permissions(PermissionType.CREATE_RECEPTIONORDER)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'payment' })
  @ApiBody({ type: CreateBillingDto })
  @ApiQuery({ name: 'method', enum: paymentMethod })
  create(
    @Query('method') method: paymentMethod,
    @Body() createBillingDto: CreateBillingDto,
  ) {
    return this.billingService.create(method, createBillingDto);
  }

  @Post('settle/:orderId')
  @Roles(roleType.admin, roleType.staff)
  @Permissions(PermissionType.CREATE_TABLEORDER, PermissionType.CREATE_RECEPTIONORDER)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'payment' })
  @ApiQuery({ name: 'tableId' })
  billSettle(
    @Param('orderId', ParseUUIDPipe) orderId: string,
    @Query('tableId') tableId: string,
  ) {
    return this.billingService.billSettle(orderId, tableId);
  }

  @Post('settle/quick-order/:orderId')
  @Roles(roleType.admin)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'payment' })
  @ApiQuery({ name: 'tableId' })
  quickOrderBillSettle(
    @Param('orderId', ParseUUIDPipe) orderId: string,
    @Query('tableId') tableId: string,
  ) {
    return this.billingService.billSettle(orderId, tableId);
  }

  @Post('quick-order/:orderId')
  @Roles(roleType.admin, roleType.staff)
  @Permissions(PermissionType.CREATE_TAKEAWAYORDER)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'quick order payment' })
  @ApiQuery({ name: 'restroId' })
  billSettleQuickOrder(
    @Param('orderId', ParseUUIDPipe) orderId: string,
    @Query('restroId') restroId: string,
    @Body() createBillingDto: CreateBillingDto,
  ) {
    return this.billingService.billSettleQuickOrder(orderId, restroId, createBillingDto);
  }

  @Get('info/:orderId')
  billInfo(@Param('orderId') id: string) {
    return this.billingService.billInfo(id);
  }

  @Get('all/:restaurantId')
  @ApiQuery({ name: 'status', enum: billingStatus })
  findAll(
    @Query('status') status: billingStatus,
    @Param('restaurantId') id: string,
  ) {
    return this.billingService.findAll(id, status);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.billingService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBillingDto: UpdateBillingDto) {
    return this.billingService.update(+id, updateBillingDto);
  }

  @Delete(':id')
  @Roles(roleType.admin)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  remove(@Param('id') id: string) {
    return this.billingService.remove(id);
  }
}
