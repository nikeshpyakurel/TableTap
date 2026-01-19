import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { staffPermissionEntity } from '../model/staffPermission.entity';
import { categoryEntity } from 'src/model/Category.entity';
import { productEntity } from 'src/model/Product.entity';
import { restaurantEntity } from 'src/model/Restaurant.entity';
import { roleType } from 'src/helper/types/index.type';
import { authEntity } from 'src/model/auth.entity';
import { CreateRestaurant } from 'src/modules/super-admin/dto/restaurant.dto';
import { hash } from 'src/helper/utils/hash';
import { restaurantInfo } from 'src/constants/restuarant-data';
import { categoryInfo } from 'src/constants/category-data';
import { productInfo } from 'src/constants/product-data';
import { createPermissionDto } from 'src/constants/permissions-data';
import { superAdminEntity } from 'src/model/superAdmin.entity';
import { SuperAdminInfo } from 'src/constants/superAdmin-data';

@Injectable()
export class SeederService {
    constructor(
        @InjectRepository(staffPermissionEntity)
        private readonly permissionRepository: Repository<staffPermissionEntity>,
        private hash: hash,
        private dataSource: DataSource,
    ) { }

    async createAdmin() {
        const existingAdmin = await this.dataSource.getRepository(authEntity).findOne({ where: { email: SuperAdminInfo.email } });
        if (!existingAdmin) {
            const queryRunner = this.dataSource.createQueryRunner();
            await queryRunner.connect();
            await queryRunner.startTransaction();
            try {
                const { email, password, name, address, photo } = SuperAdminInfo;
                const hashedPassword = await this.hash.value(password);
                const auth = new authEntity();
                auth.email = email;
                (auth.password = hashedPassword), (auth.role = roleType.superAdmin);
                await queryRunner.manager.save(auth);
                const superAdmin = new superAdminEntity();
                superAdmin.name = name;
                superAdmin.address = address;
                superAdmin.auth = auth;
                superAdmin.photo = photo
                await queryRunner.manager.save(superAdmin);
                await queryRunner.commitTransaction();
                console.log("SuperAdmin info seeded successfully");
                return true;
            } catch (error) {
                console.log(error);
                await queryRunner.rollbackTransaction();
                throw new ForbiddenException(error.errorResponse);
            } finally {
                await queryRunner.release();
            }
        } else {
            console.log("Superadmin already exists so skiping adding superAdmin")
        }

    }

    async createRestaurant() {
        const existingRestaurant = await this.dataSource
            .getRepository(authEntity)
            .findOne({ where: { email: restaurantInfo.email } });

        if (!existingRestaurant) {
            const queryRunner = this.dataSource.createQueryRunner();
            await queryRunner.connect();
            await queryRunner.startTransaction();
            try {
                const { email, password, name, address, zip_code, phone, coverImage } = restaurantInfo;
                const hashedPassword = await this.hash.value(password);
                const auth = new authEntity();
                auth.email = email;
                (auth.password = hashedPassword), (auth.role = roleType.admin);
                await queryRunner.manager.save(auth);
                const restaurant = new restaurantEntity();
                restaurant.name = name;
                restaurant.address = address;
                restaurant.zip_code = zip_code;
                restaurant.auth = auth;
                restaurant.phone = phone;
                restaurant.coverImage = coverImage;
                const savedRestuarant = await queryRunner.manager.save(restaurant);
                const categories = categoryInfo.map(Category => {
                    const category = new categoryEntity();
                    category.name = Category.name;
                    category.photo = Category.photo;
                    category.restaurant = savedRestuarant;
                    return category;
                });
                const savedCategory = await queryRunner.manager.save(categories);
                const products = productInfo.map(Product => {
                    const product = new productEntity();
                    product.name = Product.name;
                    product.description = Product.description;
                    product.isVeg = Product.isVeg;
                    product.photo = Product.photo;
                    product.price = Product.price;
                    product.discount = Product.discount;
                    product.categories = savedCategory;
                    product.special = Product.special;
                    return product
                })
                await queryRunner.manager.save(products);
                await queryRunner.commitTransaction();
                console.log("Restuarant info seeded successfully");
                return true;
            } catch (error) {
                console.log(error);
                await queryRunner.rollbackTransaction();
                throw new ForbiddenException(error.errorResponse);
            } finally {
                await queryRunner.release();
            }
        } else {
            console.log("Restuarant already exists so skiping adding restuarant")
        }


    }

    async seedPermissions() {
        try {
            const existingPermissions = await this.permissionRepository.find();
            if (existingPermissions.length === 0) {
                await this.permissionRepository.save(createPermissionDto);
                console.log('Permissions seeded successfully!');
            } else {
                console.log('Permissions already exist, skipping seeding.');
            }

        } catch (error) {
            console.error('Seeding failed:', error);
        }
    }
}
