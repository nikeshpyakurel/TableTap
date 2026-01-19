import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { CreateDashboardDto } from './dto/create-dashboard.dto';
import { UpdateDashboardDto } from './dto/update-dashboard.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Permissions, Roles } from 'src/middlewares/authorisation/roles.decorator';
import { PermissionType, roleType } from 'src/helper/types/index.type';
import { AtGuard } from 'src/middlewares/access_token/at.guard';
import { RolesGuard } from 'src/middlewares/authorisation/roles.guard';

@Controller('dashboard')
@ApiTags('Dashboard')
@ApiResponse({ status: 201, description: 'Created Successfully' })
@ApiResponse({ status: 401, description: 'Unathorised request' })
@ApiResponse({ status: 400, description: 'Bad request' })
@ApiResponse({ status: 500, description: 'Server Error' })
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) { }

  @Get('sales')
  @Roles(roleType.admin, roleType.staff)
  @Permissions(PermissionType.VIEW_STATISTICS)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'get sales' })
  findAllSales(@Req() req: any) {
    const restroId = req.user.rId;
    return this.dashboardService.findAllSales(restroId);
  }

  @Get('order')
  @Roles(roleType.admin, roleType.staff)
  @Permissions(PermissionType.VIEW_STATISTICS)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'create receptionist order' })
  findAllOrder(@Req() req: any) {
    const restroId = req.user.rId;
    return this.dashboardService.findAllOrder(restroId);
  }

  @Get('popular-item/:id')
  findPopularItem(@Param('id') id: string) {
    return this.dashboardService.findPopularItem(id);
  }

  @Roles(roleType.admin, roleType.staff)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'get restro information' })
  @Get('restro-info')
  findRestroInfo(@Req() req: any) {
    let id;
    if (req.user.role === 'admin') {
      id = req.user.sub;
    } else if (req.user.role === 'staff') {
      id = req.user.rId;
    }

    return this.dashboardService.findRestroInfo(id);
  }

}
