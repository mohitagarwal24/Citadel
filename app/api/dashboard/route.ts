import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/db/mongodb';
import Product from '@/models/Product';
import Sale from '@/models/Sale';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 403 });
    }

    await connectDB();

    // Get total products
    const totalProducts = await Product.countDocuments();

    // Get low stock products (stock < 10)
    const lowStockProducts = await Product.countDocuments({ stock: { $lt: 10 } });

    // Get sales data for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const sales = await Sale.find({ date: { $gte: thirtyDaysAgo } }).lean();

    // Calculate total revenue
    const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);

    // Calculate recent sales (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentSales = await Sale.countDocuments({ date: { $gte: sevenDaysAgo } });

    // Group sales by date
    const salesByDate = sales.reduce((acc: any, sale) => {
      const date = new Date(sale.date).toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = { sales: 0, revenue: 0 };
      }
      acc[date].sales += sale.quantity;
      acc[date].revenue += sale.totalAmount;
      return acc;
    }, {});

    const salesData = Object.entries(salesByDate).map(([date, data]: [string, any]) => ({
      date,
      sales: data.sales,
      revenue: data.revenue,
    }));

    // Get category distribution
    const categoryDistribution = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $project: { category: '$_id', count: 1, _id: 0 } },
      { $sort: { count: -1 } },
    ]);

    // Get top products by sales
    const topProducts = await Sale.aggregate([
      { $match: { date: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: '$productId',
          sales: { $sum: '$quantity' },
          revenue: { $sum: '$totalAmount' },
        },
      },
      { $sort: { revenue: -1 } },
      { $limit: 5 },
    ]);

    // Populate product names
    const topProductsWithNames = await Promise.all(
      topProducts.map(async (item) => {
        const product = await Product.findById(item._id).select('name');
        return {
          name: product?.name || 'Unknown Product',
          sales: item.sales,
          revenue: item.revenue,
        };
      })
    );

    return NextResponse.json({
      totalProducts,
      totalRevenue,
      lowStockProducts,
      recentSales,
      salesData,
      categoryDistribution,
      topProducts: topProductsWithNames,
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

