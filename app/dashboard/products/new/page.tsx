'use client';

import { useState, useEffect } from 'react';
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
import { Loader2, ArrowLeft, ArrowRight, Upload, X, Plus, CheckCircle2, AlertCircle } from 'lucide-react';
import { z } from 'zod';

// Field wrapper component - defined outside to prevent recreation on every render
const FieldWrapper = ({
  fieldName,
  label,
  required = false,
  children,
  errors,
  touched,
}: {
  fieldName: string;
  label: string;
  required?: boolean;
  children: React.ReactNode;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
}) => {
  const hasError = !!errors[fieldName];
  const isValid = touched[fieldName] && !hasError;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={fieldName}>
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
        {isValid && <CheckCircle2 className="h-4 w-4 text-green-600" />}
        {hasError && <AlertCircle className="h-4 w-4 text-red-600" />}
      </div>
      {children}
      {hasError && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          {errors[fieldName]}
        </p>
      )}
    </div>
  );
};

export default function NewProductPage() {
  const router = useRouter();
  const createProduct = useCreateProduct();
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [uploading, setUploading] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

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

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input/textarea
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
        return;
      }

      // Enter key - go to next step
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        if (step < 4 && getCurrentStepErrors() === 0) {
          handleNext();
        } else if (step === 4 && getCurrentStepErrors() === 0 && !createProduct.isPending) {
          handleSubmit();
        }
      }

      // Shift + Enter - go to previous step
      if (e.key === 'Enter' && e.shiftKey) {
        e.preventDefault();
        if (step > 1) {
          handleBack();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, createProduct.isPending]);

  // Navigate to a specific step
  const navigateToStep = (targetStep: number) => {
    // Can always go back to a completed step
    if (targetStep < step || completedSteps.has(targetStep)) {
      setStep(targetStep);
    }
    // Can only go forward if current step is valid
    else if (targetStep === step + 1 && validateCurrentStep()) {
      setStep(targetStep);
      setCompletedSteps(prev => new Set(prev).add(step));
    }
  };

  // Validate a single field
  const validateField = (fieldName: string, value: any) => {
    try {
      // Create a partial schema for the specific field
      const fieldSchema = productSchema.pick({ [fieldName]: true } as any);

      // For price and stock, convert to number
      let valueToValidate = value;
      if (fieldName === 'price' && value !== '') {
        valueToValidate = parseFloat(value);
      } else if (fieldName === 'stock' && value !== '') {
        valueToValidate = parseInt(value);
      }

      fieldSchema.parse({ [fieldName]: valueToValidate });

      // Clear error for this field
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });

      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldError = error.errors[0];
        setErrors(prev => ({
          ...prev,
          [fieldName]: fieldError.message,
        }));
        return false;
      }
      return true;
    }
  };

  // Validate all fields in current step
  const validateCurrentStep = () => {
    const stepErrors: Record<string, string> = {};
    let fieldsToValidate: string[] = [];

    if (step === 1) {
      fieldsToValidate = ['name', 'description', 'category'];
    } else if (step === 2) {
      fieldsToValidate = ['price', 'stock', 'sku', 'status'];
    } else if (step === 3) {
      fieldsToValidate = ['images'];
    }

    // Validate each field
    fieldsToValidate.forEach(field => {
      try {
        const fieldSchema = productSchema.pick({ [field]: true } as any);
        let valueToValidate: any = formData[field as keyof typeof formData];

        if (field === 'price' && formData.price !== '') {
          valueToValidate = parseFloat(formData.price);
        } else if (field === 'stock' && formData.stock !== '') {
          valueToValidate = parseInt(formData.stock);
        }

        fieldSchema.parse({ [field]: valueToValidate });
      } catch (error) {
        if (error instanceof z.ZodError) {
          stepErrors[field] = error.errors[0].message;
        }
      }
    });

    setErrors(stepErrors);

    // Mark all fields as touched
    const newTouched = { ...touched };
    fieldsToValidate.forEach(field => {
      newTouched[field] = true;
    });
    setTouched(newTouched);

    return Object.keys(stepErrors).length === 0;
  };

  // Handle field blur
  const handleBlur = (fieldName: string) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
    validateField(fieldName, formData[fieldName as keyof typeof formData]);
  };

  // Handle field change with validation
  const handleFieldChange = (fieldName: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));

    // Only validate if field has been touched
    // DISABLED: This was causing typing lag - validation now only on blur
    // if (touched[fieldName]) {
    //   validateField(fieldName, value);
    // }
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setCompletedSteps(prev => new Set(prev).add(step));
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, imageUpload: 'Please select an image file' }));
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, imageUpload: 'File size must be less than 10MB' }));
      return;
    }

    setUploading(true);
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors.imageUpload;
      return newErrors;
    });

    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Upload failed');
      }

      const data = await response.json();
      const newImages = [...formData.images, data.url];
      setFormData(prev => ({ ...prev, images: newImages }));

      // Validate images field
      if (touched.images) {
        validateField('images', newImages);
      }

      // Clear the input
      e.target.value = '';
    } catch (error: any) {
      console.error('Upload error:', error);
      setErrors(prev => ({ ...prev, imageUpload: error.message || 'Failed to upload image' }));
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, imageUpload: 'Please drop an image file' }));
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, imageUpload: 'File size must be less than 10MB' }));
      return;
    }

    setUploading(true);
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors.imageUpload;
      return newErrors;
    });

    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Upload failed');
      }

      const data = await response.json();
      const newImages = [...formData.images, data.url];
      setFormData(prev => ({ ...prev, images: newImages }));

      // Validate images field
      if (touched.images) {
        validateField('images', newImages);
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      setErrors(prev => ({ ...prev, imageUpload: error.message || 'Failed to upload image' }));
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, images: newImages }));

    // Validate images field
    if (touched.images) {
      validateField('images', newImages);
    }
  };

  const addTag = () => {
    if (tagInput.trim()) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput('');
    }
  };

  const removeTag = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));
  };

  const addSpecification = () => {
    if (specKey.trim() && specValue.trim()) {
      setFormData(prev => ({
        ...prev,
        specifications: [...prev.specifications, { key: specKey.trim(), value: specValue.trim() }],
      }));
      setSpecKey('');
      setSpecValue('');
    }
  };

  const removeSpecification = (index: number) => {
    setFormData(prev => ({
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
    } catch (error: any) {

      if (error instanceof z.ZodError) {
        // Handle client-side validation errors
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(fieldErrors);
      } else if (error.message) {

        // If there's a field-specific error (like duplicate SKU)
        if (error.field) {
          setErrors(prev => ({ ...prev, [error.field]: error.message }));
          setTouched(prev => ({ ...prev, [error.field]: true }));
          // Navigate to the step containing the error field
          if (['sku', 'price', 'stock', 'status'].includes(error.field)) {
            setStep(2);
          } else if (['name', 'description', 'category'].includes(error.field)) {
            setStep(1);
          } else if (error.field === 'images') {
            setStep(3);
          }
          return;
        }

        // If there are field-specific errors from the API
        if (error.details && Array.isArray(error.details)) {
          const fieldErrors: Record<string, string> = {};
          error.details.forEach((detail: any) => {
            if (detail.field) {
              fieldErrors[detail.field] = detail.message;
            }
          });
          setErrors(fieldErrors);
        }

        // Show error in a non-intrusive way
        setErrors(prev => ({ ...prev, submit: error.message }));
      }
    }
  };

  // Count errors in current step
  const getCurrentStepErrors = () => {
    let fieldsToCheck: string[] = [];

    if (step === 1) fieldsToCheck = ['name', 'description', 'category'];
    else if (step === 2) fieldsToCheck = ['price', 'stock', 'sku'];
    else if (step === 3) fieldsToCheck = ['images'];

    return fieldsToCheck.filter(field => errors[field]).length;
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
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Add New Product</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">Create a new product in your inventory</p>
          </div>
        </div>

        {/* Progress Steps */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              {steps.map((s, index) => {
                const isCompleted = completedSteps.has(s.number) || step > s.number;
                const isCurrent = step === s.number;
                const isClickable = s.number < step || completedSteps.has(s.number) || s.number === step;

                return (
                  <div key={s.number} className="flex items-center flex-1">
                    <div className="flex flex-col items-center flex-1">
                      <button
                        onClick={() => navigateToStep(s.number)}
                        disabled={!isClickable}
                        className={`
                          w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all
                          ${isCurrent
                            ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white ring-4 ring-indigo-200 dark:ring-indigo-900'
                            : isCompleted
                              ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white'
                              : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                          }
                          ${isClickable && !isCurrent
                            ? 'cursor-pointer hover:scale-110 hover:shadow-lg'
                            : !isClickable
                              ? 'cursor-not-allowed opacity-50'
                              : ''
                          }
                        `}
                        title={
                          isClickable
                            ? `Go to ${s.title}`
                            : `Complete previous steps to unlock ${s.title}`
                        }
                      >
                        {isCompleted && !isCurrent ? (
                          <CheckCircle2 className="h-5 w-5" />
                        ) : (
                          s.number
                        )}
                      </button>
                      <p className={`text-sm mt-2 font-medium ${isCurrent ? 'text-indigo-600 dark:text-indigo-400' : 'dark:text-slate-300'}`}>
                        {s.title}
                      </p>
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`
                          h-1 flex-1 mx-2 transition-all
                          ${isCompleted ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'}
                        `}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Form Steps */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Step {step} of 4</span>
              {getCurrentStepErrors() > 0 && (
                <span className="text-sm font-normal text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {getCurrentStepErrors()} error{getCurrentStepErrors() > 1 ? 's' : ''} to fix
                </span>
              )}
            </CardTitle>
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
                    <div className="flex items-center justify-between">
                      <Label htmlFor="name">
                        Product Name <span className="text-red-500">*</span>
                      </Label>
                      {!errors.name && touched.name && (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      )}
                      {errors.name && (
                        <AlertCircle className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleFieldChange('name', e.target.value)}
                      onBlur={() => handleBlur('name')}
                      placeholder="Enter product name"
                      className={errors.name ? 'border-red-500' : touched.name && !errors.name ? 'border-green-500' : ''}
                    />
                    {errors.name && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <FieldWrapper fieldName="description" label="Description" required errors={errors} touched={touched}>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleFieldChange('description', e.target.value)}
                      onBlur={() => handleBlur('description')}
                      placeholder="Enter product description"
                      rows={4}
                      className={errors.description ? 'border-red-500' : touched.description && !errors.description ? 'border-green-500' : ''}
                    />
                  </FieldWrapper>

                  <FieldWrapper fieldName="category" label="Category" required errors={errors} touched={touched}>
                    <Input
                      id="category"
                      value={formData.category}
                      onChange={(e) => handleFieldChange('category', e.target.value)}
                      onBlur={() => handleBlur('category')}
                      placeholder="e.g., Electronics, Clothing, Books"
                      className={errors.category ? 'border-red-500' : touched.category && !errors.category ? 'border-green-500' : ''}
                    />
                  </FieldWrapper>
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
                    <FieldWrapper fieldName="price" label="Price ($)" required errors={errors} touched={touched}>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => handleFieldChange('price', e.target.value)}
                        onBlur={() => handleBlur('price')}
                        placeholder="0.00"
                        className={errors.price ? 'border-red-500' : touched.price && !errors.price ? 'border-green-500' : ''}
                      />
                    </FieldWrapper>

                    <FieldWrapper fieldName="stock" label="Stock Quantity" required errors={errors} touched={touched}>
                      <Input
                        id="stock"
                        type="number"
                        value={formData.stock}
                        onChange={(e) => handleFieldChange('stock', e.target.value)}
                        onBlur={() => handleBlur('stock')}
                        placeholder="0"
                        className={errors.stock ? 'border-red-500' : touched.stock && !errors.stock ? 'border-green-500' : ''}
                      />
                    </FieldWrapper>
                  </div>

                  <FieldWrapper fieldName="sku" label="SKU (Stock Keeping Unit)" required errors={errors} touched={touched}>
                    <Input
                      id="sku"
                      value={formData.sku}
                      onChange={(e) => handleFieldChange('sku', e.target.value.toUpperCase())}
                      onBlur={() => handleBlur('sku')}
                      placeholder="e.g., PROD-001"
                      className={errors.sku ? 'border-red-500' : touched.sku && !errors.sku ? 'border-green-500' : ''}
                    />
                  </FieldWrapper>

                  <FieldWrapper fieldName="status" label="Status" required errors={errors} touched={touched}>
                    <Select
                      value={formData.status}
                      onValueChange={(value: any) => {
                        handleFieldChange('status', value);
                        handleBlur('status');
                      }}
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
                  </FieldWrapper>
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
                  <FieldWrapper fieldName="images" label="Product Images" required errors={errors} touched={touched}>
                    <div
                      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${errors.images
                        ? 'border-red-500 hover:border-red-600'
                        : formData.images.length > 0
                          ? 'border-green-500 hover:border-green-600'
                          : 'border-slate-300 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-600'
                        }`}
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                    >
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                        disabled={uploading}
                      />
                      <label htmlFor="image-upload" className="cursor-pointer block">
                        {uploading ? (
                          <Loader2 className="h-12 w-12 mx-auto text-indigo-600 animate-spin" />
                        ) : (
                          <Upload className="h-12 w-12 mx-auto text-slate-400 dark:text-slate-500" />
                        )}
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-500">PNG, JPG, GIF up to 10MB</p>
                      </label>
                    </div>
                  </FieldWrapper>

                  {errors.imageUpload && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.imageUpload}
                    </p>
                  )}

                  {formData.images.length > 0 && (
                    <div className="grid grid-cols-3 gap-4">
                      {formData.images.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={image}
                            alt={`Product ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg border border-slate-200 dark:border-slate-700"
                            onError={(e) => {
                              e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle"%3EError%3C/text%3E%3C/svg%3E';
                            }}
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              removeImage(index);
                            }}
                            className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
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
                            className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 px-3 py-1 rounded-full text-sm flex items-center space-x-2"
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
                            className="flex items-center justify-between bg-slate-50 dark:bg-slate-800 p-3 rounded-lg"
                          >
                            <div className="dark:text-slate-300">
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

                  {errors.submit && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                      <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        {errors.submit}
                      </p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t dark:border-slate-700">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={step === 1}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>

              {step < 4 ? (
                <Button
                  onClick={handleNext}
                  disabled={getCurrentStepErrors() > 0}
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={createProduct.isPending || getCurrentStepErrors() > 0}
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
