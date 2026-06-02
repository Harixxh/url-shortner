# URL Shortener with Analytics 🔗

A production-grade URL shortening service with comprehensive analytics, built for placement-driven hackathon excellence.

## 🎯 Project Overview

This is a full-stack application that allows users to:
- Create shortened URLs with custom aliases
- Track analytics (clicks, device/browser/geo data, daily trends)
- Generate QR codes for shortened URLs
- Set expiry dates on URLs
- View comprehensive dashboards with performance metrics

### Key Features

**Mandatory:**
- ✅ JWT Authentication (Sign up, Login, Protected Routes)
- ✅ URL Shortening with Unique Short Codes
- ✅ Dashboard with URL Management
- ✅ Basic Analytics (Click Tracking)

**Bonus (Implemented):**
- ✅ Custom URL Aliases
- ✅ QR Code Generation
- ✅ Expiry Dates
- ✅ Device Analytics (Desktop, Tablet, Mobile)
- ✅ Browser Analytics (Chrome, Firefox, Safari, etc.)
- ✅ Geolocation Analytics (Country, City)
- ✅ Daily Click Trends
- ✅ Recent Visit History

## 🏗️ Architecture

```
URL-Shortener/
├── backend/                 # Node.js Express API
│   ├── src/
│   │   ├── config/         # Database & constants
│   │   ├── models/         # MongoDB schemas
│   │   ├── controllers/    # Business logic
│   │   ├── routes/         # API endpoints
│   │   ├── middleware/     # Auth, validation, error handling
│   │   ├── services/       # Utilities
│   │   └── server.js       # App entry point
│   └── package.json
├── frontend/                # React + Tailwind CSS
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── store/          # Zustand state management
│   │   ├── utils/          # API, helpers
│   │   ├── styles/         # Global CSS
│   │   └── App.jsx         # App entry point
│   └── package.json
├── docker-compose.yml      # Local development with MongoDB
├── Dockerfile.backend      # Backend containerization
└── Dockerfile.frontend     # Frontend containerization
```

## 🤖 AI Planning & Feature List

### Planned Features
- User authentication (signup/login, JWT-based auth)
- URL shortening with unique short codes
- Custom URL aliases and expiry dates
- QR code generation for shortened links
- Click tracking and analytics for each visit
- Device, browser, and geographic analytics
- Dashboard and analytics visualization pages
- User URL management, listing, and deletion
- Secure backend validation, error handling, and rate limiting support

### Implementation Plan
- Design backend structure with MVC + middleware for separation of concerns
- Build MongoDB schemas for users, URLs, and visits
- Create frontend React pages for auth, URL creation, dashboard, and analytics
- Integrate Axios API client with JWT token handling
- Implement analytics aggregation using MongoDB queries and visit tracking
- Add responsive UI styling with Tailwind CSS

## 🧩 Architecture Diagram

```
Browser
  ↓
Frontend React App (Pages, Components, Zustand)
  ↓
Axios API Calls
  ↓
Backend Express Server (Routes → Controllers → Services → Models)
  ↓
MongoDB Database
  ├── users
  ├── urls
  └── visits
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- MongoDB 7.0+
- Docker & Docker Compose (optional, for containerized setup)

### Local Development Setup

**1. Clone Repository**
```bash
git clone <repo-url>
cd url-shortener
```

**2. Backend Setup**
```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

**3. Frontend Setup (New Terminal)**
```bash
cd frontend
npm install
npm run dev
```

**4. Access Application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Docs: http://localhost:5000/api

### Docker Setup (Recommended for Production)

**1. Build & Run with Docker Compose**
```bash
docker-compose up -d
```

**2. Services will be available at:**
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- MongoDB: localhost:27017

**3. View Logs**
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb
```

**4. Shutdown**
```bash
docker-compose down
```

## 🗄️ Database Design

### Collections

**users**
- Stores user account information with bcrypt hashed passwords
- Indexes: email (unique), createdAt

**urls**
- Stores shortened URL mappings
- Indexes: (userId, createdAt), shortCode (unique), customAlias (unique, sparse)
- Atomic click counter for performance

**visits**
- Stores analytics data for each URL redirect
- Indexes: (urlId, visitedAt), (urlId, device), (urlId, browser), (urlId, country)
- TTL Index: Auto-deletes records after 90 days

### Schema Validation

All collections enforce strict validation:
- Email format validation
- URL format validation (https://)
- Short code alphanumeric validation
- Country code ISO 3166-1 validation

See [DATABASE_DESIGN.md](./DATABASE_DESIGN.md) for detailed schema specifications.

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/signup      - Register new user
POST   /api/auth/login       - Login user
GET    /api/auth/me          - Get current user profile
POST   /api/auth/logout      - Logout user
```

### URL Management
```
POST   /api/urls/shorten     - Create shortened URL
GET    /api/urls             - Get all user URLs
GET    /api/urls/:id         - Get single URL
PUT    /api/urls/:id         - Update URL destination
DELETE /api/urls/:id         - Delete URL (soft delete)
```

### Analytics
```
GET    /s/:shortCode         - Redirect & track visit
GET    /api/analytics/:urlId - Get URL analytics
GET    /api/analytics/dashboard/summary - Dashboard summary
```

