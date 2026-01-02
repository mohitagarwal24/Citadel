import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/db/mongodb';
import Product from '@/models/Product';
import { productUpdateSchema } from '@/lib/validations/product';

// GET single product by ID
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();

    const product = await Product.findById(params.id);

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (error) {
    console.error('Get product error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// UPDATE product by ID (Admin only)
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth();

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 403 });
    }

    const body = await req.json();

    // Validate input
    const validation = productUpdateSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.errors },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if product exists
    const existingProduct = await Product.findById(params.id);
    if (!existingProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // If SKU is being updated, check for duplicates
    if (validation.data.sku && validation.data.sku !== existingProduct.sku) {
      const duplicateSKU = await Product.findOne({ sku: validation.data.sku });
      if (duplicateSKU) {
        return NextResponse.json({ error: 'Product with this SKU already exists' }, { status: 400 });
      }
    }

    // Update product
    const product = await Product.findByIdAndUpdate(
      params.id,
      { $set: validation.data },
      { new: true, runValidators: true }
    );

    return NextResponse.json({ message: 'Product updated successfully', product });
  } catch (error) {
    console.error('Update product error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE product by ID (Admin only)
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth();

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 403 });
    }

    await connectDB();

    const product = await Product.findByIdAndDelete(params.id);

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

