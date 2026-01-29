# Skillify Frontend

Modern, responsive frontend for Skillify - A skill exchange platform built with React and Vite.

## Features

- User authentication (Sign up, Login, Email verification)
- Profile creation and management
- File uploads (Profile pictures and resumes)
- User discovery with search and filters
- Real-time profile updates
- Responsive design (mobile-first)
- Modern UI with Tailwind CSS

## Tech Stack

- **Framework:** React 19
- **Build Tool:** Vite
- **Styling:** Tailwind CSS v4
- **Routing:** React Router v7
- **State Management:** React Context API
- **HTTP Client:** Fetch API
- **File Storage:** Cloudinary (via backend)

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

## Installation

1. Navigate to the Frontend directory:

```bash
cd Frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create environment file:

```bash
cp .env.example .env
```

4. Update `.env` with your backend API URL (default is already set for local development)

## Environment Variables

The frontend uses environment variables to configure the API connection.

### Setup

1. Create a `.env` file in the Frontend directory:

```bash
cp .env.example .env
```

2. Configure the variables:

```env
# API Base URL - Backend server URL
VITE_API_BASE_URL=http://localhost:5000/api
```

### Environment Variables Reference

| Variable            | Description          | Default                 | Required |
| ------------------- | -------------------- | ----------------------- | -------- |
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:5000` | Yes      |

### Important Notes

- **Vite Prefix:** All environment variables must be prefixed with `VITE_` to be accessible in the frontend code
- **Rebuild Required:** After changing `.env` file, restart the dev server (`npm run dev`)
- **Production:** Update `VITE_API_BASE_URL` to your production backend URL before building

### Example Configurations

**Local Development:**

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

**Production:**

```env
VITE_API_BASE_URL=https://api.skillify.com/api
```

**Custom Port:**

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

## Running the Application

### Development Mode (with hot reload)

```bash
npm run dev
```

The app will start on `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
Frontend/
├── public/
│   └── Skillify.png        # Logo and favicon
├── src/
│   ├── assets/             # Static assets
│   ├── components/
│   │   ├── cards/
│   │   │   └── ProfileCard.jsx
│   │   ├── common/
│   │   │   ├── LoadingSpinner.jsx
│   │   │   └── NotFound.jsx
│   │   └── layout/
│   │       ├── Footer.jsx
│   │       └── NavBar.jsx
│   ├── context/
│   │   └── AuthContext.jsx  # Authentication state
│   ├── pages/
│   │   ├── CompleteProfile.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Discover.jsx
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Profile.jsx
│   │   ├── Signup.jsx
│   │   └── VerifyEmail.jsx
│   ├── utils/
│   │   ├── api.js           # API utility functions
│   │   └── pageTitle.js     # Dynamic page titles
│   ├── App.jsx              # Main app component
│   ├── App.css              # Global styles
│   ├── main.jsx             # Entry point
│   └── index.css            # Tailwind imports
├── eslint.config.js         # ESLint configuration
├── vite.config.js           # Vite configuration
├── package.json             # Dependencies
└── index.html               # HTML template
```

## Key Features

### 1. Authentication Flow

- **Signup:** Create account with email verification
- **Login:** JWT-based authentication
- **Email Verification:** Token-based email confirmation
- **Protected Routes:** Automatic redirect for unauthenticated users

### 2. Profile Management

- **Complete Profile:** First-time profile setup
- **Edit Profile:** Update bio, location, skills
- **File Uploads:**
  - Profile picture with instant preview
  - Resume/portfolio with download option
- **Visibility Control:** Public/Private profile toggle

### 3. User Discovery

- **Browse Users:** Paginated user list
- **Search:** Search by name or skills
- **Filter:** Filter by availability
- **Profile Cards:** Beautiful cards with gradient headers

### 4. File Upload UI

- **Dashed Border Upload Areas:** Clear visual indicators
- **Drag-and-Drop Ready:** Styled for intuitive interaction
- **Preview:** Instant image preview with badges
- **Success Feedback:** Green confirmation boxes
- **Loading States:** Animated spinners during upload

## Pages Overview

### Public Pages

- **Home** (`/`) - Landing page with features and CTA
- **Login** (`/login`) - User login form
- **Signup** (`/signup`) - User registration form
- **Verify Email** (`/verify-email/:token`) - Email verification

### Protected Pages (Require Authentication)

- **Dashboard** (`/dashboard`) - User dashboard
- **Discover** (`/discover`) - Browse and search users
- **Complete Profile** (`/complete-profile`) - Initial profile setup
- **Profile** (`/profile/:userId`) - View user profile
- **Profile Edit** (`/profile`) - Edit own profile

## Styling Guide

### Tailwind CSS v4

The project uses the latest Tailwind CSS with modern features:

**Color Scheme:**

