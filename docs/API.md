# 📡 FolioFind API Documentation

**Base URL:** `http://localhost:5000` (development) or `https://your-api.vercel.app` (production)

**API Version:** v1.0  
**Authentication:** JWT Bearer Token  
**Content-Type:** application/json

---

## Table of Contents

1. [Authentication](#authentication)
2. [Error Responses](#error-responses)
3. [Authorization Endpoints](#authorization-endpoints)
4. [Books Endpoints](#books-endpoints)
5. [Rate Limiting](#rate-limiting)
6. [Examples](#examples)

---

## Authentication

All protected endpoints require a JWT token in the `Authorization` header:

```
Authorization: Bearer <your-jwt-token>
```

### JWT Token Structure

```json
{
  "sub": "user-id-string",
  "email": "user@example.com",
  "role": "user|admin",
  "iat": 1234567890,
  "exp": 1234654290
}
```

**Token Expiry:** 7 days (configurable via `JWT_EXPIRES_IN`)

---

## Error Responses

### Standard Error Format

```json
{
  "statusCode": 400,
  "error": "BAD_REQUEST",
  "message": "Invalid email format"
}
```

### Common Error Codes

| Status Code | Error | Description |
|------------|-------|-------------|
| 400 | `BAD_REQUEST` | Invalid input or malformed request |
| 401 | `UNAUTHORIZED` | Missing or invalid JWT token |
| 403 | `FORBIDDEN` | User lacks required permissions (admin-only) |
| 404 | `NOT_FOUND` | Resource not found |
| 409 | `CONFLICT` | Email already in use |
| 500 | `INTERNAL_ERROR` | Server error |

---

## Authorization Endpoints

### Register User

Creates a new regular user account.

```
POST /api/auth/register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Validation Rules:**
- Email must be valid and unique
- Password must be at least 6 characters
- Password and email are required

**Success Response (201):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "role": "user"
  }
}
```

**Error Response (400):**
```json
{
  "statusCode": 400,
  "error": "VALIDATION_ERROR",
  "message": "Invalid email format"
}
```

**Error Response (409):**
```json
{
  "statusCode": 409,
  "error": "CONFLICT",
  "message": "Email already in use"
}
```

---

### Login User

Authenticates a user and returns a JWT token.

```
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Success Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "role": "user"
  }
}
```

**Error Response (401):**
```json
{
  "statusCode": 401,
  "error": "UNAUTHORIZED",
  "message": "Invalid email or password"
}
```

---

### Get Current User

Returns the authenticated user's profile information.

```
GET /api/auth/me
```

**Required Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Success Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "email": "user@example.com",
  "role": "user",
  "createdAt": "2026-05-09T10:30:00.000Z"
}
```

**Error Response (401):**
```json
{
  "statusCode": 401,
  "error": "UNAUTHORIZED",
  "message": "Invalid or expired token"
}
```

---

## Books Endpoints

### Get All Books

Retrieves a paginated list of all books. Public endpoint (no authentication required).

```
GET /api/books?category=fiction&page=1&limit=10
```

**Query Parameters (Optional):**
- `category` (string): Filter by book category
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `sort` (string): Sort field (default: createdAt)
- `order` (string): Sort order - `asc` or `desc` (default: desc)

**Success Response (200):**
```json
{
  "books": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "The Great Gatsby",
      "author": "F. Scott Fitzgerald",
      "category": "fiction",
      "description": "A classic American novel...",
      "price": 12.99,
      "image": "https://example.com/image.jpg",
      "createdAt": "2026-05-09T10:30:00.000Z"
    }
  ],
  "total": 42,
  "page": 1,
  "pages": 5
}
```

---

### Get Book by ID

Retrieves detailed information about a specific book. Public endpoint.

```
GET /api/books/:id
```

**Path Parameters:**
- `id` (string): MongoDB ObjectId of the book

**Success Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "title": "The Great Gatsby",
  "author": "F. Scott Fitzgerald",
  "category": "fiction",
  "description": "A classic American novel set in the Jazz Age...",
  "price": 12.99,
  "image": "https://example.com/image.jpg",
  "createdAt": "2026-05-09T10:30:00.000Z"
}
```

**Error Response (404):**
```json
{
  "statusCode": 404,
  "error": "NOT_FOUND",
  "message": "Book not found"
}
```

---

### Create Book

Creates a new book. **Admin-only endpoint.**

```
POST /api/books
```

**Required Headers:**
```
Authorization: Bearer <admin-jwt-token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "The Great Gatsby",
  "author": "F. Scott Fitzgerald",
  "category": "fiction",
  "description": "A classic American novel set in the Jazz Age...",
  "price": 12.99,
  "image": "https://example.com/image.jpg"
}
```

**Validation Rules:**
- All fields are required
- Title and author must be non-empty strings
- Price must be a positive number
- Image must be a valid URL

**Success Response (201):**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "title": "The Great Gatsby",
  "author": "F. Scott Fitzgerald",
  "category": "fiction",
  "description": "A classic American novel set in the Jazz Age...",
  "price": 12.99,
  "image": "https://example.com/image.jpg",
  "createdAt": "2026-05-09T10:35:00.000Z"
}
```

**Error Response (401):**
```json
{
  "statusCode": 401,
  "error": "UNAUTHORIZED",
  "message": "Authentication required"
}
```

**Error Response (403):**
```json
{
  "statusCode": 403,
  "error": "FORBIDDEN",
  "message": "Admin access required"
}
```

---

### Update Book

Updates an existing book. **Admin-only endpoint.**

```
PATCH /api/books/:id
```

**Required Headers:**
```
Authorization: Bearer <admin-jwt-token>
Content-Type: application/json
```

**Path Parameters:**
- `id` (string): MongoDB ObjectId of the book

**Request Body (any fields to update):**
```json
{
  "title": "The Great Gatsby (Revised Edition)",
  "price": 14.99
}
```

**Success Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "title": "The Great Gatsby (Revised Edition)",
  "author": "F. Scott Fitzgerald",
  "category": "fiction",
  "description": "A classic American novel set in the Jazz Age...",
  "price": 14.99,
  "image": "https://example.com/image.jpg",
  "createdAt": "2026-05-09T10:30:00.000Z",
  "updatedAt": "2026-05-09T10:40:00.000Z"
}
```

**Error Response (404):**
```json
{
  "statusCode": 404,
  "error": "NOT_FOUND",
  "message": "Book not found"
}
```

---

### Delete Book

Deletes a book. **Admin-only endpoint.**

```
DELETE /api/books/:id
```

**Required Headers:**
```
Authorization: Bearer <admin-jwt-token>
```

**Path Parameters:**
- `id` (string): MongoDB ObjectId of the book

**Success Response (200):**
```json
{
  "message": "Book deleted successfully",
  "id": "507f1f77bcf86cd799439011"
}
```

**Error Response (404):**
```json
{
  "statusCode": 404,
  "error": "NOT_FOUND",
  "message": "Book not found"
}
```

---

## Rate Limiting

The API implements rate limiting on authentication endpoints:

- **Auth Endpoints**: 50 requests per 15 minutes
- **Other Endpoints**: No limit (subject to change)

**Rate Limit Headers:**
```
X-RateLimit-Limit: 50
X-RateLimit-Remaining: 49
X-RateLimit-Reset: 1620000000
```

**Error Response (429):**
```json
{
  "statusCode": 429,
  "error": "TOO_MANY_REQUESTS",
  "message": "Too many requests, please try again later"
}
```

---

## Examples

### Example: Complete User Flow

#### 1. Register a New User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePassword123!"
  }'
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "role": "user"
  }
}
```

#### 2. Browse Books

```bash
curl http://localhost:5000/api/books?category=fiction&limit=5
```

Response: (List of books)

#### 3. Get Specific Book

```bash
curl http://localhost:5000/api/books/507f1f77bcf86cd799439011
```

#### 4. Admin: Create New Book

```bash
curl -X POST http://localhost:5000/api/books \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "title": "New Book Title",
    "author": "Author Name",
    "category": "fiction",
    "description": "Book description here",
    "price": 19.99,
    "image": "https://example.com/book.jpg"
  }'
