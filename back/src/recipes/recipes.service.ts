import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class RecipesService {

  constructor(private prisma: PrismaService, private cloudinary: CloudinaryService){}

  findAll() {
    return this.prisma.recipe.findMany({ orderBy: { createdAt: 'desc' } })
  }

  findOne(id: string) {
    return this.prisma.recipe.findUnique({ where: { id } })
  }

  async create(data: any) {
    if (!data.title || !data.servings || !data.timeMinutes || !Array.isArray(data.ingredients)) {
      throw new Error('Dados inválidos para criação de receita.');
    }

    return this.prisma.recipe.create({
      data: {
        title: data.title,
        servings: Number(data.servings),
        timeMinutes: Number(data.timeMinutes),
        ingredients: data.ingredients,
        steps: data.steps,
        images: {
          create: data.images?.map((img) => ({
            url: img.url,
            publicId: img.publicId,
          })) ?? [],
        },
      },
      include: { images: true }, 
    });
  }

  async update(id: string, data: any) {
    const existing = await this.prisma.recipe.findUnique({
      where: { id },
      include: { images: true },
    });

    const removed = existing!.images.filter(
      (img) => !data.imageUrls.some((url: string) => url === img.url)
    );

    for (const img of removed) {
      await this.cloudinary.deleteImage(img.publicId);
    }

    await this.prisma.image.deleteMany({
      where: {
        recipeId: id,
        publicId: { in: removed.map((i) => i.publicId) },
      },
    });

    if (Array.isArray(data.newImages) && data.newImages.length > 0) {
      const validImages = data.newImages.filter(
        (img) => img?.url && img?.publicId
      );

      if (validImages.length !== data.newImages.length) {
        throw new Error('Uma ou mais imagens novas estão incompletas.');
      }

      await this.prisma.image.createMany({
        data: validImages.map((img) => ({
          url: img.url,
          publicId: img.publicId,
          recipeId: id,
        })),
      });
    }

    return this.prisma.recipe.update({
      where: { id },
      data: {
        title: data.title,
        servings: data.servings,
        timeMinutes: data.timeMinutes,
        ingredients: data.ingredients,
        steps: data.steps,
      },
    });
  }



  delete(id: string) {
    return this.prisma.recipe.delete({ where: { id } })
  }
}
