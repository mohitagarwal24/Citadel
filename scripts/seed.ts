import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import connectDB from '../lib/db/mongodb';
import User from '../models/User';
import Product from '../models/Product';
import Sale from '../models/Sale';

async function seed() {
  try {
    await connectDB();

    console.log('🌱 Seeding database...');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    await Sale.deleteMany({});

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 12);
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@citadel.com',
      password: hashedPassword,
      role: 'admin',
    });

    console.log('✅ Admin user created');
    console.log('   Email: admin@citadel.com');
    console.log('   Password: admin123');

    // Create sample products
    const sampleProducts = [
      {
        name: 'Wireless Bluetooth Headphones',
        description: 'Premium noise-canceling headphones with 30-hour battery life',
        category: 'Electronics',
        price: 149.99,
        stock: 50,
        images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'],
        sku: 'ELEC-001',
        status: 'active',
        tags: ['audio', 'wireless', 'bluetooth'],
        specifications: [
          { key: 'Battery Life', value: '30 hours' },
          { key: 'Connectivity', value: 'Bluetooth 5.0' },
          { key: 'Weight', value: '250g' },
        ],
        createdBy: admin._id.toString(),
      },
      {
        name: 'Smart Watch Pro',
        description: 'Advanced fitness tracking with heart rate monitor and GPS',
        category: 'Electronics',
        price: 299.99,
        stock: 30,
        images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500'],
        sku: 'ELEC-002',
        status: 'active',
        tags: ['wearable', 'fitness', 'smart'],
        specifications: [
          { key: 'Display', value: '1.4" AMOLED' },
          { key: 'Water Resistance', value: '5ATM' },
          { key: 'Battery', value: '7 days' },
        ],
        createdBy: admin._id.toString(),
      },
      {
        name: 'Laptop Stand Aluminum',
        description: 'Ergonomic adjustable laptop stand for better posture',
        category: 'Accessories',
        price: 49.99,
        stock: 100,
        images: ['https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500'],
        sku: 'ACC-001',
        status: 'active',
        tags: ['desk', 'ergonomic', 'aluminum'],
        specifications: [
          { key: 'Material', value: 'Aluminum Alloy' },
          { key: 'Adjustable Height', value: '2.1" - 6"' },
          { key: 'Max Load', value: '10kg' },
        ],
        createdBy: admin._id.toString(),
      },
      {
        name: 'Mechanical Keyboard RGB',
        description: 'Professional gaming keyboard with customizable RGB lighting',
        category: 'Electronics',
        price: 129.99,
        stock: 45,
        images: ['https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500'],
        sku: 'ELEC-003',
        status: 'active',
        tags: ['gaming', 'keyboard', 'rgb'],
        specifications: [
          { key: 'Switch Type', value: 'Cherry MX Blue' },
          { key: 'Backlight', value: 'RGB' },
          { key: 'Connection', value: 'USB-C' },
        ],
        createdBy: admin._id.toString(),
      },
      {
        name: 'USB-C Hub 7-in-1',
        description: 'Multi-port adapter with HDMI, USB 3.0, and SD card reader',
        category: 'Accessories',
        price: 39.99,
        stock: 8,
        images: ['https://images.unsplash.com/photo-1625948515291-69613efd103f?w=500'],
        sku: 'ACC-002',
        status: 'active',
        tags: ['usb', 'adapter', 'hub'],
        specifications: [
          { key: 'Ports', value: '7 (HDMI, USB 3.0 x3, SD, microSD, USB-C)' },
          { key: 'HDMI Output', value: '4K@30Hz' },
          { key: 'Power Delivery', value: '100W' },
        ],
        createdBy: admin._id.toString(),
      },
      {
        name: 'Wireless Mouse Ergonomic',
        description: 'Comfortable vertical mouse design to reduce wrist strain',
        category: 'Accessories',
        price: 34.99,
        stock: 75,
        images: ['https://images.unsplash.com/photo-1527814050087-3793815479db?w=500'],
        sku: 'ACC-003',
        status: 'active',
        tags: ['mouse', 'wireless', 'ergonomic'],
        specifications: [
          { key: 'DPI', value: 'Up to 2400' },
          { key: 'Battery', value: '18 months' },
          { key: 'Connectivity', value: '2.4GHz Wireless' },
        ],
        createdBy: admin._id.toString(),
      },
      {
        name: 'Portable SSD 1TB',
        description: 'Ultra-fast external storage with USB 3.2 Gen 2',
        category: 'Storage',
        price: 119.99,
        stock: 60,
        images: ['https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500'],
        sku: 'STOR-001',
        status: 'active',
        tags: ['storage', 'ssd', 'portable'],
        specifications: [
          { key: 'Capacity', value: '1TB' },
          { key: 'Read Speed', value: 'Up to 1050MB/s' },
          { key: 'Interface', value: 'USB 3.2 Gen 2' },
        ],
        createdBy: admin._id.toString(),
      },
      {
        name: 'Webcam 1080p HD',
        description: 'Professional webcam with auto-focus and noise reduction',
        category: 'Electronics',
        price: 79.99,
        stock: 40,
        images: ['https://images.unsplash.com/photo-1588508065123-287b28e013da?w=500'],
        sku: 'ELEC-004',
        status: 'active',
        tags: ['webcam', 'video', 'streaming'],
        specifications: [
          { key: 'Resolution', value: '1080p @ 30fps' },
          { key: 'Field of View', value: '90°' },
          { key: 'Microphone', value: 'Dual stereo' },
        ],
        createdBy: admin._id.toString(),
      },
      {
        name: 'Phone Stand Adjustable',
        description: 'Universal phone holder for desk with 360° rotation',
        category: 'Accessories',
        price: 19.99,
        stock: 5,
        images: ['https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=500'],
        sku: 'ACC-004',
        status: 'active',
        tags: ['phone', 'stand', 'desk'],
        specifications: [
          { key: 'Compatibility', value: 'All smartphones 4-7"' },
          { key: 'Material', value: 'Aluminum + Silicone' },
          { key: 'Rotation', value: '360°' },
        ],
        createdBy: admin._id.toString(),
      },
      {
        name: 'LED Desk Lamp',
        description: 'Smart desk lamp with touch control and USB charging port',
        category: 'Accessories',
        price: 44.99,
        stock: 35,
        images: ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500'],
        sku: 'ACC-005',
        status: 'active',
        tags: ['lighting', 'desk', 'led'],
        specifications: [
          { key: 'Brightness Levels', value: '5' },
          { key: 'Color Temperature', value: '3000K-6000K' },
          { key: 'USB Port', value: '5V/1A' },
        ],
        createdBy: admin._id.toString(),
      },
    ];

    const products = await Product.insertMany(sampleProducts);
    console.log(`✅ Created ${products.length} sample products`);

    // Create sample sales data
    const salesData = [];
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    for (let i = 0; i < 50; i++) {
      const randomProduct = products[Math.floor(Math.random() * products.length)];
      const randomDate = new Date(
        thirtyDaysAgo.getTime() + Math.random() * (Date.now() - thirtyDaysAgo.getTime())
      );
      const quantity = Math.floor(Math.random() * 5) + 1;

      salesData.push({
        productId: randomProduct._id.toString(),
        quantity,
        totalAmount: randomProduct.price * quantity,
        date: randomDate,
      });
    }

    await Sale.insertMany(salesData);
    console.log(`✅ Created ${salesData.length} sample sales records`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📝 Login credentials:');
    console.log('   Email: admin@citadel.com');
    console.log('   Password: admin123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seed();

