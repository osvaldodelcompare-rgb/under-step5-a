import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from '@shared/base.entity';
import { User } from '@modules/users/user.entity';

@Entity('bands')
export class Band extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'owner_id' })
  ownerId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Column({ type: 'varchar', length: 180, unique: true })
  slug: string;

  @Column({ type: 'varchar', length: 80 })
  genre: string;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ name: 'logo_url', type: 'varchar', length: 500, nullable: true })
  logoUrl: string | null;

  @Column({ name: 'banner_url', type: 'varchar', length: 500, nullable: true })
  bannerUrl: string | null;

  @Column({ name: 'instagram_url', type: 'varchar', length: 500, nullable: true })
  instagramUrl: string | null;

  @Column({ name: 'facebook_url', type: 'varchar', length: 500, nullable: true })
  facebookUrl: string | null;

  @Column({ name: 'manager_email', type: 'varchar', length: 255, nullable: true })
  managerEmail: string | null;

  @Column({ name: 'manager_phone', type: 'varchar', length: 40, nullable: true })
  managerPhone: string | null;

  @Column({
    name: 'youtube_embed_urls',
    type: 'text',
    array: true,
    default: () => 'ARRAY[]::text[]',
  })
  youtubeEmbedUrls: string[];

  @Column({ name: 'mp_qr_url', type: 'varchar', length: 500, nullable: true })
  mpQrUrl: string | null;

  @Column({ name: 'mp_link', type: 'varchar', length: 500, nullable: true })
  mpLink: string | null;
}
