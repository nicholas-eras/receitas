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
    // Corrigir arrays que chegam como string
    if (typeof body.ingredients === 'string') {
      try {
        body.ingredients = JSON.parse(body.ingredients);
      } catch {
        body.ingredients = [body.ingredients];
      }
    }

    if (typeof body.steps === 'string') {
      try {
        body.steps = JSON.parse(body.steps);
      } catch {
        body.steps = [body.steps];
      }
    }

    let newImages: { url: string; publicId: string }[] = [];
    if (files && files.length > 0) {
      newImages = await this.cloudinaryService.uploadMany(files);
    }

    return this.recipesService.update(id, {
      ...body,
      newImages,
    });
  }



  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.recipesService.delete(id);
  }
}
