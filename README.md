# Skillify

A modern skill exchange platform where users can showcase their skills, connect with others, and collaborate on projects. Built with the MERN stack (MongoDB, Express, React, Node.js).

## 🚀 Features

- **User Authentication** - Secure signup/login with JWT and email verification
- **Profile Management** - Complete profiles with bio, location, skills, and availability
- **File Uploads** - Profile pictures and resumes with Cloudinary storage
- **User Discovery** - Search and filter users by skills and availability
- **Modern UI** - Responsive design with Tailwind CSS and gradient themes
- **Email Notifications** - Automated verification emails with Nodemailer
- **Secure API** - Protected routes with JWT middleware

## 🛠️ Tech Stack

### Frontend

- **React 19** - Modern UI library
- **Vite** - Lightning-fast build tool
- **Tailwind CSS v4** - Utility-first CSS framework
- **React Router v7** - Client-side routing
- **Context API** - State management

### Backend

- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication tokens
- **Cloudinary** - Image and file storage
- **Multer** - File upload handling
- **Nodemailer** - Email service

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/) (v4.4 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Git](https://git-scm.com/)

## 🚦 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Skiilify
```

### 2. Setup Backend

```bash
cd Backend
npm install
```

Create a `.env` file in the Backend folder:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/skillify
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLIENT_URL=http://localhost:5173
```

Start the backend server:

```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### 3. Setup Frontend

```bash
cd ../Frontend
npm install
```

Update API URL in `src/utils/api.js` if needed (default: `http://localhost:5000/api`)

Start the frontend dev server:

```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

### 4. Access the Application

Open your browser and navigate to `http://localhost:5173`

## 📁 Project Structure

```
Skiilify/
├── Backend/                 # Node.js + Express backend
│   ├── config/
│   │   └── db.js           # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js
│   │   └── profileController.js
│   ├── middleware/
│   │   └── auth.js         # JWT authentication
│   ├── models/
│   │   └── User.js         # User schema
│   ├── routes/
│   │   ├── auth.js         # Auth routes
│   │   └── profile.js      # Profile routes
│   ├── utils/
│   │   ├── emailService.js # Email handling
│   │   └── tokenGenerator.js
│   ├── server.js           # Entry point
│   ├── package.json
│   └── README.md           # Backend documentation
│
├── Frontend/                # React + Vite frontend
│   ├── public/
│   │   └── Skillify.png    # Logo
│   ├── src/
│   │   ├── components/
│   │   │   ├── cards/      # ProfileCard
│   │   │   ├── common/     # LoadingSpinner, NotFound
│   │   │   └── layout/     # NavBar, Footer
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/          # All page components
│   │   ├── utils/
│   │   │   └── api.js      # API functions
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── README.md           # Frontend documentation
│
├── API_ROUTES.md           # API documentation
└── README.md               # This file
```

## 🔌 API Endpoints

### Authentication Routes (`/api/auth`)

- `POST /signup` - Register new user
- `POST /login` - Login user
- `GET /verify/:token` - Verify email

### Profile Routes (`/api/profile`)

- `GET /me` - Get current user profile
- `GET /all` - Get all users (paginated)
- `GET /search` - Search users
- `GET /:userId` - Get specific user profile
- `PUT /complete` - Complete profile (first time)
- `PUT /update` - Update profile
- `POST /upload-picture` - Upload profile picture
- `POST /upload-resume` - Upload resume

For detailed API documentation, see [API_ROUTES.md](API_ROUTES.md)

## 🎨 Key Features & UI

### File Upload System

- **Profile Pictures:** Drag-and-drop with instant preview
- **Resumes/Portfolios:** PDF uploads with download links
- **Visual Feedback:** Dashed border upload areas with icons
- **Cloudinary Integration:** Secure cloud storage

### Profile Cards

- **Gradient Headers:** Teal→Cyan→Blue gradient
- **Overlapping Images:** Profile pictures overlap header
- **Status Badges:** Full-time, Part-time, Not Available
- **Skills Display:** First 3 skills + "+N more"
- **Resume Indicator:** Badge showing resume presence

### Responsive Design

- **Mobile-First:** Works beautifully on all screen sizes
- **Touch-Friendly:** Large buttons and interactive areas
- **Modern Gradients:** Consistent color scheme throughout

## 🔐 Environment Setup

### Backend Environment Variables

See [Backend/README.md](Backend/README.md) for detailed environment variable documentation.

Required services:

- **MongoDB:** Local or cloud (MongoDB Atlas)
- **Cloudinary:** Image and document storage
- **Email Service:** Gmail, Outlook, or custom SMTP

### Frontend Configuration

API URL is configured in `Frontend/src/utils/api.js`

## 🏃‍♂️ Running in Production

### Backend

```bash
cd Backend
npm install --production
npm start
```

### Frontend

```bash
cd Frontend
npm run build
npm run preview
```

Deploy the `Frontend/dist/` folder to:

- Vercel
- Netlify
- Static hosting

Deploy backend to:

- Heroku
- Railway
- DigitalOcean
- AWS

## 🧪 Development Workflow

1. **Start MongoDB** (if running locally)
2. **Start Backend** - `cd Backend && npm run dev`
3. **Start Frontend** - `cd Frontend && npm run dev`
4. **Make Changes** - Hot reload enabled for both
5. **Test Features** - Check browser console and terminal logs
6. **Commit Changes** - Use meaningful commit messages

## 🐛 Troubleshooting

### Backend Issues

**MongoDB Connection Errors:**

- Check if MongoDB is running: `mongosh`
- Verify MONGO_URI in `.env`
- Check network connectivity

**Cloudinary Upload Failures:**

- Verify Cloudinary credentials
- Check file size limits
- Ensure proper resource_type for PDFs

**Email Not Sending:**

- Use app-specific password for Gmail
- Check EMAIL\_\* variables in `.env`
- Verify SMTP settings

### Frontend Issues

**Can't Connect to Backend:**

- Check backend is running on port 5000
- Verify API_URL in `api.js`
- Check browser console for CORS errors

**File Upload Not Working:**

- Ensure backend is receiving files
- Check Cloudinary configuration
- Verify file size and type

**Blank Page After Build:**

- Check browser console for errors
- Verify API URLs for production
- Ensure environment variables are set

## 📚 Documentation

- [Backend Setup Guide](Backend/README.md) - Complete backend documentation
- [Frontend Setup Guide](Frontend/README.md) - Complete frontend documentation
- [API Routes](API_ROUTES.md) - API endpoint reference

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Use consistent indentation (2 spaces)
- Follow React best practices
- Write meaningful commit messages
- Comment complex logic
- Test before committing

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- React team for an amazing framework
- Vite for blazing-fast build times
- Tailwind CSS for utility-first styling
- Cloudinary for reliable file storage
- MongoDB for flexible data storage

## 📧 Support

For questions or support:

- Email: support@skillify.com
- Issues: Open a GitHub issue
- Documentation: Check README files in each folder

## 🗺️ Roadmap

### Upcoming Features

- [ ] Real-time messaging between users
- [ ] Project collaboration boards
- [ ] Skill endorsements and ratings
- [ ] Advanced search filters
- [ ] Mobile app (React Native)
- [ ] Video call integration
- [ ] Payment integration for premium features
- [ ] Admin dashboard
- [ ] Analytics and insights

## 📊 Project Status

**Current Version:** 1.0.0  
**Status:** Active Development  
**Last Updated:** 2024

---

**Made with ♥ by the Skillify Team**

Visit us at [www.skillify.com](https://www.skillify.com) | Follow us on [GitHub](https://github.com/skillify)
