import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Venue } from './venue.entity';
import { CreateVenueDto } from './dto/create-venue.dto';
import { UpdateVenueDto } from './dto/update-venue.dto';
import { slugify } from '@shared/utils/slugify';
import { UsersService } from '@modules/users/users.service';
import { User, UserRole } from '@modules/users/user.entity';

@Injectable()
export class VenuesService {
  constructor(
    @InjectRepository(Venue)
    private readonly venuesRepository: Repository<Venue>,
    private readonly usersService: UsersService,
  ) {}

  async create(requester: User, dto: CreateVenueDto): Promise<Venue> {
    const baseSlug = slugify(dto.name);
    const slug = await this.generateUniqueSlug(baseSlug);

    const venue = this.venuesRepository.create({
      ...dto,
      ownerId: requester.id,
      slug,
    });

    const saved = await this.venuesRepository.save(venue);

    // Creating a venue profile is how a regular user becomes a business
    // (venue) admin — no manual role assignment needed.
    if (requester.role === UserRole.USER) {
      requester.role = UserRole.VENUE_ADMIN;
      await this.usersService.save(requester);
    }

    return saved;
  }

  findAll(regionId?: number): Promise<Venue[]> {
    return this.venuesRepository.find({
      where: regionId ? { regionId } : {},
      relations: ['region', 'plan'],
      order: { createdAt: 'DESC' },
    });
  }

  findByOwner(ownerId: number): Promise<Venue[]> {
    return this.venuesRepository.find({
      where: { ownerId },
      relations: ['region', 'plan'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Venue> {
    const venue = await this.venuesRepository.findOne({
      where: { id },
      relations: ['region', 'plan', 'owner'],
    });
    if (!venue) {
      throw new NotFoundException(`Venue #${id} not found`);
    }
    return venue;
  }

  async findBySlug(slug: string): Promise<Venue> {
    const venue = await this.venuesRepository.findOne({
      where: { slug },
      relations: ['region', 'plan'],
    });
    if (!venue) {
      throw new NotFoundException(`Venue "${slug}" not found`);
    }
    return venue;
  }

  async update(
    id: number,
    requesterId: number,
    dto: UpdateVenueDto,
  ): Promise<Venue> {
    const venue = await this.findOne(id);
    this.assertOwnership(venue, requesterId);

    if (dto.name && dto.name !== venue.name) {
      const baseSlug = slugify(dto.name);
      venue.slug = await this.generateUniqueSlug(baseSlug, id);
    }

    Object.assign(venue, dto);
    return this.venuesRepository.save(venue);
  }

  async remove(id: number, requesterId: number): Promise<void> {
    const venue = await this.findOne(id);
    this.assertOwnership(venue, requesterId);
    await this.venuesRepository.remove(venue);
  }

  private assertOwnership(venue: Venue, requesterId: number): void {
    if (venue.ownerId !== requesterId) {
      throw new ForbiddenException(
        'You do not have permission to modify this venue',
      );
    }
  }

  private async generateUniqueSlug(
    baseSlug: string,
    excludeId?: number,
  ): Promise<string> {
    let slug = baseSlug;
    let suffix = 1;
    while (true) {
      const existing = await this.venuesRepository.findOne({ where: { slug } });
      if (!existing || existing.id === excludeId) {
        break;
      }
      slug = `${baseSlug}-${suffix}`;
      suffix += 1;
    }
    return slug;
  }
}
