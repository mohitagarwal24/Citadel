import { z } from 'zod';

export const productSchema = z.object({
  name: z
    .string({ required_error: 'Product name is required' })
    .min(3, 'Product name must be at least 3 characters')
    .max(200, 'Product name cannot exceed 200 characters')
    .trim(),
  description: z
    .string({ required_error: 'Description is required' })
    .min(10, 'Description must be at least 10 characters')
    .max(2000, 'Description cannot exceed 2000 characters')
    .trim(),
  category: z
    .string({ required_error: 'Category is required' })
    .min(1, 'Please select or enter a category')
    .trim(),
  price: z
    .number({ required_error: 'Price is required', invalid_type_error: 'Price must be a number' })
    .min(0, 'Price cannot be negative')
    .or(z.string().transform((val) => parseFloat(val))),
  stock: z
    .number({ required_error: 'Stock quantity is required', invalid_type_error: 'Stock must be a number' })
    .int('Stock must be a whole number')
    .min(0, 'Stock cannot be negative')
    .or(z.string().transform((val) => parseInt(val))),
  images: z
    .array(z.string().url('Each image must be a valid URL'))
    .min(1, 'At least one product image is required. Please upload an image.')
    .max(10, 'Maximum 10 images allowed'),
  sku: z
    .string({ required_error: 'SKU is required' })
    .min(3, 'SKU must be at least 3 characters')
    .max(50, 'SKU cannot exceed 50 characters')
    .regex(/^[A-Z0-9-]+$/, 'SKU must contain only uppercase letters, numbers, and hyphens (e.g., PROD-001)')
    .trim(),
  status: z.enum(['active', 'inactive', 'out_of_stock'], {
    required_error: 'Status is required',
    invalid_type_error: 'Status must be one of: active, inactive, or out_of_stock',
  }),
  tags: z.array(z.string()).default([]),
  specifications: z
    .array(
      z.object({
        key: z.string().min(1, 'Specification key cannot be empty'),
        value: z.string().min(1, 'Specification value cannot be empty'),
      })
    )
    .default([]),
});

export const productUpdateSchema = productSchema.partial();

export type ProductFormValues = z.infer<typeof productSchema>;

