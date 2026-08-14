import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { BaseEntity } from '@shared/base.entity';

export enum UserRole {
  USER = 'user',
  VENUE_ADMIN = 'venue_admin',
  BAND_ADMIN = 'band_admin',
  SUPERADMIN = 'superadmin',
}

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Exclude({ toPlainOnly: true })
  @Column({ name: 'password_hash', type: 'varchar', length: 255, nullable: true })
  passwordHash: string | null;

  @Column({ name: 'google_id', type: 'varchar', length: 255, nullable: true })
  googleId: string | null;

  @Column({ name: 'facebook_id', type: 'varchar', length: 255, nullable: true })
  facebookId: string | null;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Column({ name: 'fcm_token', type: 'varchar', length: 255, nullable: true })
  fcmToken: string | null;

  @Column({
    name: 'favorite_genres',
    type: 'text',
    array: true,
    default: () => 'ARRAY[]::text[]',
  })
  favoriteGenres: string[];
}
