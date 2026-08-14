import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '@shared/base.entity';

@Entity('subscription_plans')
export class SubscriptionPlan extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 60 })
  name: string;

  @Column({ name: 'show_ads', type: 'boolean', default: true })
  showAds: boolean;

  @Column({ name: 'featured_in_feed', type: 'boolean', default: false })
  featuredInFeed: boolean;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  price: string;
}