- Primary: Teal (500-700)
- Accent: Cyan (500-700)
- Success: Green (500-700)
- Neutral: Gray (50-900)

**Key Design Patterns:**

- Gradient backgrounds: `bg-gradient-to-r from-teal-600 to-cyan-600`
- Modern cards: `rounded-2xl shadow-lg`
- Hover effects: `hover:shadow-2xl transition-shadow`
- Focus states: `focus:ring-2 focus:ring-teal-500`

### Custom Components

**ProfileCard:**

- Gradient header (Teal→Cyan→Blue)
- Overlapping profile picture (-mt-10)
- Availability badges
- Skills with "+N more" indicator
- Resume indicator badge

**Upload Areas:**

- Dashed borders for file inputs.

### API Base URL Configuration

The API base URL is configured via the `VITE_API_BASE_URL` environment variable:

```javascript
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
```

### Available API Functions

```javascript
// Authentication
api.signup(userData);
api.login(credentials);
api.verifyEmail(token);

// Profile Management
api.getMyProfile();
api.updateProfile(profileData);
api.completeProfile(profileData);
api.getUserProfile(userId);

// File Uploads
api.uploadProfilePicture(file);
api.uploadResume(file);

// User Discovery
// Example API functions
api.signup(userData);
api.login(credentials);
api.getMyProfile();
api.updateProfile(profileData);
api.uploadProfilePicture(file);
api.uploadResume(file);
api.getAllUsers(filters);
api.searchUsers(query);
```

## State Management

### AuthContext

Provides global authentication state:

- `user` - Current user object
- `loading` - Loading state
- `login(token, userData)` - Login function
- `logout()` - Logout function
- `updateUser(userData)` - Update user data

## Responsive Design

**Breakpoints:**

- Mobile: < 768px (single column)
- Tablet: 768px - 1024px (2 columns)
- Desktop: > 1024px (3-4 columns)

**Mobile-First Approach:**

- All components start with mobile layout
- Progressive enhancement for larger screens
- Touch-friendly button sizes
- Collapsible navigation

## Browser Support

- Chrome (90+)
- Firefox (88+)
- Safari (14+)
- Edge (90+)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Optimization

- Code splitting with React Router
- Lazy loading of images
- Optimized bundle size with Vite
- CSS purging with Tailwind
- Fast refresh during development

## Troubleshooting

### Backend Connection Issues

- Ensure backend is running on the configured port (default: 5000)
- Check `VITE_API_BASE_URL` in `.env` file
- Restart dev server after changing `.env` (`Ctrl+C` then `npm run dev`)
- Verify CORS is configured in backend
- Check browser console Network tab for actual API calls

### File Upload Not Working

- Check backend is receiving files
- Verify Cloudinary credentials in backend
- Check file size limits (10MB images, 50MB documents)
- Ensure proper file types are selected

### Authentication Issues

- Clear browser cookies and localStorage
- Check JWT token expiration
- Verify backend JWT_SECRET matches

### Styling Issues

- Run `npm install` to ensure Tailwind is installed
- Check `index.css` imports Tailwind directives
- Restart dev server after Tailwind config changes

## Development Tips

1. **Hot Module Replacement:** Changes reflect instantly without page reload
2. **React DevTools:** Install browser extension for debugging
3. **Console Logging:** Check browser console for errors
4. **Network Tab:** Monitor API requests in browser DevTools

## NPM Scripts

```json
{
  "dev": "vite", // Start dev server
  "build": "vite build", // Build for production
  "preview": "vite preview", // Preview production build
  "lint": "eslint ." // Run ESLint
}
```

## Common Issues & Solutions

### Issue: "Module not found"

**Solution:** Run `npm install` to install missing dependencies
ensure `VITE_API_BASE_URL` is set for production

### Issue: Blank page after build

**Solution:** Check browser console for errors, verify API URL

### Issue: API calls returning 404

**Solution:** Check `VITE_API_BASE_URL` includes `/api` at the end (e.g., `http://localhost:5000/api`)

### Issue: Styles not applying

**Solution:** Ensure Tailwind CSS is properly configured in `vite.config.js`

### Issue: Images not loading

**Solution:** Verify images are in `public/` folder and paths are correct

## Contributing

1. Create a new branch for your feature
2. Follow the existing code style
3. Test on multiple screen sizes
4. Ensure no console errors
5. Submit a pull request

## Build & Deploy

### Build for Production

```bash
npm run build
```

Output will be in `dist/` folder

### Deploy Options

- **Vercel:** Connect GitHub repo for automatic deployments
- **Netlify:** Drag and drop `dist/` folder
- **Static Hosting:** Upload `dist/` contents to any web server

## License

This project is part of Skillify platform.

---

**Need help?** Check the main project README or contact support@skillify.com
