import {
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsNumberString,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';
import { PostType } from '../post.entity';

export class CreatePostDto {
  @IsInt()
  venueId: number;

  @IsOptional()
  @IsInt()
  bandId?: number;

  @IsEnum(PostType)
  postType: PostType;

  @IsString()
  @MaxLength(200)
  title: string;

  @IsString()
  content: string;

  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  mediaUrls?: string[];

  @IsOptional()
  @IsUrl()
  youtubeUrl?: string;

  @IsOptional()
  @IsUrl()
  ticketLink?: string;

  @IsOptional()
  @IsNumberString()
  price?: string;

  @IsOptional()
  @IsDateString()
  eventDate?: string;
}
