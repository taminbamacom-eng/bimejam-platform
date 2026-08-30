import { prisma } from './client';
import bcrypt from 'bcryptjs';

export async function seedDatabase() {
  console.log('🌱 Checking initial database seed...');

  const adminEmail =
    process.env.ADMIN_INITIAL_EMAIL || 'admin@bimehjam.ir';

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    console.log('ℹ️ Admin already exists. Skipping admin creation.');
  }

  if (!existingAdmin) {
    const adminPassword =
      process.env.ADMIN_INITIAL_PASSWORD ||
      process.env.INITIAL_ADMIN_PASSWORD ||
      '12345678';

    const hashedAdminPassword = await bcrypt.hash(adminPassword, 10);

    await prisma.user.create({
      data: {
        email: adminEmail,
        name: 'مدیریت سامانه بیمه جم',
        password: hashedAdminPassword,
        role: 'ADMIN',
      },
    });

    console.log('✅ Initial admin created.');
  }

  const aiPolicies = [
    {
      category: 'VEHICLE',
      mode: 'AI_ALLOWED',
      priority: 'NORMAL',
      aiInstruction: 'پاسخ کامل درباره بیمه‌های خودرو و جمع‌آوری اطلاعات استعلام',
    },
    {
      category: 'RESPONSIBILITY',
      mode: 'AI_ASSISTED',
      priority: 'NORMAL',
      aiInstruction: 'اطلاعات اولیه دریافت شود و در صورت نیاز کارشناس وارد شود',
    },
    {
      category: 'FIRE',
      mode: 'AI_ALLOWED',
      priority: 'NORMAL',
      aiInstruction: 'پاسخ درباره پوشش‌ها و شرایط بیمه آتش‌سوزی',
    },
    {
      category: 'ENGINEERING',
      mode: 'AI_ASSISTED',
      priority: 'NORMAL',
      aiInstruction: 'پاسخ اولیه و ارجاع برای بررسی تخصصی',
    },
    {
      category: 'OTHER',
      mode: 'AI_ASSISTED',
      priority: 'NORMAL',
      aiInstruction: 'پاسخ عمومی و ایجاد Lead در صورت نیاز',
    },
    {
      category: 'CLAIM',
      mode: 'HUMAN_ONLY',
      priority: 'HIGH',
      aiInstruction: 'بدون پاسخ تخصصی، فقط ارجاع به کارشناس',
    },
    {
      category: 'POLICY_ISSUE',
      mode: 'AI_ASSISTED',
      priority: 'NORMAL',
      aiInstruction: 'جمع‌آوری اطلاعات صدور و ارجاع',
    },
    {
      category: 'COOPERATION',
      mode: 'HUMAN_ONLY',
      priority: 'NORMAL',
      aiInstruction: 'ارجاع به واحد مربوطه',
    },
    {
      category: 'TECH_SUPPORT',
      mode: 'HUMAN_ONLY',
      priority: 'HIGH',
      aiInstruction: 'پشتیبانی فنی توسط کارشناس',
    },
    {
      category: 'MANAGEMENT_CONTACT',
      mode: 'HUMAN_ONLY',
      priority: 'URGENT',
      aiInstruction: 'ارتباط مستقیم با مدیریت',
    },
  ];

  for (const policy of aiPolicies) {
    await prisma.aiResponsePolicy.upsert({
      where: {
        category: policy.category,
      },
      update: {},
      create: policy,
    });
  }

  console.log('✅ AI Response Policies seeded.');
}

const isDirectRun = Boolean(
  (typeof process !== 'undefined' &&
    process.argv[1] &&
    process.argv[1].endsWith('seed.ts')) ||
  (typeof require !== 'undefined' && require.main === module)
);

if (isDirectRun) {
  seedDatabase()
    .catch((e) => {
      console.error('❌ Seeding failed:', e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
