import { Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { Article } from './entities/article.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { ArticleResponseInterface } from './types/articleResponse.interface';
import slugify from 'slugify';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>
  ) {}

  async createArticle(currentUser: User, createArticleDto: CreateArticleDto): Promise<Article> {
    const article = new Article();
    Object.assign(article, createArticleDto);
    if (!article.tagList) {
      article.tagList = [];
    }
    article.slug = this.getSlug(createArticleDto.title);
    article.author = currentUser;
    return await this.articleRepository.save(article);
  }

  buildArticleResponse(article: Article): ArticleResponseInterface {
    return { article }
  }

  private getSlug(title: string): string {
    return (slugify(title, {lower: true}) + '-' + ((Math.random() * Math.pow(36, 6)) | 0).toString(36));
  }
}
