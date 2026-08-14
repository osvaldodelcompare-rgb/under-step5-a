import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Band } from './band.entity';
import { CreateBandDto } from './dto/create-band.dto';
import { UpdateBandDto } from './dto/update-band.dto';
import { slugify } from '@shared/utils/slugify';

@Injectable()
export class BandsService {
  constructor(
    @InjectRepository(Band)
    private readonly bandsRepository: Repository<Band>,
  ) {}

  async create(ownerId: number, dto: CreateBandDto): Promise<Band> {
    const baseSlug = slugify(dto.name);
    const slug = await this.generateUniqueSlug(baseSlug);

    const band = this.bandsRepository.create({
      ...dto,
      ownerId,
      slug,
      youtubeEmbedUrls: dto.youtubeEmbedUrls ?? [],
    });

    return this.bandsRepository.save(band);
  }

  findAll(genre?: string): Promise<Band[]> {
    return this.bandsRepository.find({
      where: genre ? { genre } : {},
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Band> {
    const band = await this.bandsRepository.findOne({
      where: { id },
      relations: ['owner'],
    });
    if (!band) {
      throw new NotFoundException(`Band #${id} not found`);
    }
    return band;
  }

  async findBySlug(slug: string): Promise<Band> {
    const band = await this.bandsRepository.findOne({ where: { slug } });
    if (!band) {
      throw new NotFoundException(`Band "${slug}" not found`);
    }
    return band;
  }

  async update(id: number, requesterId: number, dto: UpdateBandDto): Promise<Band> {
    const band = await this.findOne(id);
    this.assertOwnership(band, requesterId);
    Object.assign(band, dto);
    return this.bandsRepository.save(band);
  }

  async remove(id: number, requesterId: number): Promise<void> {
    const band = await this.findOne(id);
    this.assertOwnership(band, requesterId);
    await this.bandsRepository.remove(band);
  }

  private assertOwnership(band: Band, requesterId: number): void {
    if (band.ownerId !== requesterId) {
      throw new ForbiddenException(
        'You do not have permission to modify this band',
      );
    }
  }

  private async generateUniqueSlug(baseSlug: string): Promise<string> {
    let slug = baseSlug;
    let suffix = 1;
    while (await this.bandsRepository.findOne({ where: { slug } })) {
      slug = `${baseSlug}-${suffix}`;
      suffix += 1;
    }
    return slug;
  }
}
