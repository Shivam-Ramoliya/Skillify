# Skillify Backend

Backend server for Skillify - A skill exchange platform built with Node.js, Express, and MongoDB.

## Features

- User authentication with JWT
- Email verification system
- Profile management with Cloudinary file uploads
- User discovery and search
- RESTful API architecture

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT (JSON Web Tokens)
- **File Storage:** Cloudinary
- **Email:** Nodemailer
- **File Upload:** Multer

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/) (local or cloud instance)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

## Environment Variables

Create a `.env` file in the Backend directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=your_mongodb_connection_string

# JWT Secret
JWT_SECRET=your_jwt_secret_key

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Email Configuration (for email verification)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

## Installation

1. Navigate to the Backend directory:

```bash
cd Backend
```

2. Install dependencies:

```bash
npm install
```

## Running the Server

### Development Mode (with auto-restart)

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

The server will start on `http://localhost:5000` (or your specified PORT)

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/verify-email/:token` - Verify email address

### Profile

- `GET /api/profile/me` - Get current user profile
- `PUT /api/profile` - Update user profile
- `POST /api/profile/upload-picture` - Upload profile picture
- `POST /api/profile/upload-resume` - Upload resume/portfolio
- `GET /api/profile/:userId` - Get user profile by ID

### Users

- `GET /api/users` - Get all users (with filters)
- `GET /api/users/search` - Search users by skills

## Project Structure

```
Backend/
├── config/
│   ├── cloudinary.js      # Cloudinary configuration
│   └── db.js               # MongoDB connection
├── controllers/
│   ├── authController.js   # Authentication logic
│   └── profileController.js # Profile management logic
├── middleware/
│   └── auth.js             # JWT authentication middleware
├── models/
│   └── User.js             # User model schema
├── routes/
│   ├── auth.js             # Authentication routes
│   └── profile.js          # Profile routes
├── utils/
│   ├── cloudinaryUpload.js # Cloudinary upload helpers
│   ├── emailService.js     # Email sending utilities
│   └── tokenGenerator.js   # JWT token generation
├── .env                    # Environment variables (create this)
├── server.js               # Main server file
└── package.json            # Dependencies
```

## File Upload Configuration

### Profile Pictures

- Accepted formats: JPG, PNG, GIF
- Maximum size: 10MB
- Stored in Cloudinary as images

### Resumes/Documents

- Accepted formats: PDF, DOC, DOCX, TXT
- Maximum size: 50MB
- Stored in Cloudinary with `resource_type: "raw"` for proper PDF handling

## Database Schema

### User Model

```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  bio: String,
  location: String,
  profilePicture: String (URL),
  profilePicturePublicId: String,
  resume: String (URL),
  resumePublicId: String,
  skillsOffered: [String],
  skillsWanted: [String],
  availability: String (enum: 'full-time', 'part-time', 'not available'),
  profileVisibility: String (enum: 'public', 'private'),
  isVerified: Boolean,
  verificationToken: String,
  profileComplete: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Email verification required
- Protected routes with middleware
- CORS configuration
- Environment variable protection

## Error Handling

The API uses consistent error responses:

```json
{
  "success": false,
  "message": "Error message here"
}
```

Success responses:

```json
{
  "success": true,
  "data": { ... },
  "message": "Success message"
}
```

## Troubleshooting

### MongoDB Connection Issues

- Verify your `MONGODB_URI` is correct
- Check if MongoDB is running (local) or accessible (cloud)
- Ensure your IP is whitelisted (MongoDB Atlas)

### Cloudinary Upload Fails

- Verify all Cloudinary credentials in `.env`
- Check file size limits
- Ensure `resource_type: "raw"` is set for documents

### Email Verification Not Working

- Use Gmail App Password (not regular password)
- Enable "Less secure app access" or use App Passwords
- Check EMAIL_USER and EMAIL_PASS values

### CORS Errors

- Verify FRONTEND_URL matches your frontend URL
- Check port numbers

## Development Tips

1. **Testing API endpoints:** Use Postman or Thunder Client
2. **Monitor requests:** Check terminal logs for incoming requests
3. **Database inspection:** Use MongoDB Compass or Atlas UI
4. **File uploads:** Test with small files first

## NPM Scripts

```json
{
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

This project is part of Skillify platform.

---

**Need help?** Check the main project README or contact support@skillify.com
