import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RecipesService {

  constructor(private prisma: PrismaService){}

  findAll() {
    return this.prisma.recipe.findMany({ orderBy: { createdAt: 'desc' } })
  }

  findOne(id: string) {
    return this.prisma.recipe.findUnique({ where: { id } })
  }

  create(data: any) {
    return this.prisma.recipe.create({ data })
  }

  update(id: string, data: any) {
    return this.prisma.recipe.update({ where: { id }, data })
  }

  delete(id: string) {
    return this.prisma.recipe.delete({ where: { id } })
  }
}
