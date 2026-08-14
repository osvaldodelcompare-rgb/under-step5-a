import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post, PostType } from './post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PaginationQueryDto } from '@shared/dto/pagination-query.dto';
import { PaginatedResultDto } from '@shared/dto/paginated-result.dto';
import { VenuesService } from '@modules/venues/venues.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
    private readonly venuesService: VenuesService,
  ) {}

  async create(requesterId: number, dto: CreatePostDto): Promise<Post> {
    const venue = await this.venuesService.findOne(dto.venueId);
    if (venue.ownerId !== requesterId) {
      throw new ForbiddenException(
        'You do not have permission to post on behalf of this venue',
      );
    }

    const post = this.postsRepository.create({
      ...dto,
      mediaUrls: dto.mediaUrls ?? [],
      eventDate: dto.eventDate ? new Date(dto.eventDate) : null,
    });

    return this.postsRepository.save(post);
  }

  async findAll(
    query: PaginationQueryDto,
    filters: { venueId?: number; bandId?: number; postType?: PostType },
  ): Promise<PaginatedResultDto<Post>> {
    const qb = this.postsRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.venue', 'venue')
      .leftJoinAndSelect('post.band', 'band')
      .orderBy('post.createdAt', 'DESC')
      .skip(query.skip)
      .take(query.limit);

    if (filters.venueId) {
      qb.andWhere('post.venueId = :venueId', { venueId: filters.venueId });
    }
    if (filters.bandId) {
      qb.andWhere('post.bandId = :bandId', { bandId: filters.bandId });
    }
    if (filters.postType) {
      qb.andWhere('post.postType = :postType', {
        postType: filters.postType,
      });
    }

    const [data, total] = await qb.getManyAndCount();
    return new PaginatedResultDto(data, total, query.page, query.limit);
  }

  async findOne(id: number): Promise<Post> {
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: ['venue', 'band'],
    });
    if (!post) {
      throw new NotFoundException(`Post #${id} not found`);
    }
    return post;
  }

  async update(
    id: number,
    requesterId: number,
    dto: UpdatePostDto,
  ): Promise<Post> {
    const post = await this.findOne(id);
    await this.assertVenueOwnership(post.venueId, requesterId);

    Object.assign(post, {
      ...dto,
      eventDate: dto.eventDate ? new Date(dto.eventDate) : post.eventDate,
    });

    return this.postsRepository.save(post);
  }

  async remove(id: number, requesterId: number): Promise<void> {
    const post = await this.findOne(id);
    await this.assertVenueOwnership(post.venueId, requesterId);
    await this.postsRepository.remove(post);
  }

  private async assertVenueOwnership(
    venueId: number,
    requesterId: number,
  ): Promise<void> {
    const venue = await this.venuesService.findOne(venueId);
    if (venue.ownerId !== requesterId) {
      throw new ForbiddenException(
        'You do not have permission to modify this post',
      );
    }
  }
}
