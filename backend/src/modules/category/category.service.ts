import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { categoryEntity } from 'src/model/Category.entity';
import { CategoryStatus, RestaurantStatus } from 'src/helper/types/index.type';
import { PhotoUpdateDto } from './dto/PhotoUpdate.dto';
import { PaginationDto } from 'src/helper/utils/pagination.dto';
import { restaurantEntity } from 'src/model/Restaurant.entity';
import { subscriptionEntity } from 'src/model/subscription.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(categoryEntity)
    private categoryRepo: Repository<categoryEntity>,
    @InjectRepository(restaurantEntity)
    private restaurantRepo: Repository<restaurantEntity>,
    @InjectRepository(subscriptionEntity)
    private subcriptionRepo: Repository<subscriptionEntity>,
  ) { }

  async create(
    createCategoryDto: CreateCategoryDto,
    photo: string,
    id: string,
  ) {
    // Find the restaurant by ID
    const restaurant = await this.restaurantRepo.findOne({ where: { id } });
    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }

    // Count the existing categories for the restaurant
    const existingCategoriesCount = await this.categoryRepo.count({
      where: { restaurant: { id } },
    });

    //Check if a category with the same name already exists for the restaurant
    const existingCategory = await this.categoryRepo.findOne({
      where: { name: createCategoryDto.name, restaurant: { id } },
    });
    if (existingCategory) {
      throw new BadRequestException(
        'Category with the given name already exists',
      );
    }

    // Default max category limit for restaurants without a subscription
    let maxCategoriesAllowed = 10;

    // Try to get subscription if it exists
    const subscription = await this.subcriptionRepo.findOne({
      where: { restaurant: { id } },
      relations: ['package'],
    });

    // If subscribed and has a valid package, override the max allowed
    if (subscription && subscription.package) {
      maxCategoriesAllowed = subscription.package.total_categories;
    }


    // Check if the restaurant is active
    // if (restaurant.status !== RestaurantStatus.active) {
    //   throw new BadRequestException('Restaurant has not subscribed yet');
    // }

    // Check if the existing category count exceeds the limit
    if (existingCategoriesCount >= maxCategoriesAllowed) {
      throw new BadRequestException('Count for categories is exceeded');
    }

    // Create and save the new category
    const category = new categoryEntity();
    category.name = createCategoryDto.name;
    category.photo = photo;
    category.restaurant = restaurant;

    const savedCategory = await this.categoryRepo.save(category);

    return {
      message: 'Category added successfully.',
      data: savedCategory,
    };
  }

  async findAll(restaurantid: string) {
    return await this.categoryRepo.find({
      where: {
        restaurant: { id: restaurantid },
        status: CategoryStatus.available,
      },
    });
  }

  async findAllByToken(restaurantid: string, paginationDto?: PaginationDto) {
    const { page, pageSize } = paginationDto || {};
    const totalCount=await this.categoryRepo.count();
    if (page && pageSize) {
      const [pagedCategory, count] = await this.categoryRepo.findAndCount({
        where: { restaurant: { id: restaurantid } },
        skip: (page - 1) * totalCount,
        take: totalCount,
      });
      return { total: count, pagedCategory };
    }
    return await this.categoryRepo.find({
      where: { restaurant: { id: restaurantid } },
    });
  }

  async findOne(id: string) {
    const category = await this.categoryRepo.findOne({ where: { id } });
    return category;
  }

  async filterCategory(id: string, category: string) {
    const categories = await this.categoryRepo.find({
      where: {
        restaurant: { id },
        name: ILike(`%${category}%`),
      },
      select: {
        id: true,
        name: true,
        photo: true,
        status: true
      }
    });
    return categories;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoryRepo.findOne({ where: { id } });
    const updatedCategory = Object.assign(category, updateCategoryDto);
    return await this.categoryRepo.save(updatedCategory);
  }

  async updatePhoto(id: string, photo: string) {
    const category = await this.categoryRepo.findOne({ where: { id } });
    category.photo = photo;
    return await this.categoryRepo.save(category);
  }

  async remove(id: string) {
    const category = await this.categoryRepo.findOne({ where: { id } });
    return await this.categoryRepo.remove(category);
  }
}
