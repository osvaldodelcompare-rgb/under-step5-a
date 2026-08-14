import { dataSourceOptions } from '@config/typeorm.config';
import { DataSource } from 'typeorm';
import { Region } from '@modules/regions/region.entity';
import { SubscriptionPlan } from '@modules/venues/subscription-plan.entity';
import { User, UserRole } from '@modules/users/user.entity';
import * as bcrypt from 'bcrypt';

async function runSeed(): Promise<void> {
  const dataSource = new DataSource(dataSourceOptions);
  await dataSource.initialize();

  const regionRepo = dataSource.getRepository(Region);
  const planRepo = dataSource.getRepository(SubscriptionPlan);
  const userRepo = dataSource.getRepository(User);

  const regions = [
    { name: 'La Plata', code: 'lp', dbHost: 'localhost', isActive: true },
    {
      name: 'Ciudad Autónoma de Buenos Aires',
      code: 'caba',
      dbHost: 'localhost',
      isActive: true,
    },
  ];

  for (const regionData of regions) {
    const existing = await regionRepo.findOne({
      where: { code: regionData.code },
    });
    if (!existing) {
      await regionRepo.save(regionRepo.create(regionData));
      console.log(`Seeded region: ${regionData.name}`);
    }
  }

  const plans = [
    {
      name: 'Free',
      showAds: true,
      featuredInFeed: false,
      price: '0.00',
    },
    {
      name: 'Premium',
      showAds: false,
      featuredInFeed: true,
      price: '4999.00',
    },
  ];

  for (const planData of plans) {
    const existing = await planRepo.findOne({ where: { name: planData.name } });
    if (!existing) {
      await planRepo.save(planRepo.create(planData));
      console.log(`Seeded subscription plan: ${planData.name}`);
    }
  }

  const superadminEmail = 'admin@underground.dev';
  const existingAdmin = await userRepo.findOne({
    where: { email: superadminEmail },
  });
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash('ChangeMe123!', 10);
    await userRepo.save(
      userRepo.create({
        name: 'Underground Superadmin',
        email: superadminEmail,
        passwordHash,
        role: UserRole.SUPERADMIN,
        favoriteGenres: [],
      }),
    );
    console.log(`Seeded superadmin user: ${superadminEmail} / ChangeMe123!`);
  }

  await dataSource.destroy();
  console.log('Seed completed.');
}

runSeed().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});
