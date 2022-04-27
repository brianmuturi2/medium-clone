import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ArticleService } from './article.service';
import { AuthGuard } from '../user/guards/auth.guard';
import { User } from '../user/decorators/user.decorator';
import { CreateArticleDto } from './dto/create-article.dto';
import { User as UserEntity  } from '../user/entities/user.entity';
import { ArticleResponseInterface } from './types/articleResponse.interface';

@Controller('articles')
export class ArticleController {
   constructor(private readonly articleService: ArticleService) {}

   @Post()
   @UseGuards(AuthGuard)
   async createArticle(@User() currentUser: UserEntity, @Body('article') createArticleDto: CreateArticleDto): Promise<ArticleResponseInterface> {
      const article = await this.articleService.createArticle(currentUser, createArticleDto);
      return this.articleService.buildArticleResponse(article);
   }
}