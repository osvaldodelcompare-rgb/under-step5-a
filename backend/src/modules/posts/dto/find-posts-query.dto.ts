import { IsEnum, IsInt, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationQueryDto } from '@shared/dto/pagination-query.dto';
import { PostType } from '../post.entity';

export class FindPostsQueryDto extends PaginationQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  venueId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  bandId?: number;

  @IsOptional()
  @IsEnum(PostType)
  postType?: PostType;
}
