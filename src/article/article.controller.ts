import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ArticleService } from './article.service';
import { AuthGuard } from '../user/guards/auth.guard';
import { User } from '../user/decorators/user.decorator';
import { CreateArticleDto } from './dto/create-article.dto';
import { User as UserEntity  } from '../user/entities/user.entity';
import { ArticleResponseInterface } from './types/articleResponse.interface';
import { Article } from './entities/article.entity';
import { ArticlesResponseInterface } from './types/articles.interface';

@Controller('articles')
export class ArticleController {
   constructor(private readonly articleService: ArticleService) {}

   @Get()
   async findAll(@User('id') currentUserId: number, @Query() query: any): Promise<ArticlesResponseInterface> {
      return await this.articleService.findAll(currentUserId, query);
   }

   @Get(':slug')
   @UseGuards(AuthGuard)
   async getArticle(@Param('slug') articleSlug: string): Promise<ArticleResponseInterface> {
      const article = await this.articleService.findBySlug(articleSlug);
      return this.articleService.buildArticleResponse(article);
   }

   @Post()
   @UseGuards(AuthGuard)
   async createArticle(@User() currentUser: UserEntity, @Body('article') createArticleDto: CreateArticleDto): Promise<ArticleResponseInterface> {
      const article = await this.articleService.createArticle(currentUser, createArticleDto);
      return this.articleService.buildArticleResponse(article);
   }

   @Put(':slug')
   async updateArticle(@User('id') currentUserId: number, @Param('slug') updateArticle:string, @Body('article') updateArticleDto: CreateArticleDto) {
      const article = await this.articleService.updateArticle(updateArticle, updateArticleDto, currentUserId);
      return await this.articleService.buildArticleResponse(article);
   }

   @Delete(':slug')
   @UseGuards(AuthGuard)
   async deleteArticle(@Param('slug') articleSlug: string, @User('id') currentUserId: number) {
      return await this.articleService.deleteArticle(articleSlug, currentUserId);
   }
}
