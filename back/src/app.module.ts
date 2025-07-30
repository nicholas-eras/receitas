import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RecipesModule } from './recipes/recipes.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [RecipesModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
