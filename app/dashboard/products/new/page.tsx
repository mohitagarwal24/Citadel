'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateProduct } from '@/lib/hooks/useProducts';
import { productSchema } from '@/lib/validations/product';
import { Loader2, ArrowLeft, ArrowRight, Upload, X, Plus } from 'lucide-react';
import { z } from 'zod';

export default function NewProductPage() {
  const router = useRouter();
  const createProduct = useCreateProduct();
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    stock: '',
    images: [] as string[],
    sku: '',
    status: 'active' as 'active' | 'inactive' | 'out_of_stock',
    tags: [] as string[],
    specifications: [] as { key: string; value: string }[],
  });

  const [tagInput, setTagInput] = useState('');
  const [specKey, setSpecKey] = useState('');
  const [specValue, setSpecValue] = useState('');

  const validateStep = (stepNumber: number) => {
    const stepErrors: Record<string, string> = {};

    if (stepNumber === 1) {
      if (!formData.name) stepErrors.name = 'Product name is required';
      if (!formData.description) stepErrors.description = 'Description is required';
      if (!formData.category) stepErrors.category = 'Category is required';
    }

    if (stepNumber === 2) {
      if (!formData.price) stepErrors.price = 'Price is required';
      if (!formData.stock) stepErrors.stock = 'Stock is required';
      if (!formData.sku) stepErrors.sku = 'SKU is required';
    }

    if (stepNumber === 3) {
      if (formData.images.length === 0) stepErrors.images = 'At least one image is required';
    }

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
    setErrors({});
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, data.url],
      }));
    } catch (error) {
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const addTag = () => {
    if (tagInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput('');
    }
  };

  const removeTag = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));
  };

  const addSpecification = () => {
    if (specKey.trim() && specValue.trim()) {
      setFormData((prev) => ({
        ...prev,
        specifications: [...prev.specifications, { key: specKey.trim(), value: specValue.trim() }],
      }));
      setSpecKey('');
      setSpecValue('');
    }
  };

  const removeSpecification = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    try {
      const validatedData = productSchema.parse({
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
      });

      await createProduct.mutateAsync(validatedData);
      router.push('/dashboard/products');
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(fieldErrors);
      } else {
        alert('Failed to create product');
      }
    }
  };

  const steps = [
    { number: 1, title: 'Basic Info' },
    { number: 2, title: 'Pricing & Stock' },
    { number: 3, title: 'Images' },
    { number: 4, title: 'Additional Details' },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Add New Product</h1>
            <p className="text-slate-600 mt-1">Create a new product in your inventory</p>
          </div>
        </div>

        {/* Progress Steps */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              {steps.map((s, index) => (
                <div key={s.number} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`
                        w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all
                        ${
                          step >= s.number
                            ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white'
                            : 'bg-slate-200 text-slate-600'
                        }
                      `}
                    >
                      {s.number}
                    </div>
                    <p className="text-sm mt-2 font-medium">{s.title}</p>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`
                        h-1 flex-1 mx-2 transition-all
                        ${step > s.number ? 'bg-indigo-600' : 'bg-slate-200'}
                      `}
                    />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Form Steps */}
        <Card>
          <CardHeader>
            <CardTitle>Step {step} of 4</CardTitle>
          </CardHeader>
          <CardContent>
            <AnimatePresence mode="wait">
              {/* Step 1: Basic Info */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter product name"
                    />
                    {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Enter product description"
                      rows={4}
                    />
                    {errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Input
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      placeholder="e.g., Electronics, Clothing, Books"
                    />
                    {errors.category && <p className="text-sm text-red-600">{errors.category}</p>}
                  </div>
                </motion.div>
              )}

              {/* Step 2: Pricing & Stock */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">Price ($) *</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        placeholder="0.00"
                      />
                      {errors.price && <p className="text-sm text-red-600">{errors.price}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="stock">Stock Quantity *</Label>
                      <Input
                        id="stock"
                        type="number"
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                        placeholder="0"
                      />
                      {errors.stock && <p className="text-sm text-red-600">{errors.stock}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sku">SKU (Stock Keeping Unit) *</Label>
                    <Input
                      id="sku"
                      value={formData.sku}
                      onChange={(e) => setFormData({ ...formData, sku: e.target.value.toUpperCase() })}
                      placeholder="e.g., PROD-001"
                    />
                    {errors.sku && <p className="text-sm text-red-600">{errors.sku}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value: any) => setFormData({ ...formData, status: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Images */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label>Product Images *</Label>
                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                        disabled={uploading}
                      />
                      <label htmlFor="image-upload" className="cursor-pointer">
                        {uploading ? (
                          <Loader2 className="h-12 w-12 mx-auto text-indigo-600 animate-spin" />
                        ) : (
                          <Upload className="h-12 w-12 mx-auto text-slate-400" />
                        )}
                        <p className="mt-2 text-sm text-slate-600">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-slate-500">PNG, JPG, GIF up to 10MB</p>
                      </label>
                    </div>
                    {errors.images && <p className="text-sm text-red-600">{errors.images}</p>}
                  </div>

                  {formData.images.length > 0 && (
                    <div className="grid grid-cols-3 gap-4">
                      {formData.images.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={image}
                            alt={`Product ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <button
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* Step 4: Additional Details */}
              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  {/* Tags */}
                  <div className="space-y-2">
                    <Label>Tags</Label>
                    <div className="flex space-x-2">
                      <Input
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        placeholder="Add a tag"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      />
                      <Button type="button" onClick={addTag}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    {formData.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formData.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm flex items-center space-x-2"
                          >
                            <span>{tag}</span>
                            <button onClick={() => removeTag(index)}>
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Specifications */}
                  <div className="space-y-2">
                    <Label>Specifications</Label>
                    <div className="flex space-x-2">
                      <Input
                        value={specKey}
                        onChange={(e) => setSpecKey(e.target.value)}
                        placeholder="Key (e.g., Weight)"
                      />
                      <Input
                        value={specValue}
                        onChange={(e) => setSpecValue(e.target.value)}
                        placeholder="Value (e.g., 500g)"
                      />
                      <Button type="button" onClick={addSpecification}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    {formData.specifications.length > 0 && (
                      <div className="space-y-2 mt-2">
                        {formData.specifications.map((spec, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between bg-slate-50 p-3 rounded-lg"
                          >
                            <div>
                              <span className="font-medium">{spec.key}:</span> {spec.value}
                            </div>
                            <button
                              onClick={() => removeSpecification(index)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={step === 1}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>

              {step < 4 ? (
                <Button onClick={handleNext}>
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={createProduct.isPending}
                  className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700"
                >
                  {createProduct.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Product'
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

