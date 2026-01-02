# API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication

All protected endpoints require authentication via NextAuth.js session.

### Login
```http
POST /api/auth/callback/credentials
Content-Type: application/json

{
  "email": "admin@citadel.com",
  "password": "admin123"
}
```

### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

## Products

### Get All Products
```http
GET /api/products?page=1&limit=10&category=Electronics&status=active&search=laptop
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `category` (optional): Filter by category
- `status` (optional): Filter by status (active, inactive, out_of_stock)
- `search` (optional): Search in name, description, SKU

**Response:**
```json
{
  "products": [
    {
      "_id": "...",
      "name": "Wireless Headphones",
      "description": "Premium headphones...",
      "category": "Electronics",
      "price": 149.99,
      "stock": 50,
      "images": ["https://..."],
      "sku": "ELEC-001",
      "status": "active",
      "tags": ["audio", "wireless"],
      "specifications": [
        { "key": "Battery Life", "value": "30 hours" }
      ],
      "createdBy": "...",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

### Get Single Product
```http
GET /api/products/:id
```

**Response:**
```json
{
  "product": {
    "_id": "...",
    "name": "Wireless Headphones",
    ...
  }
}
```

### Create Product (Admin Only)
```http
POST /api/products
Content-Type: application/json
Authorization: Required (Session)

{
  "name": "New Product",
  "description": "Product description",
  "category": "Electronics",
  "price": 99.99,
  "stock": 100,
  "images": ["https://..."],
  "sku": "PROD-001",
  "status": "active",
  "tags": ["tag1", "tag2"],
  "specifications": [
    { "key": "Weight", "value": "500g" }
  ]
}
```

**Response:**
```json
{
  "message": "Product created successfully",
  "product": { ... }
}
```

### Update Product (Admin Only)
```http
PUT /api/products/:id
Content-Type: application/json
Authorization: Required (Session)

{
  "name": "Updated Product Name",
  "price": 109.99,
  "stock": 90
}
```

**Response:**
```json
{
  "message": "Product updated successfully",
  "product": { ... }
}
```

### Delete Product (Admin Only)
```http
DELETE /api/products/:id
Authorization: Required (Session)
```

**Response:**
```json
{
  "message": "Product deleted successfully"
}
```

## Image Upload

### Upload Image (Admin Only)
```http
POST /api/upload
Content-Type: multipart/form-data
Authorization: Required (Session)

file: <binary>
```

**Response:**
```json
{
  "url": "https://res.cloudinary.com/...",
  "publicId": "citadel-products/..."
}
```

### Delete Image (Admin Only)
```http
DELETE /api/upload
Content-Type: application/json
Authorization: Required (Session)

{
  "publicId": "citadel-products/..."
}
```

**Response:**
```json
{
  "message": "Image deleted successfully"
}
```

## Dashboard Analytics

### Get Dashboard Stats (Admin Only)
```http
GET /api/dashboard
Authorization: Required (Session)
```

**Response:**
```json
{
  "totalProducts": 100,
  "totalRevenue": 15000.50,
  "lowStockProducts": 5,
  "recentSales": 25,
  "salesData": [
    {
      "date": "2024-01-01",
      "sales": 10,
      "revenue": 500.00
    }
  ],
  "categoryDistribution": [
    {
      "category": "Electronics",
      "count": 50
    }
  ],
  "topProducts": [
    {
      "name": "Product Name",
      "sales": 100,
      "revenue": 5000.00
    }
  ]
}
```

## Admin Management

### Create Admin (Admin Only)
```http
POST /api/admin/create
Content-Type: application/json
Authorization: Required (Session)

{
  "name": "New Admin",
  "email": "newadmin@citadel.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "message": "Admin created successfully",
  "admin": {
    "id": "...",
    "name": "New Admin",
    "email": "newadmin@citadel.com",
    "role": "admin"
  }
}
```

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "price",
      "message": "Price must be a positive number"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "error": "Authentication required"
}
```

### 403 Forbidden
```json
{
  "error": "Unauthorized - Admin access required"
}
```

### 404 Not Found
```json
{
  "error": "Product not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

## Rate Limiting

Currently, no rate limiting is implemented. For production deployment, consider implementing rate limiting using:
- Vercel Edge Config
- Redis-based rate limiting
- API Gateway rate limiting

## Webhooks (Future Feature)

Planned webhook support for:
- Product created
- Product updated
- Product deleted
- Low stock alerts
- Order notifications

