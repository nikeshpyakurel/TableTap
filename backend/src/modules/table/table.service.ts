import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';
import { tableEntity } from 'src/model/table.entity';
import * as QRCode from 'qrcode';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { restaurantEntity } from 'src/model/Restaurant.entity';
import { tableStatus } from 'src/helper/types/index.type';
import { subscriptionEntity } from 'src/model/subscription.entity';

@Injectable()
export class TableService {
  constructor(
    @InjectRepository(tableEntity)
    private readonly tableRepository: Repository<tableEntity>,
    @InjectRepository(restaurantEntity)
    private readonly restaurantRepo: Repository<restaurantEntity>,

    @InjectRepository(subscriptionEntity)
    private subscriptionRepo: Repository<subscriptionEntity>,

  ) { }
  async create(
    id: string,
    createTableDto: CreateTableDto,
  ): Promise<{ message: string; data: tableEntity }> {
    //  Find the restaurant
    const restaurant = await this.restaurantRepo.findOne({ where: { id } });
    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }

    // Count existing tables for this restaurant
    const existingTablesCount = await this.tableRepository.count({
      where: { restaurant: { id } },
    });

    // Check for duplicate table name
    const existingTable = await this.tableRepository.findOne({
      where: { name: createTableDto.name, restaurant: { id } },
    });

    if (existingTable) {
      throw new BadRequestException('Table with the given name already exists');
    }

    //  Set default max tables for free tier
    let maxTablesAllowed = 5;

    //  Get subscription package, if exists
    const subscription = await this.subscriptionRepo.findOne({
      where: { restaurant: { id } },
      relations: ['package'],
    });

    if (subscription && subscription.package) {
      maxTablesAllowed = subscription.package.total_table;
    }

    // Check if table count exceeds limit
    if (existingTablesCount >= maxTablesAllowed) {
      throw new BadRequestException(
        'Maximum number of tables exceeded. Please upgrade your subscription.'
      );
    }

    //  Create and save the new table
    const table = new tableEntity();
    table.name = createTableDto.name;
    table.restaurant = restaurant;
    table.qr = '';

    const createdTable = await this.tableRepository.save(table);

    // Generate QR code and update the table
    const qrCodeUrl = await this.generateQrCode(id, createdTable.id);
    await this.tableRepository.update(createdTable.id, { qr: qrCodeUrl });

    return {
      message: 'Table created successfully.',
      data: createdTable,
    };
  }


  async generateQrCode(restaurantId: string, table: string) {
    const url = `${process.env.FRONT_URL}?restaurant=${restaurantId}&table=${table}`;
    const qrCodeUrl = await QRCode.toDataURL(url);
    return qrCodeUrl;
  }


  async findAll(id: string) {
    const tables = await this.tableRepository.find({
      where: { restaurant: { id } },
      select: {
        id: true,
        name: true,
        status: true,
        qr: true
      },
    });
    return tables;
  }


  async findTableByStatus(id: string, status: tableStatus) {
    const tables = await this.tableRepository.find({
      where: {
        restaurant: { id },
        status
      },
      select: {
        id: true,
        name: true,
        status: true
      },
    });
    return tables;
  }



  async findOne(id: string) {
    return await this.tableRepository.findOne({ where: { id } });
  }


  async update(id: string, updateTableDto: UpdateTableDto) {
    const table = await this.tableRepository.findOne({ where: { id } });
    const updatedTable = Object.assign(table, updateTableDto);

    return await this.tableRepository.save(updatedTable);
  }

  async remove(id: string) {
    const table = await this.tableRepository.findOne({ where: { id } });
    return await this.tableRepository.remove(table);
  }
}
