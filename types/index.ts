import { Document } from 'mongoose';

// User/Admin Types
export interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  createdAt: Date;
  updatedAt: Date;
}

// Product Types
export interface IProduct extends Document {
  _id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  images: string[];
  sku: string;
  status: 'active' | 'inactive' | 'out_of_stock';
  tags: string[];
  specifications: {
    key: string;
    value: string;
  }[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

// Sales/Analytics Types
export interface ISale extends Document {
  _id: string;
  productId: string;
  quantity: number;
  totalAmount: number;
  date: Date;
  createdAt: Date;
}

// Form Types
export interface ProductFormData {
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  images: string[];
  sku: string;
  status: 'active' | 'inactive' | 'out_of_stock';
  tags: string[];
  specifications: {
    key: string;
    value: string;
  }[];
}

// Dashboard Stats
export interface DashboardStats {
  totalProducts: number;
  totalRevenue: number;
  lowStockProducts: number;
  recentSales: number;
  salesData: {
    date: string;
    sales: number;
    revenue: number;
  }[];
  categoryDistribution: {
    category: string;
    count: number;
  }[];
  topProducts: {
    name: string;
    sales: number;
    revenue: number;
  }[];
}

