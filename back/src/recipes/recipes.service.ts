import { Injectable } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

@Injectable()
export class RecipesService {
  findAll() {
    return prisma.recipe.findMany({ orderBy: { createdAt: 'desc' } })
  }

  findOne(id: string) {
    return prisma.recipe.findUnique({ where: { id } })
  }

  create(data: any) {
    return prisma.recipe.create({ data })
  }

  update(id: string, data: any) {
    return prisma.recipe.update({ where: { id }, data })
  }

  delete(id: string) {
    return prisma.recipe.delete({ where: { id } })
  }
}
