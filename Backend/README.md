# Skiilify Backend

Backend API for the Skiilify platform built with Express.js and MongoDB.

## Project Structure

```
Backend/
├── config/              # Configuration files (database connection)
├── controllers/         # Route controllers (business logic)
│   ├── authController.js
│   └── profileController.js
├── models/              # Mongoose schemas
│   └── User.js
├── routes/              # API routes
│   ├── auth.js
│   └── profile.js
├── middleware/          # Custom middleware (authentication, etc.)
│   └── auth.js
├── utils/               # Utility functions
│   ├── emailService.js
│   └── tokenGenerator.js
├── server.js            # Main server file
├── package.json         # Dependencies
├── .env.example         # Environment variables template
└── .gitignore           # Git ignore file
```

## Installation

1. Navigate to Backend folder:

```bash
cd Backend
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env` file from `.env.example` and update with your configuration:

```bash
cp .env.example .env
```

4. Make sure MongoDB is running on your system.

## Running the Server

### Development (with hot reload):

```bash
npm run dev
```

### Production:

```bash
npm start
```

The server will run on `http://localhost:5000` by default.

## API Endpoints

### Authentication

- **POST** `/api/auth/signup` - Register a new user
  - Body: `{ name, email, password, confirmPassword, role }`
  - Response includes `profileComplete: false`
- **POST** `/api/auth/login` - Login user
  - Body: `{ email, password }`
  - Response includes `profileComplete` status
- **GET** `/api/auth/me` - Get current user (Protected)
  - Headers: `Authorization: Bearer <token>`

- **POST** `/api/auth/verify-email` - Verify email with token
  - Body: `{ token }`

- **POST** `/api/auth/resend-verification` - Resend verification email
  - Body: `{ email }`

### Profile Management

#### Update Profile (Required after signup)

- **PUT** `/api/profile/update` - Update user profile (Protected)
  - Headers: `Authorization: Bearer <token>`
  - Body:
  ```json
  {
    "bio": "Your bio",
    "location": "Your location",
    "profilePicture": "URL to profile picture",
    "resume": "URL to resume",
    "availability": "part-time|full-time|not available",
    "skillsOffered": ["skill1", "skill2"],
    "skillsWanted": ["skill3", "skill4"],
    "profileVisibility": "public|private"
  }
  ```

  - Returns `profileComplete: true/false` based on required fields

#### Get Current User Profile

- **GET** `/api/profile/me` - Get your profile (Protected)
  - Headers: `Authorization: Bearer <token>`

#### Get Profile Completion Status

- **GET** `/api/profile/status` - Check profile completion progress (Protected)
  - Headers: `Authorization: Bearer <token>`
  - Response includes:
    - `profileComplete`: boolean
    - `completionPercentage`: 0-100
    - `missingFields`: array of required fields not yet filled

#### Get User Profile

- **GET** `/api/profile/:userId` - Get any user's profile
  - Returns profile if public or if user is viewing their own profile
  - Returns 403 if profile is private

#### Update Profile Visibility

- **PUT** `/api/profile/visibility` - Change profile visibility (Protected)
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ profileVisibility: "public|private" }`

#### Discover Public Profiles

- **GET** `/api/profile/discover` - Find other users (Public)
  - Query params:
    - `role`: "student" or "instructor" (optional)
    - `skill`: filter by skill (optional)
    - `page`: page number (default: 1)
    - `limit`: results per page (default: 10)
  - Returns only verified users with complete public profiles

## Profile Completion Flow

1. **User signs up** → `profileComplete: false`, asked to complete profile
2. **User fills profile** → System checks if all required fields are completed
3. **All required fields filled** → `profileComplete: true`
4. **Can login and use full features** → Suggested to users based on skills

### Required Fields for Profile Completion

- bio (required)
- location (required)
- profilePicture (required)
- availability (required - not just "not available")
- skillsOffered (required - at least 1 skill)

### Optional Fields

- resume
- skillsWanted

## Profile Visibility

- **Public Profile**: Visible to all users, appears in discovery
- **Private Profile**: Only visible to the user themselves

## Environment Variables

Create a `.env` file with the following variables:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/skiilify
JWT_SECRET=your_jwt_secret_key_change_this_in_production
NODE_ENV=development

# Email Configuration (Gmail SMTP)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_specific_password
EMAIL_FROM=your_email@gmail.com

# Frontend URL for email verification link
FRONTEND_URL=http://localhost:5173
```

## Dependencies

- **express** - Web framework
- **mongoose** - MongoDB ODM
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT token generation
- **cors** - Cross-Origin Resource Sharing
- **dotenv** - Environment variables management
- **nodemailer** - Email sending

## Example Frontend Flow

```javascript
// After signup
const signupResponse = await fetch('/api/auth/signup', {...});
const { user } = await signupResponse.json();

if (!user.profileComplete) {
  // Redirect to profile completion page
  navigate('/complete-profile');
}

// On profile completion page
const profileResponse = await fetch('/api/profile/update', {
  method: 'PUT',
  headers: { 'Authorization': `Bearer ${token}` },
  body: JSON.stringify({
    bio: "I am...",
    location: "City, Country",
    profilePicture: "image_url",
    availability: "part-time",
    skillsOffered: ["JavaScript", "React"]
  })
});

const { profileComplete } = await profileResponse.json();

if (profileComplete) {
  // Redirect to dashboard
  navigate('/dashboard');
}
```
