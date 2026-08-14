import {
  IsArray,
  IsEmail,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';

export class CreateBandDto {
  @IsString()
  @MaxLength(150)
  name: string;

  @IsString()
  @MaxLength(80)
  genre: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsUrl()
  logoUrl?: string;

  @IsOptional()
  @IsUrl()
  bannerUrl?: string;

  @IsOptional()
  @IsUrl()
  instagramUrl?: string;

  @IsOptional()
  @IsUrl()
  facebookUrl?: string;

  @IsOptional()
  @IsEmail()
  managerEmail?: string;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  managerPhone?: string;

  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  youtubeEmbedUrls?: string[];

  @IsOptional()
  @IsUrl()
  mpQrUrl?: string;

  @IsOptional()
  @IsUrl()
  mpLink?: string;
}
