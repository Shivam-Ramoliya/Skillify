# Skiilify API Routes Documentation

## Authentication Routes

| Method | Route                           | Description                | Auth Required | Request Body                                   |
| ------ | ------------------------------- | -------------------------- | ------------- | ---------------------------------------------- |
| POST   | `/api/auth/signup`              | Register a new user        | No            | `name`, `email`, `password`, `confirmPassword` |
| POST   | `/api/auth/login`               | Login user                 | No            | `email`, `password`                            |
| POST   | `/api/auth/verify-email`        | Verify email with token    | No            | `token`                                        |
| POST   | `/api/auth/resend-verification` | Resend verification email  | No            | `email`                                        |
| GET    | `/api/auth/me`                  | Get current logged-in user | Yes           | -                                              |

---

## Profile Routes

| Method | Route                     | Description                     | Auth Required | Query Params                     | Request Body                                                                                                        |
| ------ | ------------------------- | ------------------------------- | ------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| PUT    | `/api/profile/update`     | Update user profile             | Yes           | -                                | `bio`, `location`, `profilePicture`, `resume`, `availability`, `skillsOffered`, `skillsWanted`, `profileVisibility` |
| GET    | `/api/profile/me`         | Get current user's profile      | Yes           | -                                | -                                                                                                                   |
| GET    | `/api/profile/status`     | Check profile completion status | Yes           | -                                | -                                                                                                                   |
| GET    | `/api/profile/:userId`    | Get specific user's profile     | No            | -                                | -                                                                                                                   |
| PUT    | `/api/profile/visibility` | Update profile visibility       | Yes           | -                                | `profileVisibility`                                                                                                 |
| GET    | `/api/profile/discover`   | Discover public profiles        | No            | `role`, `skill`, `page`, `limit` | -                                                                                                                   |

---

## Health Check

| Method | Route         | Description         | Auth Required |
| ------ | ------------- | ------------------- | ------------- |
| GET    | `/api/health` | Server health check | No            |

---

## Detailed Route Information

### 1. Authentication Routes

#### POST `/api/auth/signup`

**Description:** Register a new user

**Request:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "User registered successfully. Please check your email to verify your account.",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "isVerified": false,
    "profileComplete": false
  }
}
```

---

#### POST `/api/auth/login`

**Description:** Login user (requires verified email)

**Request:**

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "profileComplete": false
  }
}
```

---

#### POST `/api/auth/verify-email`

**Description:** Verify user's email address using token from email

**Request:**

```json
{
  "token": "verification_token_from_email"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Email verified successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "profileComplete": false
  }
}
```

---

#### POST `/api/auth/resend-verification`

**Description:** Resend verification email

**Request:**

```json
{
  "email": "john@example.com"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Verification email sent successfully"
}
```

---

#### GET `/api/auth/me`

**Description:** Get current logged-in user's data

**Headers:**

```
Authorization: Bearer your_jwt_token
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "isVerified": true,
    "profileComplete": true,
    "bio": "...",
    "location": "...",
    "createdAt": "2026-01-28T10:30:00Z",
    "updatedAt": "2026-01-28T10:30:00Z"
  }
}
```

---

### 2. Profile Routes

#### PUT `/api/profile/update`

**Description:** Update user profile (calculates profile completion automatically)

**Headers:**

```
Authorization: Bearer your_jwt_token
Content-Type: application/json
```

**Request:**

```json
{
  "bio": "I am a passionate developer",
  "location": "New York, USA",
  "profilePicture": "https://example.com/profile.jpg",
  "resume": "https://example.com/resume.pdf",
  "availability": "full-time",
  "skillsOffered": ["JavaScript", "React", "Node.js"],
  "skillsWanted": ["Python", "Machine Learning"],
  "profileVisibility": "public"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Profile updated successfully",
  "profileComplete": true,
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "bio": "I am a passionate developer",
    "location": "New York, USA",
    "profilePicture": "https://example.com/profile.jpg",
    "resume": "https://example.com/resume.pdf",
    "availability": "full-time",
    "skillsOffered": ["JavaScript", "React", "Node.js"],
    "skillsWanted": ["Python", "Machine Learning"],
    "profileVisibility": "public",
    "profileComplete": true
  }
}
```

---

#### GET `/api/profile/me`

**Description:** Get current user's complete profile

