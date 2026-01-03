# API Documentation

## Authentication

All protected endpoints require a valid session. The API uses NextAuth.js with JWT tokens.

### Public Endpoints
- `GET /api/products` - List products (public read)
- `POST /api/auth/register` - User registration
- `POST /api/auth/[...nextauth]` - NextAuth handlers

### Protected Endpoints (Admin Only)
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `POST /api/admin/create` - Create admin user
- `GET/PUT /api/users` - User management
- `GET/PUT /api/profile` - Profile management
- `POST/DELETE /api/upload` - Image upload
- `GET /api/dashboard` - Analytics data

## Rate Limiting

| Endpoint Type | Limit | Window |
|---------------|-------|--------|
| Default | 100 requests | 1 minute |
| Auth endpoints | 20 requests | 1 minute |
| Upload | 10 requests | 1 minute |

Rate limit headers included in responses:
- `X-RateLimit-Limit`: Maximum requests allowed
- `X-RateLimit-Remaining`: Requests remaining
- `X-RateLimit-Reset`: Unix timestamp for reset

## Endpoints

### Products

#### List Products
```
GET /api/products?page=1&limit=10&search=laptop&category=electronics
```

Response:
```json
{
  "products": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "pages": 5
  }
}
```

#### Get Product
```
GET /api/products/:id
```

#### Create Product (Admin)
```
POST /api/products
Content-Type: application/json

{
  "name": "Product Name",
  "description": "Description",
  "category": "electronics",
  "price": 99.99,
  "stock": 100,
  "sku": "PROD-001",
  "status": "active",
  "images": ["https://..."],
  "tags": ["tag1", "tag2"],
  "specifications": [{"key": "Color", "value": "Black"}]
}
```

#### Update Product (Admin)
```
PUT /api/products/:id
Content-Type: application/json

{ ...product fields... }
```

#### Delete Product (Admin)
```
DELETE /api/products/:id
```

### Users

#### List Users (Admin)
```
GET /api/users
```

Response:
```json
{
  "users": [
    {
      "_id": "...",
      "name": "User Name",
      "email": "user@example.com",
      "role": "admin",
      "createdAt": "..."
    }
  ]
}
```

#### Update User Role (Admin)
```
PUT /api/users
Content-Type: application/json

{
  "userId": "user-id",
  "role": "admin" | "user"
}
```

### Profile

#### Get Profile
```
GET /api/profile
```

#### Update Profile / Change Password
```
PUT /api/profile
Content-Type: application/json

{
  "name": "New Name",
  "currentPassword": "old-password",
  "newPassword": "new-password"
}
```

### Dashboard

#### Get Analytics (Admin)
```
GET /api/dashboard
```

Response:
```json
{
  "totalProducts": 50,
  "totalRevenue": 10000.00,
  "lowStockProducts": 5,
  "recentSales": 25,
  "salesData": [...],
  "categoryDistribution": [...],
  "topProducts": [...]
}
```

### Upload

#### Upload Image (Admin)
```
POST /api/upload
Content-Type: multipart/form-data

file: <image file>
```

Response:
```json
{
  "url": "https://res.cloudinary.com/...",
  "publicId": "citadel/..."
}
```

#### Delete Image (Admin)
```
DELETE /api/upload
Content-Type: application/json

{
  "publicId": "citadel/..."
}
```

## Error Responses

```json
{
  "error": "Error message here"
}
```

| Status | Meaning |
|--------|---------|
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Not authenticated |
| 403 | Forbidden - Not authorized |
| 404 | Not Found |
| 429 | Too Many Requests |
| 500 | Internal Server Error |
