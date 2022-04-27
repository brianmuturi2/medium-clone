import { IsOptional, IsString } from 'class-validator';

export class CreateArticleDto {
  @IsString()
  readonly title: string;

  @IsString()
  readonly description: string;

  @IsString()
  readonly body: string;

  @IsOptional()
  @IsString({each: true})
  readonly tagList?: string[];
}
