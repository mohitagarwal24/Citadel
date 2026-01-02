import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/db/mongodb';
import Product from '@/models/Product';
import { productSchema } from '@/lib/validations/product';

// GET all products with filtering, sorting, and pagination
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const order = searchParams.get('order') === 'asc' ? 1 : -1;

    // Build query
    const query: any = {};
    if (category) query.category = category;
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
      ];
    }

    // Execute query with pagination
    const skip = (page - 1) * limit;
    const products = await Product.find(query)
      .sort({ [sortBy]: order })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Product.countDocuments(query);

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get products error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// CREATE new product (Admin only)
export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 403 });
    }

    const body = await req.json();

    // Log the incoming request body for debugging
    console.log('📦 Creating product with data:', {
      name: body.name,
      category: body.category,
      price: body.price,
      stock: body.stock,
      sku: body.sku,
      imagesCount: body.images?.length || 0,
      status: body.status,
    });

    // Validate input
    const validation = productSchema.safeParse(body);
    if (!validation.success) {
      console.error('❌ Product validation failed:', JSON.stringify(validation.error.errors, null, 2));

      // Format validation errors for better user feedback
      const formattedErrors = validation.error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message,
        code: err.code,
      }));

      return NextResponse.json(
        {
          error: 'Validation failed',
          message: 'Please check the following fields and try again',
          details: formattedErrors,
          rawErrors: validation.error.errors
        },
        { status: 400 }
      );
    }

    console.log('✅ Validation passed successfully');

    await connectDB();

    // Check if SKU already exists
    const existingProduct = await Product.findOne({ sku: validation.data.sku });
    if (existingProduct) {
      console.error('❌ Duplicate SKU:', validation.data.sku);
      return NextResponse.json({
        error: 'Duplicate SKU',
        message: `A product with SKU "${validation.data.sku}" already exists. Please use a different SKU.`,
        field: 'sku'
      }, { status: 400 });
    }

    // Create product
    const product = await Product.create({
      ...validation.data,
      createdBy: session.user.id,
    });

    console.log('✅ Product created successfully:', product._id);

    return NextResponse.json(
      { message: 'Product created successfully', product },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('❌ Create product error:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });

    // Handle MongoDB validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((err: any) => ({
        field: err.path,
        message: err.message,
      }));

      return NextResponse.json({
        error: 'Database validation failed',
        message: 'The product data failed database validation',
        details: validationErrors
      }, { status: 400 });
    }

    return NextResponse.json({
      error: 'Internal server error',
      message: 'An unexpected error occurred while creating the product. Please try again.'
    }, { status: 500 });
  }
}