**Headers:**

```
Authorization: Bearer your_jwt_token
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "bio": "I am a passionate developer",
    "location": "New York, USA",
    "profilePicture": "https://example.com/profile.jpg",
    "resume": "https://example.com/resume.pdf",
    "availability": "full-time",
    "skillsOffered": ["JavaScript", "React", "Node.js"],
    "skillsWanted": ["Python", "Machine Learning"],
    "profileVisibility": "public",
    "profileComplete": true,
    "isVerified": true,
    "createdAt": "2026-01-28T10:30:00Z"
  }
}
```

---

#### GET `/api/profile/status`

**Description:** Check profile completion status and percentage

**Headers:**

```
Authorization: Bearer your_jwt_token
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "profileComplete": false,
    "completionPercentage": 60,
    "missingFields": ["profilePicture", "skillsOffered"]
  }
}
```

---

#### GET `/api/profile/:userId`

**Description:** Get a specific user's profile (respects privacy settings)

**Parameters:**

- `userId` - User ID (from URL path)

**Response (200):**

```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "bio": "I am a passionate developer",
    "location": "New York, USA",
    "profilePicture": "https://example.com/profile.jpg",
    "availability": "full-time",
    "skillsOffered": ["JavaScript", "React"],
    "skillsWanted": ["Python"],
    "profileVisibility": "public"
  }
}
```

**Response (403) - Private Profile:**

```json
{
  "success": false,
  "message": "This profile is private"
}
```

---

#### PUT `/api/profile/visibility`

**Description:** Change profile visibility (public/private)

**Headers:**

```
Authorization: Bearer your_jwt_token
```

**Request:**

```json
{
  "profileVisibility": "private"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Profile visibility set to private",
  "profileVisibility": "private"
}
```

---

#### GET `/api/profile/discover`

**Description:** Discover public profiles (for finding users by skills or role)

**Query Parameters:**

- `role` (optional) - Filter by role (e.g., "student")
- `skill` (optional) - Filter by specific skill
- `page` (optional, default: 1) - Page number
- `limit` (optional, default: 10) - Results per page

**Examples:**

```
GET /api/profile/discover?page=1&limit=10
GET /api/profile/discover?skill=JavaScript
GET /api/profile/discover?role=student&skill=React&page=2
```

**Response (200):**

```json
{
  "success": true,
  "total": 25,
  "page": 1,
  "pages": 3,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "bio": "I am a passionate developer",
      "location": "New York, USA",
      "profilePicture": "https://example.com/profile.jpg",
      "availability": "full-time",
      "skillsOffered": ["JavaScript", "React"],
      "skillsWanted": ["Python"],
      "profileVisibility": "public"
    },
    {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Jane Smith",
      "bio": "Full-stack developer",
      "location": "San Francisco, USA",
      "profilePicture": "https://example.com/profile2.jpg",
      "availability": "part-time",
      "skillsOffered": ["Node.js", "MongoDB"],
      "skillsWanted": ["React Native"],
      "profileVisibility": "public"
    }
  ]
}
```

---

## Error Responses

### 400 - Bad Request

```json
{
  "success": false,
  "message": "Please provide all required fields"
}
```

### 401 - Unauthorized

```json
{
  "success": false,
  "message": "Token is not valid"
}
```

### 403 - Forbidden

```json
{
  "success": false,
  "message": "Please verify your email before logging in"
}
```

### 404 - Not Found

```json
{
  "success": false,
  "message": "User not found"
}
```

### 500 - Server Error

```json
{
  "success": false,
  "message": "Server error during [operation]"
}
```

---

## Required Fields Summary

### Profile Completion Requirements

All of these must be filled to mark profile as complete:

- ✅ `bio` (max 500 characters)
- ✅ `location` (required)
- ✅ `profilePicture` (required)
- ✅ `availability` (must be "part-time" or "full-time", not "not available")
- ✅ `skillsOffered` (minimum 1 skill)

### Optional Fields

- `resume` (PDF/document link)
- `skillsWanted` (skills user wants to learn)

---

## Authentication

Most profile routes require JWT token in the header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Get the token from:

- `/api/auth/signup` response
- `/api/auth/login` response
- `/api/auth/verify-email` response

---

## Base URL

```
http://localhost:5000
```

All routes are prefixed with `/api`
