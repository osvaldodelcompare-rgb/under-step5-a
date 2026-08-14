import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Venue } from './venue.entity';
import { SubscriptionPlan } from './subscription-plan.entity';
import { VenuesService } from './venues.service';
import { VenuesController } from './venues.controller';
import { UsersModule } from '@modules/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Venue, SubscriptionPlan]), UsersModule],
  controllers: [VenuesController],
  providers: [VenuesService],
  exports: [VenuesService],
})
export class VenuesModule {}
