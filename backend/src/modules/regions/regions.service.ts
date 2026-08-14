import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Region } from './region.entity';
import { CreateRegionDto } from './dto/create-region.dto';
import { UpdateRegionDto } from './dto/update-region.dto';

@Injectable()
export class RegionsService {
  constructor(
    @InjectRepository(Region)
    private readonly regionsRepository: Repository<Region>,
  ) {}

  async create(dto: CreateRegionDto): Promise<Region> {
    const existing = await this.regionsRepository.findOne({
      where: { code: dto.code },
    });
    if (existing) {
      throw new ConflictException(
        `Region with code "${dto.code}" already exists`,
      );
    }
    const region = this.regionsRepository.create(dto);
    return this.regionsRepository.save(region);
  }

  findAll(): Promise<Region[]> {
    return this.regionsRepository.find({ order: { name: 'ASC' } });
  }

  async findOne(id: number): Promise<Region> {
    const region = await this.regionsRepository.findOne({ where: { id } });
    if (!region) {
      throw new NotFoundException(`Region #${id} not found`);
    }
    return region;
  }

  async findByCode(code: string): Promise<Region> {
    const region = await this.regionsRepository.findOne({ where: { code } });
    if (!region) {
      throw new NotFoundException(`Region with code "${code}" not found`);
    }
    return region;
  }

  async update(id: number, dto: UpdateRegionDto): Promise<Region> {
    const region = await this.findOne(id);
    Object.assign(region, dto);
    return this.regionsRepository.save(region);
  }

  async remove(id: number): Promise<void> {
    const region = await this.findOne(id);
    await this.regionsRepository.remove(region);
  }
}
