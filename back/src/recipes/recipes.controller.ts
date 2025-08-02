import {
  Controller, Get, Post, Put, Delete, Body, Param, UseInterceptors, UploadedFiles
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { RecipesService } from './recipes.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Controller('recipes')
export class RecipesController {
  constructor(
    private readonly recipesService: RecipesService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Get()
  findAll() {
    return this.recipesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.recipesService.findOne(id);
  }

  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  async create(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: any
  ) {
    const imageUrls = await this.cloudinaryService.uploadMany(files);
    return this.recipesService.create({
      ...body,
      imageUrls,
    });
  }

  @Put(':id')
  @UseInterceptors(FilesInterceptor('files'))
  async update(
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: any
  ) {
    const newImages = await this.cloudinaryService.uploadMany(files); // pode ser []
    return this.recipesService.update(id, {
      ...body,
      newImages, // isso agora existe
    });
  }


  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.recipesService.delete(id);
  }
}
