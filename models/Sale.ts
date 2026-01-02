import mongoose, { Schema, Model } from 'mongoose';
import { ISale } from '@/types';

const SaleSchema = new Schema<ISale>(
  {
    productId: {
      type: String,
      required: [true, 'Product ID is required'],
      ref: 'Product',
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1'],
    },
    totalAmount: {
      type: Number,
      required: [true, 'Total amount is required'],
      min: [0, 'Total amount cannot be negative'],
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for analytics queries
SaleSchema.index({ date: -1 });
SaleSchema.index({ productId: 1 });

// Prevent model recompilation in development
const Sale: Model<ISale> = mongoose.models?.Sale || mongoose.model<ISale>('Sale', SaleSchema);

export default Sale;

