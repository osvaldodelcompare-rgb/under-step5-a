import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from '@shared/base.entity';
import { Venue } from '@modules/venues/venue.entity';
import { Band } from '@modules/bands/band.entity';

export enum PostType {
  EVENT = 'event',
  PROMO = 'promo',
  MERCH = 'merch',
  NEWS = 'news',
}

@Entity('posts')
export class Post extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'venue_id' })
  venueId: number;

  @ManyToOne(() => Venue, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'venue_id' })
  venue: Venue;

  @Column({ name: 'band_id', nullable: true })
  bandId: number | null;

  @ManyToOne(() => Band, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'band_id' })
  band: Band | null;

  @Column({
    name: 'post_type',
    type: 'enum',
    enum: PostType,
  })
  postType: PostType;

  @Column({ type: 'varchar', length: 200 })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({
    name: 'media_urls',
    type: 'text',
    array: true,
    default: () => 'ARRAY[]::text[]',
  })
  mediaUrls: string[];

  @Column({ name: 'youtube_url', type: 'varchar', length: 500, nullable: true })
  youtubeUrl: string | null;

  @Column({ name: 'ticket_link', type: 'varchar', length: 500, nullable: true })
  ticketLink: string | null;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  price: string | null;

  @Column({ name: 'event_date', type: 'timestamp', nullable: true })
  eventDate: Date | null;
}
