import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Clean existing data
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  // Create demo users
  const hashedPassword = await bcrypt.hash('password123', 12);
  const specificUserPassword = await bcrypt.hash('-HT6pDraBb6LF6-', 12);

  const demoUser = await prisma.user.create({
    data: {
      email: 'user@demo.com',
      password: hashedPassword,
      name: 'Demo User',
      role: 'USER',
    },
  });

  const demoSeller = await prisma.user.create({
    data: {
      email: 'seller@demo.com',
      password: hashedPassword,
      name: 'Demo Seller',
      role: 'SELLER',
    },
  });

  // Create the specific user from the screenshot
  const specificUser = await prisma.user.create({
    data: {
      email: 'cbharath20064@gmail.com',
      password: specificUserPassword,
      name: 'Bharath',
      role: 'SELLER',
    },
  });

  const demoAdmin = await prisma.user.create({
    data: {
      email: 'admin@demo.com',
      password: hashedPassword,
      name: 'Demo Admin',
      role: 'ADMIN',
    },
  });

  // Create demo products
  const demoProducts = [
    {
      name: 'iPhone 15 Pro',
      description: 'Latest Apple iPhone with advanced camera system and A17 Pro chip',
      price: 999.99,
      category: 'Electronics',
      stock: 50,
      imageUrl: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400',
      location: 'New York, NY',
      sellerId: demoSeller.id,
    },
    {
      name: 'MacBook Air M3',
      description: 'Ultra-thin laptop with M3 chip, perfect for productivity and creativity',
      price: 1299.99,
      category: 'Electronics',
      stock: 30,
      imageUrl: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400',
      location: 'San Francisco, CA',
      sellerId: demoSeller.id,
    },
    {
      name: 'Nike Air Max 90',
      description: 'Classic sneakers with maximum comfort and timeless style',
      price: 129.99,
      category: 'Fashion',
      stock: 100,
      imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
      location: 'Los Angeles, CA',
      sellerId: demoSeller.id,
    },
    {
      name: 'Samsung 65" 4K TV',
      description: 'Ultra HD Smart TV with HDR and built-in streaming apps',
      price: 799.99,
      category: 'Electronics',
      stock: 25,
      imageUrl: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400',
      location: 'Chicago, IL',
      sellerId: demoSeller.id,
    },
    {
      name: 'Adidas Running Shoes',
      description: 'Lightweight running shoes with boost technology',
      price: 89.99,
      category: 'Sports',
      stock: 75,
      imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400',
      location: 'Miami, FL',
      sellerId: demoSeller.id,
    },
    {
      name: 'Instant Coffee Maker',
      description: 'Quick and easy coffee maker for busy mornings',
      price: 49.99,
      category: 'Home',
      stock: 60,
      imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400',
      location: 'Seattle, WA',
      sellerId: demoSeller.id,
    },
    {
      name: 'Wireless Headphones',
      description: 'Premium noise-canceling wireless headphones',
      price: 299.99,
      category: 'Electronics',
      stock: 40,
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
      location: 'Austin, TX',
      sellerId: demoSeller.id,
    },
    {
      name: 'Gaming Chair',
      description: 'Ergonomic gaming chair with lumbar support and adjustable height',
      price: 199.99,
      category: 'Furniture',
      stock: 20,
      imageUrl: 'https://images.unsplash.com/photo-1586227740560-8cf2732c1531?w=400',
      location: 'Denver, CO',
      sellerId: demoSeller.id,
    },
  ];

  for (const product of demoProducts) {
    await prisma.product.create({
      data: product,
    });
  }

  console.log('✅ Database seeded successfully!');
  console.log('Demo accounts:');
  console.log('User: user@demo.com / password123');
  console.log('Seller: seller@demo.com / password123');
  console.log('Admin: admin@demo.com / password123');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    if (typeof process !== 'undefined') {
      process.exit(1);
    }
  });
