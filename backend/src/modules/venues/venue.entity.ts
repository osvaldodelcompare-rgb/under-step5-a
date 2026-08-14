import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from '@shared/base.entity';
import { User } from '@modules/users/user.entity';
import { Region } from '@modules/regions/region.entity';
import { SubscriptionPlan } from './subscription-plan.entity';

@Entity('venues')
export class Venue extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'owner_id' })
  ownerId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @Column({ name: 'region_id' })
  regionId: number;

  @ManyToOne(() => Region, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'region_id' })
  region: Region;

  @Column({ name: 'plan_id', nullable: true })
  planId: number | null;

  @ManyToOne(() => SubscriptionPlan, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'plan_id' })
  plan: SubscriptionPlan | null;

  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Column({ type: 'varchar', length: 180, unique: true })
  slug: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 255 })
  address: string;

  @Column({ type: 'varchar', length: 120, nullable: true })
  neighborhood: string;

  @Column({ type: 'varchar', length: 120 })
  city: string;

  @Column({ type: 'numeric', precision: 10, scale: 7, nullable: true })
  latitude: string | null;

  @Column({ type: 'numeric', precision: 10, scale: 7, nullable: true })
  longitude: string | null;

  @Column({ name: 'logo_url', type: 'varchar', length: 500, nullable: true })
  logoUrl: string | null;

  @Column({ name: 'banner_url', type: 'varchar', length: 500, nullable: true })
  bannerUrl: string | null;

  @Column({ name: 'mp_qr_url', type: 'varchar', length: 500, nullable: true })
  mpQrUrl: string | null;

  @Column({ name: 'mp_link', type: 'varchar', length: 500, nullable: true })
  mpLink: string | null;

  @Column({ type: 'jsonb', default: {} })
  services: Record<string, unknown>;
}
