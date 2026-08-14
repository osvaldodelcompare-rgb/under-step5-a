import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateRegionDto {
  @IsString()
  @MaxLength(120)
  name: string;

  @IsString()
  @MaxLength(20)
  code: string;

  @IsOptional()
  @IsString()
  dbHost?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