## 📊 Analytics Features

**Per-URL Analytics Include:**
- Total click count
- Last visited timestamp
- Device breakdown (Desktop, Tablet, Mobile)
- Browser breakdown (Chrome, Firefox, Safari, Edge, etc.)
- Geographic data (Country, City)
- Daily click trends
- Recent visit history (last 20 visits)

**Privacy & Security:**
- IP addresses hashed (GDPR compliant)
- No raw PII stored
- Automatic cleanup of old data (90-day TTL)

## 🔐 Security Features

- ✅ JWT-based authentication
- ✅ Bcryptjs password hashing (12 rounds)
- ✅ Input validation & sanitization
- ✅ CORS protection
- ✅ Helmet security headers
- ✅ Hashed IP addresses for privacy
- ✅ Soft deletes for audit trails
- ✅ Rate limiting ready (Redis integration available)

## 📈 Performance Optimizations

- **Atomic Counters:** Click counts updated atomically without scanning visits collection
- **Compound Indexes:** Optimized for common query patterns
- **TTL Indexes:** Automatic cleanup prevents unbounded collection growth
- **Aggregation Pipelines:** Efficient analytics queries
- **Response Compression:** Gzip enabled
- **Caching Ready:** Redis integration available

## 🎨 Frontend Design

### Pages
- **Login/Signup:** Beautiful authentication forms
- **Dashboard:** Summary stats, top performing URLs
- **Create URL:** Form to create new shortened URLs with custom alias option
- **My URLs:** List of all created URLs with management options
- **Analytics:** Detailed analytics view with charts

### UI Features
- Modern SaaS-style design
- Responsive (Mobile, Tablet, Desktop)
- Dark/Light mode ready
- Toast notifications
- Loading states
- Error handling

### Technology Stack
- React 18+ with Hooks
- Zustand for state management
- Recharts for analytics visualization
- Tailwind CSS for styling
- Vite for fast development

## 📦 Deployment

### Production Build

**Backend:**
```bash
cd backend
npm run build
NODE_ENV=production npm start
```

**Frontend:**
```bash
cd frontend
npm run build
# dist/ folder contains production build
```

### Environment Variables

Create `.env` file in each service:

**Backend (.env)**
```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/url-shortener
JWT_SECRET=<strong-secret-key>
NODE_ENV=production
CORS_ORIGIN=https://yourdomain.com
```

**Frontend (.env)**
```env
VITE_API_URL=https://api.yourdomain.com
```

### Deployment Platforms

**Heroku:** Push with docker-compose.yml
**AWS:** ECS with ECR for container hosting
**DigitalOcean:** App Platform or Droplets with Docker
**Vercel:** Frontend only (separate API hosting)

## 📝 Testing

```bash
# Backend tests
cd backend
npm test
npm test:watch

# Frontend tests
cd frontend
npm test
npm test:watch
```

## 🔍 Code Quality

```bash
# Backend linting
cd backend
npm run lint
npm run lint:fix

# Frontend linting
cd frontend
npm run lint
npm run lint:fix
```



## 🎓 Interview Preparation

This project demonstrates:

**Design Patterns:**
- MVC Architecture
- Service Layer Pattern
- Repository Pattern (Models)
- Middleware Pattern
- Error Handling & Logging

**Best Practices:**
- Clean Code & SOLID Principles
- Comprehensive Input Validation
- Security by Design
- Database Optimization
- API Design Standards (RESTful)

**Scalability:**
- MongoDB sharding strategy
- Index optimization
- TTL data management
- Atomic operations
- Connection pooling ready

**DevOps:**
- Docker containerization
- Docker Compose orchestration
- Health checks
- Environment management
- Production-ready logging



## 📄 License

MIT License - Feel free to use this for your portfolio!


## 🧠 Assumptions
- The developer has Node.js 16+ and MongoDB installed locally or accessible through Atlas.
- The application uses JWT for authentication and stores tokens in the browser.
- URLs must be valid HTTP or HTTPS addresses.
- Custom aliases are optional and must be alphanumeric with dashes/underscores.
- Analytics are based on user-agent parsing and IP geolocation, which may vary in accuracy.
- Old visit analytics are cleaned up automatically using TTL indexes.

## 🧾 Sample Output
### Example API Responses
- `POST /api/auth/signup` returns user data and JWT token.
- `POST /api/urls/shorten` returns the shortened URL, QR code URL, and metadata.
- `GET /api/analytics/:urlId` returns click counts, device/browser breakdown, geo stats, and daily trends.

### Example Data Entries
- Users collection stores hashed passwords and user profiles.
- URLs collection stores original URL, short code, alias, expiry date, click count, and QR code.
- Visits collection stores per-click analytics including device, browser, country, city, and timestamp.

### Example Evidence
- Screenshots of the dashboard, analytics page, and generated QR code.
- Server startup logs and successful API request logs.
- Database entries for URLs and visit analytics.

---

This project is a part of a hackathon run by https://katomaran.com

---

** This Project By: ✅ *This project is a part of a hackathon run by https://katomaran.com*

All features implemented. Fully documented. Ready to deploy.
