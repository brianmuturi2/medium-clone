import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { Article } from './entities/article.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, getRepository, Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { ArticleResponseInterface } from './types/articleResponse.interface';
import slugify from 'slugify';
import { ArticlesResponseInterface } from './types/articles.interface';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async findAll(currentUserId: number, query: any): Promise<ArticlesResponseInterface> {
    const queryBuilder = getRepository(Article).createQueryBuilder('articles').leftJoinAndSelect('articles.author', 'author');

    queryBuilder.orderBy('articles.createdAt', 'DESC');

    if (query.tag) {
      queryBuilder.andWhere('articles.tagList LIKE :tag', {
        tag: `%${query.tag}%`
      });
    }

    if (query.author) {
      const author = await this.userRepository.findOne({
        username: query.author
      })
      queryBuilder.andWhere('articles.authorId = :id', {
        id: author.id
      });
    }

    if(query.limit) {
      queryBuilder.limit(query.limit);
    }

    if(query.offset) {
      queryBuilder.offset(query.offset);
    }

    const articles = await queryBuilder.getMany();
    const articlesCount = await queryBuilder.getCount();

    return {articles, articlesCount};
  }

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

  async getArticles() {
    return await this.articleRepository.find();
  }

  async findBySlug(slug: string): Promise<Article> {
    return await this.articleRepository.findOne({slug});
  }

  async updateArticle(slug:string, updateArticleDto: CreateArticleDto, currentUserId:number): Promise<Article> {
    const article = await this.findBySlug(slug);

    if(!article) {
      throw new HttpException('Article does not exist', HttpStatus.NOT_FOUND);
    }

    if (article.author.id !== currentUserId) {
      throw new HttpException('You are not the author', HttpStatus.FORBIDDEN);
    }

    Object.assign(article, updateArticleDto);

    return await this.articleRepository.save(article);
  }

  async deleteArticle(slug: string, currentUserId: number): Promise<DeleteResult> {
    const article = await this.findBySlug(slug);

    if(!article) {
      throw new HttpException('Article does not exist', HttpStatus.NOT_FOUND);
    }

    if (article.author.id !== currentUserId) {
      throw new HttpException('You are not the author', HttpStatus.FORBIDDEN);
    }

    return await this.articleRepository.delete({slug});
  }

  async favoriteArticle(slug: string, currentUserId: number): Promise<Article> {
    const article = await this.findBySlug(slug);
    const user = await this.userRepository.findOne(currentUserId, {
      relations: ['favorites']
    });

    const isNotFavorited = user.favorites.findIndex(articleInFavorites => articleInFavorites.id === article.id) === -1;

    if (isNotFavorited) {
      user.favorites.push(article);
      article.favoritesCount++;
      await this.userRepository.save(user);
      await this.articleRepository.save(article);
    }

    return article;
  }

  buildArticleResponse(article: Article): ArticleResponseInterface {
    return { article }
  }

  private getSlug(title: string): string {
    return (slugify(title, {lower: true}) + '-' + ((Math.random() * Math.pow(36, 6)) | 0).toString(36));
  }

}
