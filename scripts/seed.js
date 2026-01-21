// Use tsx to run this file: tsx scripts/seed.js
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import bcrypt from 'bcryptjs'
import 'dotenv/config'

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  throw new Error('DATABASE_URL is missing. Put your Supabase Postgres connection string in .env')
}

const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  const passwordHash = await bcrypt.hash('admin123', 10)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@lynossweets.com' },
    update: {},
    create: {
      email: 'admin@lynossweets.com',
      name: 'Admin User',
      passwordHash,
      role: 'ADMIN',
      isActive: true
    }
  })

  console.log('✅ Created admin user:', admin.email)

  const products = [
    {
      name: 'Chocolate Chip Cookies',
      description: 'Classic chocolate chip cookies with premium dark chocolate',
      price: 8.99,
      cost: 3.50,
      category: 'Cookies',
      isFeatured: true
    },
    {
      name: 'Sugar Cookies',
      description: 'Sweet and buttery sugar cookies with decorative frosting',
      price: 7.99,
      cost: 2.80,
      category: 'Cookies',
      isFeatured: true
    },
    {
      name: 'Oatmeal Raisin Cookies',
      description: 'Hearty oatmeal cookies with plump raisins',
      price: 7.49,
      cost: 2.60,
      category: 'Cookies',
      isFeatured: false
    },
    {
      name: 'Double Chocolate Brownies',
      description: 'Rich and fudgy brownies with double chocolate',
      price: 9.99,
      cost: 4.20,
      category: 'Brownies',
      isFeatured: true
    },
    {
      name: 'Vanilla Cupcakes',
      description: 'Moist vanilla cupcakes with buttercream frosting',
      price: 12.99,
      cost: 5.50,
      category: 'Cupcakes',
      isFeatured: false
    }
  ]

  for (const product of products) {
    const existing = await prisma.product.findFirst({
      where: { name: product.name }
    })
    if (!existing) {
      await prisma.product.create({ data: product })
      console.log(`✅ Created product: ${product.name}`)
    } else {
      console.log(`⏭️  Product already exists: ${product.name}`)
    }
  }

  console.log('✅ Database seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
