import { IsInt, IsObject, IsOptional, IsString, MaxLength } from 'class-validator';

export class SendNotificationDto {
  @IsInt()
  userId: number;

  @IsString()
  @MaxLength(120)
  title: string;

  @IsString()
  @MaxLength(500)
  body: string;

  @IsOptional()
  @IsObject()
  data?: Record<string, string>;
}
