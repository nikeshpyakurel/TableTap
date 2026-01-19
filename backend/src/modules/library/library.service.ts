import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLibraryDto } from './dto/create-library.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { iconLibrary } from 'src/model/iconLibrary.entity';
import { Repository } from 'typeorm';
import { imgLibrary } from 'src/model/imgLibrary.entity';

@Injectable()
export class LibraryService {
  constructor(
    @InjectRepository(iconLibrary)
    private readonly iconLibraryRepository: Repository<iconLibrary>,

    @InjectRepository(imgLibrary)
    private readonly imgLibraryRepository: Repository<imgLibrary>,
  ) { }

  // Create a new icon
  async create(createIconDto: CreateLibraryDto, url): Promise<iconLibrary> {
    const newIcon = this.iconLibraryRepository.create({ name: createIconDto.name, src: url });
    return await this.iconLibraryRepository.save(newIcon);
  }

  // Get all icons
  async findAll(): Promise<iconLibrary[]> {
    return await this.iconLibraryRepository.find();
  }

  // Delete an icon
  async delete(id: string): Promise<void> {

    const deleteResult = await this.iconLibraryRepository.delete(id);
    if (!deleteResult.affected) {
      throw new NotFoundException(`Icon with ID ${id} not found`);
    }
  }

  // Create a new image
  async createImage(createImageDto: CreateLibraryDto, url): Promise<imgLibrary> {
    const newImage = this.imgLibraryRepository.create({ name: createImageDto.name, src: url });
    return await this.imgLibraryRepository.save(newImage);
  }

  // Get all images
  async findAllImage(): Promise<imgLibrary[]> {
    return await this.imgLibraryRepository.find();
  }

  // Delete an image
  async deleteImage(id: string): Promise<void> {
    const deleteResult = await this.imgLibraryRepository.delete(id);
    if (!deleteResult.affected) {
      throw new NotFoundException(`Image with ID ${id} not found`);
    }
  }
}
