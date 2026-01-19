import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query, ParseUUIDPipe } from '@nestjs/common';
import { TakeawayOrderService } from './takeaway_order.service';
import { CreateTakeawayOrderDto } from './dto/create-takeaway_order.dto';
import { UpdateTakeawayOrderDto } from './dto/update-takeaway_order.dto';
import { ApiTags, ApiResponse, ApiBearerAuth, ApiBody, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { orderStatus, PermissionType, roleType } from 'src/helper/types/index.type';
import { AtGuard } from 'src/middlewares/access_token/at.guard';
import { Roles, Permissions } from 'src/middlewares/authorisation/roles.decorator';
import { RolesGuard } from 'src/middlewares/authorisation/roles.guard';

@ApiTags('Takeaway Order')
@ApiResponse({ status: 201, description: 'Created Successfully' })
@ApiResponse({ status: 401, description: 'Unathorised request' })
@ApiResponse({ status: 400, description: 'Bad request' })
@ApiResponse({ status: 500, description: 'Server Error' })
@Controller('takeaway-order')
export class TakeawayOrderController {
  constructor(private readonly takeawayOrderService: TakeawayOrderService) { }

  @Post()
  @Roles(roleType.admin, roleType.staff)
  @Permissions(PermissionType.CREATE_TAKEAWAYORDER)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'create takeaway order' })
  @ApiBody({ type: CreateTakeawayOrderDto })
  create(@Req() req: any, @Body() createTakeawayOrderDto: CreateTakeawayOrderDto) {

    if (req.user.role === roleType.staff) {
      const restaurantid = req.user.rId;
      return this.takeawayOrderService.create(restaurantid, createTakeawayOrderDto);
    }
    const id = req.user.sub;
    return this.takeawayOrderService.create(id, createTakeawayOrderDto);
  }

  @Get()
  @Roles(roleType.admin, roleType.staff)
  @Permissions(PermissionType.VIEW_TAKEAWAYORDER)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'get all takeaway orders' })
  findAll(@Req() req: any) {
    if (req.user.role === roleType.staff) {
      const restaurantid = req.user.rId;
      return this.takeawayOrderService.findAll(restaurantid);
    }
    const id = req.user.sub;
    return this.takeawayOrderService.findAll(id);
  }

  @Get('status')
  @ApiQuery({ name: 'status', enum: orderStatus })
  findByStatus(@Query() query: { status: orderStatus }) {
    return this.takeawayOrderService.findOne(query.status);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.takeawayOrderService.findOne(id);
  }

  @Patch('status/:id')
  @ApiQuery({ name: 'status', enum: orderStatus })
  updateOrderItem(@Param('id', ParseUUIDPipe) id: string, @Query() query: { status: orderStatus }) {
    return this.takeawayOrderService.updateOrder(id, query.status);
  }


  @Patch('update/:id')
  @Roles(roleType.admin, roleType.staff)
  @Permissions(PermissionType.UPDATE_TAKEAWAYORDER)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'update takeaway ' })
  @ApiBody({ type: UpdateTakeawayOrderDto })
  updates(@Param('id') id: string, @Body() updateTakeawayOrderDto: UpdateTakeawayOrderDto) {
    return this.takeawayOrderService.updateOrderWithItemsAndAddons(id, updateTakeawayOrderDto);
  }


  @Delete(':id')
  @Roles(roleType.admin, roleType.staff)
  @Permissions(PermissionType.DELETE_TAKEAWAYORDER)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'delete takeaway order' })
  remove(@Param('id') id: string) {
    return this.takeawayOrderService.remove(id);
  }
}