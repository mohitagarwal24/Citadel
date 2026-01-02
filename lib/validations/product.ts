import { z } from 'zod';

export const productSchema = z.object({
  name: z
    .string()
    .min(3, 'Product name must be at least 3 characters')
    .max(200, 'Product name cannot exceed 200 characters'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(2000, 'Description cannot exceed 2000 characters'),
  category: z.string().min(1, 'Category is required'),
  price: z
    .number()
    .min(0, 'Price cannot be negative')
    .or(z.string().transform((val) => parseFloat(val))),
  stock: z
    .number()
    .int('Stock must be a whole number')
    .min(0, 'Stock cannot be negative')
    .or(z.string().transform((val) => parseInt(val))),
  images: z.array(z.string().url('Invalid image URL')).min(1, 'At least one image is required'),
  sku: z
    .string()
    .min(3, 'SKU must be at least 3 characters')
    .regex(/^[A-Z0-9-]+$/, 'SKU must contain only uppercase letters, numbers, and hyphens'),
  status: z.enum(['active', 'inactive', 'out_of_stock']),
  tags: z.array(z.string()).default([]),
  specifications: z
    .array(
      z.object({
        key: z.string().min(1, 'Specification key is required'),
        value: z.string().min(1, 'Specification value is required'),
      })
    )
    .default([]),
});

export const productUpdateSchema = productSchema.partial();

export type ProductFormValues = z.infer<typeof productSchema>;

