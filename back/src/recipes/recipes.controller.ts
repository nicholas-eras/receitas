import {
  Controller, Get, Post, Put, Delete, Body, Param
} from '@nestjs/common'
import { RecipesService } from './recipes.service'

@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Get()
  findAll() {
    return this.recipesService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.recipesService.findOne(id)
  }

  @Post()
  create(@Body() body: any) {
    return this.recipesService.create(body)
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.recipesService.update(id, body)
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.recipesService.delete(id)
  }
}
