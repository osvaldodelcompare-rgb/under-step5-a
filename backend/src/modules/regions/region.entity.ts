import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '@shared/base.entity';

@Entity('regions')
export class Region extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 120 })
  name: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  code: string;

  @Column({ name: 'db_host', type: 'varchar', length: 255, default: 'localhost' })
  dbHost: string;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;
}
