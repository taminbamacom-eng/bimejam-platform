#!/bin/sh
set -e

echo "🚀 [Bimeh Jam] Starting production container initialization..."

# Ensure data directory and dev.db exist
mkdir -p /app/prisma

# Sync Prisma database schema (create tables if they don't exist)
echo "📦 [Bimeh Jam] Synchronizing database schema via Prisma..."
npx prisma db push --skip-generate --accept-data-loss

# Auto-seed initial admin and demo data if the database is newly created
if [ "$AUTO_SEED" = "true" ]; then
  echo "🌱 [Bimeh Jam] Checking if initial seed data is required..."
  node -e "
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    async function checkAndSeed() {
      try {
        const count = await prisma.user.count();
        if (count === 0) {
          console.log('🌱 Database is empty. Seeding initial admin, rules and demo leads...');
          const bcrypt = require('bcryptjs');
          const adminEmail = process.env.ADMIN_INITIAL_EMAIL;
          const adminPassword = process.env.ADMIN_INITIAL_PASSWORD;
          if (!adminEmail || !adminPassword) {
            throw new Error('ADMIN_INITIAL_EMAIL and ADMIN_INITIAL_PASSWORD must be configured.');
          }
          const hash = await bcrypt.hash(adminPassword, 10);
          await prisma.user.create({
            data: {
              email: adminEmail,
              name: 'مدیریت سامانه بیمه جم',
              password: hash,
              role: 'ADMIN'
            }
          });
          console.log(`✅ Default Admin created: ${adminEmail}`);
        } else {
          console.log('ℹ️ Database already contains ' + count + ' user(s). Skipping seed.');
        }
      } catch (err) {
        console.error('⚠️ Seed check note:', err.message);
      } finally {
        await prisma.\$disconnect();
      }
    }
    checkAndSeed();
  " || true
  touch /app/prisma/.seeded
fi

echo "🟢 [Bimeh Jam] Database ready! Launching Application on port ${PORT:-3000}..."
exec "$@"