```

#### 5. Admin: Update Book

```bash
curl -X PATCH http://localhost:5000/api/books/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "price": 24.99
  }'
```

#### 6. Admin: Delete Book

```bash
curl -X DELETE http://localhost:5000/api/books/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## Status Codes Reference

| Code | Meaning | Use Case |
|------|---------|----------|
| 200 | OK | Successful GET, PATCH, DELETE |
| 201 | Created | Successful POST (resource created) |
| 400 | Bad Request | Invalid input validation failed |
| 401 | Unauthorized | Missing/invalid JWT token |
| 403 | Forbidden | Authenticated but lacking permissions |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Email already registered |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server-side error |

---

## Best Practices

1. **Store JWT Safely**: Store tokens in secure HTTP-only cookies or secure localStorage
2. **Handle Token Expiry**: Implement refresh token logic when token expires
3. **Validate Input**: Always validate input on client before sending to API
4. **Use HTTPS**: Always use HTTPS in production
5. **Secure Passwords**: Never send passwords in plain text (always over HTTPS)
6. **Error Handling**: Implement proper error handling in your client
7. **Rate Limiting**: Respect rate limits; implement exponential backoff for retries

---

**Last Updated:** May 9, 2026  
**API Version:** v1.0  
**Status:** Production Ready ✅
