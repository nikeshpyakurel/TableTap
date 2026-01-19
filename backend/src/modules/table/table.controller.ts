import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Req } from '@nestjs/common';
import { TableService } from './table.service';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';
import { ApiTags, ApiResponse, ApiBearerAuth, ApiBody, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { PermissionType, roleType, tableStatus } from 'src/helper/types/index.type';
import { AtGuard } from 'src/middlewares/access_token/at.guard';
import { Roles, Permissions } from 'src/middlewares/authorisation/roles.decorator';
import { RolesGuard } from 'src/middlewares/authorisation/roles.guard';
import { UpdateRestaurantDto } from '../restaurant/dto/update-restaurant.dto';
import { PaginationDto } from 'src/helper/utils/pagination.dto';

@Controller('table')
@ApiTags('Table')
@ApiResponse({ status: 201, description: 'Created Successfully' })
@ApiResponse({ status: 401, description: 'Unathorised request' })
@ApiResponse({ status: 400, description: 'Bad request' })
@ApiResponse({ status: 500, description: 'Server Error' })
export class TableController {
  constructor(private readonly tableService: TableService) { }

  @Post()
  @Roles(roleType.admin, roleType.staff)
  @Permissions(PermissionType.CREATE_TABLE)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'create table' })
  @ApiBody({ type: CreateTableDto })
  create(@Req() req: any, @Body() createTableDto: CreateTableDto) {
    if (req.user.role === roleType.staff) {
      const restaurantid = req.user.rId;
      return this.tableService.create(restaurantid, createTableDto);
    }
    const id = req.user.sub;
    return this.tableService.create(id, createTableDto);
  }

  @Get()
  @Roles(roleType.admin, roleType.staff)
  @Permissions(PermissionType.VIEW_TABLE)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'get all tables' })
  findAll(@Req() req: any) {
    if (req.user.role === roleType.staff) {
      const restaurantid = req.user.rId;
      return this.tableService.findAll(restaurantid);
    }
    const id = req.user.sub;
    return this.tableService.findAll(id);
  }

  @Get('find-by-status')
  @Roles(roleType.admin, roleType.staff)
  @Permissions(PermissionType.VIEW_TABLE)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiQuery({ name: 'status', enum: tableStatus })
  @ApiOperation({ summary: 'get table info' })
  findTableByStatus(@Req() req: any, @Query() query: { status: tableStatus }) {
    if (req.user.role === roleType.staff) {
      const restaurantid = req.user.rId;
      return this.tableService.findTableByStatus(restaurantid, query.status);
    }
    const id = req.user.sub;
    return this.tableService.findTableByStatus(id, query.status);
  }
  // @Get(':id')
  // @ApiOperation({ summary: 'get table info' })
  // findOne(@Param('id') id: string) {
  //   return this.tableService.findOne(id);
  // }

 

  @Patch(':id')
  @Roles(roleType.admin, roleType.staff)
  @Permissions(PermissionType.UPDATE_TABLE)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'update table info' })
  @ApiBody({ type: UpdateTableDto })
  update(@Param('id') id: string, @Body() updateTableDto: UpdateTableDto) {
    return this.tableService.update(id, updateTableDto);
  }

  @Delete(':id')
  @Roles(roleType.admin, roleType.staff)
  @Permissions(PermissionType.DELETE_TABLE)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'delete table' })
  remove(@Param('id') id: string) {
    return this.tableService.remove(id);
  }
}