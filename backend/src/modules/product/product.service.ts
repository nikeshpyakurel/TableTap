import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { productEntity } from 'src/model/Product.entity';
import { ILike, In, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { PaginationDto } from 'src/helper/utils/pagination.dto';
import { categoryEntity } from 'src/model/Category.entity';
import { productAddOnEntity } from 'src/model/Product_Addon.entity';
import { UpdateAddonDto } from './dto/update-Addon.dto';
import { CreateAddonDto } from './dto/create-addon.dto';
import { filterProductDto } from 'src/helper/utils/filter-product.dto';
import { restaurantEntity } from 'src/model/Restaurant.entity';
import { subscriptionEntity } from 'src/model/subscription.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(productEntity)
    private ProductRepo: Repository<productEntity>,

    @InjectRepository(categoryEntity)
    private categoryRepo: Repository<categoryEntity>,

    @InjectRepository(productAddOnEntity)
    private productAddonRepo: Repository<productAddOnEntity>,
    @InjectRepository(restaurantEntity)
    private restaurantRepo: Repository<restaurantEntity>,
    @InjectRepository(subscriptionEntity)
    private subcriptionRepo: Repository<subscriptionEntity>

  ) { }
  async create(createProductDto: CreateProductDto, photo: string, id: string) {

    const { name, description, price, discount, isVeg, categoryIds, addOn, isAgeRestricted } = createProductDto;

    const categories = await this.categoryRepo.find({
      where: { id: In(categoryIds) }
    });


    if (categories.length !== categoryIds.length) {
      throw new BadRequestException("Some invalid UUIDs found in categoryIds");
    }

    // Find the restaurant by ID
    const restaurant = await this.restaurantRepo.findOne({ where: { id } });
    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }

    // Count the existing products for the restaurant
    const existingProductCount = await this.ProductRepo.count({
      where: { categories: { restaurant: { id } } }
    });
    // console.log(existingProductCount);


    //Check if a product with the same name already exists for the restaurant
    const existingProduct = await this.ProductRepo.findOne({
      where: { name: createProductDto.name, categories: { restaurant: { id } } },
    });
    // console.log(existingProduct);

    if (existingProduct) {
      throw new BadRequestException(
        'Product with the given name already exists',
      );
    }

    // Default max product limit for restaurants without a subscription
    let maxProductsAllowed = 25;

    // Try to get subscription if it exists
    const subscription = await this.subcriptionRepo.findOne({
      where: { restaurant: { id } },
      relations: ['package'],
    });

    // If subscribed and has a valid package, override the max allowed
    if (subscription && subscription.package) {
      maxProductsAllowed = subscription.package.total_products;
    }


    // Check if the restaurant is active
    // if (restaurant.status !== RestaurantStatus.active) {
    //   throw new BadRequestException('Restaurant has not subscribed yet');
    // }

    // Check if the existing category count exceeds the limit
    if (existingProductCount >= maxProductsAllowed) {
      throw new BadRequestException('Count for products is exceeded');
    }

    const product = new productEntity();
    product.name = name;
    product.description = description;
    product.price = price;
    product.discount = discount || 0;
    product.isVeg = isVeg;
    product.photo = photo;
    product.categories = categories;
    product.isAgeRestricted = (isAgeRestricted==='true');
    const productEntityRespomnse = await this.ProductRepo.save(product);

    if (addOn) {
      const product_addons = addOn.map((item: any) => {
        const product_addon = new productAddOnEntity();
        product_addon.name = item.name;
        product_addon.price = item.price;
        product_addon.product = productEntityRespomnse;
        return product_addon;
      });

      await this.productAddonRepo.save(product_addons);
    }
    return {
      message: 'Product created successfully',
      data: productEntityRespomnse,
    }
  }

  async addAddon(id: string, createAddonDto: CreateAddonDto) {
    const product = await this.ProductRepo.findOne({ where: { id } });
    const Addon = new productAddOnEntity();
    Addon.name = createAddonDto.name;
    Addon.price = createAddonDto.price;
    Addon.product = product
    return this.productAddonRepo.save(Addon);
  }

  async findAllBy(id: string, paginationDto?: PaginationDto,) {
    const { page, pageSize } = paginationDto;
    if (page && pageSize) {
      const [pagedProducts, total] = await this.ProductRepo.findAndCount({
        where: { categories: { restaurant: { id } } },
        relations: ['categories', 'productAddons'],
        skip: (page - 1) * pageSize,
        take: pageSize
      });
      return { total, pagedProducts };
    } else {
      return await this.ProductRepo.find({ where: { categories: { restaurant: { id } } }, relations: ['categories', 'productAddons'] },);
    }

  }

  async findAll(id: string) {
    return await this.ProductRepo.find({
      where: { categories: { restaurant: { id } } },
      relations: ['categories', 'productAddons'],
      select: { categories: { id: true }, productAddons: { id: true, name: true, price: true } },
    });
  }

  async findAllByCategory(id: string, paginationDto?: PaginationDto,) {
    const { page, pageSize } = paginationDto;
    if (page && pageSize) {
      const [pagedProducts, total] = await this.ProductRepo.findAndCount({
        where: { categories: { id } },
        relations: ['categories', 'productAddons'],
        skip: (page - 1) * pageSize,
        take: pageSize
      });
      return { total, pagedProducts };
    } else {
      return await this.ProductRepo.find({ where: { categories: { id } }, relations: ['categories', 'productAddons'] },);
    }

  }



  async findOne(id: string) {
    return await this.ProductRepo.findOne({
      where: { id }
      , relations: ['productAddons']
    });
  }

  async findPopularItem(id: string) {
    const products = await this.ProductRepo.find({
      where: {
        categories: {
          restaurant: { id },
        },
      },
      order: {
        orderCount: 'DESC',
      },
      take: 10,
    });
    return products;
  }

  async filterProduct(id: string, filterProductDto: filterProductDto) {
    const { low, high, name, category } = filterProductDto;

    const whereConditions: any = {
      categories: { restaurant: { id } },
    };

    if (low) {
      whereConditions.price = MoreThanOrEqual(low);
    }

    if (high) {
      whereConditions.price = LessThanOrEqual(high);
    }

    if (name) {
      whereConditions.name = ILike(`%${name}%`);
    }

    if (category) {
      const categories = await this.categoryRepo.find({
        where: { name: ILike(`%${category}%`) },
      });

      const categoryIds = categories.map((cat) => cat.id);

      if (categoryIds.length > 0) {
        whereConditions.categories = {
          id: In(categoryIds),
        };
      }
    }
    const products = await this.ProductRepo.find({
      where: whereConditions,
      relations: ['categories', 'productAddons'],
      select: {
        id: true,
        name: true,
        price: true,
        photo: true,
        status: true,
        categories: {
          id: true,
          name: true
        },
        productAddons: {
          id: true,
          name: true,
          price: true
        }
      }

    });

    return products;
  }

  async showSpecial(id: string, paginationDto?: PaginationDto) {
    const { page, pageSize } = paginationDto || {};;
    if (page && pageSize) {
      const [pagedProducts, total] = await this.ProductRepo.findAndCount({
        where: { categories: { restaurant: { id } }, special: true },
        skip: (page - 1) * pageSize,
        take: pageSize
      });
      return { total, pagedProducts };
    } else {
      const products = await this.ProductRepo.find({ where: { categories: { restaurant: { id } }, special: true } });
      // console.log(products);
      if (products.length === 0) {
        throw new NotFoundException("No special products found");
      }
      return products;
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.ProductRepo.findOne({
      where: { id },
      relations: ['categories'],
    });
    if (updateProductDto.categoryIds?.length !== product.categories?.length) {
      product.categories = await this.categoryRepo.find({
        where: { id: In(updateProductDto.categoryIds) },
      });
    }
  
    Object.assign(product, updateProductDto);
    await this.ProductRepo.save(product);
    return true;
  }
  

  async updatePhoto(id: string, photo: string) {
    const product = await this.ProductRepo.findOne({ where: { id: id } });
    product.photo = photo;
    return await this.ProductRepo.save(product);
  }


  async updateCoverPhoto(id: string, photo: string) {
    const restaurant = await this.restaurantRepo.findOne({ where: { id } });
    restaurant.coverImage = photo;
    return await this.restaurantRepo.save(restaurant);
  }

  async updateAddon(id: string, updateAddonDto: UpdateAddonDto) {
    const product = await this.productAddonRepo.findOne({ where: { id: id } });
    const updatedProduct = Object.assign(product, updateAddonDto);
    return this.productAddonRepo.save(updatedProduct);
  }

  async remove(id: string) {
    const product = await this.ProductRepo.findOne({ where: { id: id } });
    if (!product) {
      throw new NotFoundException(`Addon with id ${id} not found`);
    }
    return await this.ProductRepo.remove(product);
  }

  async removeAddon(id: string) {
    const product = await this.productAddonRepo.findOne({ where: { id } });

    // If addon not found, throw an error
    if (!product) {
      throw new NotFoundException(`Addon with id ${id} not found`);
    }
    return await this.productAddonRepo.remove(product);
  }

}
