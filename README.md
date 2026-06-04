# URL Shortener with Analytics 🔗

A production-grade URL Shortener platform with advanced analytics, QR code generation, custom aliases, and real-time tracking.

Built as part of the Katomaran Full Stack Hackathon.

---

# 🚀 Live Demo

Frontend:
https://url-shortner-teal-tau.vercel.app/

Backend:
https://url-shortner-vat6.onrender.com

Demo Video:
https://youtube.com/YOUR_VIDEO_LINK

(Replace with your actual YouTube or Loom link)

---

# 📖 Project Overview

This project allows authenticated users to:

* Create short URLs
* Generate QR codes
* Track link performance
* View click analytics
* Monitor browser/device usage
* View geolocation insights
* Manage all links from a centralized dashboard

The goal of this project is to demonstrate full-stack engineering skills including:

* Authentication
* Database Design
* REST APIs
* Analytics Tracking
* Frontend Dashboard Development
* Deployment

---

# ✨ Features

## Mandatory Features

### Authentication

* User Signup
* User Login
* JWT Authentication
* Protected Routes
* User-specific URL management

### URL Shortening

* Create short URLs
* Unique short code generation
* URL validation
* Redirect to original URL
* Copy URL functionality

### Dashboard

* View all shortened URLs
* Original URL
* Short URL
* Created Date
* Total Clicks
* Delete URL

### Analytics

* Click Count
* Last Visited Time
* Recent Visit History
* Analytics Dashboard

---

## Bonus Features Implemented

### Custom Alias

Users can create branded short URLs.

Example:

https://domain.com/github

instead of

https://domain.com/abc123

### QR Code Generation

Every short URL automatically generates a QR code.

### Expiry Dates

Links can expire automatically after a selected date.

### Device Analytics

Tracks:

* Desktop
* Mobile
* Tablet

### Browser Analytics

Tracks:

* Chrome
* Firefox
* Safari
* Edge
* Opera

### Geolocation Analytics

Tracks:

* Country
* City

### Daily Click Trends

Displays daily click growth using charts.

---

# 🏗️ System Architecture

```text
User Browser
      │
      ▼
React Frontend (Vercel)
      │
Axios API Requests
      │
      ▼
Node.js Express Backend (Render)
      │
      ▼
MongoDB Atlas
 ├── Users
 ├── URLs
 └── Visits
```

---

# 🤖 AI Planning Document

## Step 1: Requirement Analysis

Analyzed the hackathon requirements.

Identified:

* Mandatory Features
* Bonus Features
* Technical Constraints

---

## Step 2: System Design

Designed:

* Authentication Flow
* URL Shortening Flow
* Analytics Tracking Flow

---

## Step 3: Database Design

Created:

### User Collection

Stores:

* Name
* Email
* Password Hash

### URL Collection

Stores:

* Original URL
* Short Code
* Alias
* Click Count
* QR Code

### Visit Collection

Stores:

* Device
* Browser
* Country
* City
* Timestamp

---

## Step 4: Frontend Planning

Pages Designed:

* Landing Page
* Login
* Signup
* Dashboard
* Create URL
* Analytics Page

---

## Step 5: Analytics Design

Implemented:

* Click Tracking
* Device Tracking
* Browser Tracking
* Country Tracking
* Daily Trend Analytics

---

## Step 6: Deployment

Frontend:

* Vercel

Backend:

* Render

Database:

* MongoDB Atlas

---

# 🛠️ Tech Stack

## Frontend

* React.js
* Vite
* Zustand
* Axios
* Tailwind CSS
* Recharts
* Framer Motion

## Backend

* Node.js
* Express.js

## Database

* MongoDB Atlas
* Mongoose

## Authentication

* JWT
* BcryptJS

## Deployment

* Vercel
* Render

---

# 📂 Project Structure

```text
URL-Shortener/
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── store/
│   │   ├── utils/
│   │   └── App.jsx
│
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   └── server.js
│
└── README.md
```

---

# 🔌 API Endpoints

## Authentication

```http
POST /api/auth/signup
POST /api/auth/login
GET  /api/auth/me
POST /api/auth/logout
```

## URLs

```http
POST   /api/urls/shorten
GET    /api/urls
GET    /api/urls/:id
PUT    /api/urls/:id
DELETE /api/urls/:id
```

## Analytics

```http
GET /s/:shortCode
GET /api/analytics/:urlId
GET /api/analytics/dashboard/summary
```

---

# 📊 Sample Analytics Output

```json
{
  "clickCount": 125,
  "lastVisited": "2026-06-03T10:15:00Z",
  "countries": {
    "India": 80,
    "USA": 25,
    "Germany": 20
  },
  "devices": {
    "Desktop": 60,
    "Mobile": 55,
    "Tablet": 10
  }
}
```

---

# 🗄️ Sample Database Records

## Users Collection

```json
{
  "_id": {
    "$oid": "6a1fc28cfd560d737c6f1512"
  },
  "name": "Harish",
  "email": "harishmkr88@gmail.com",
  "password": "$2a$12$2fo/NAqxSzsPzS.QqMGgG./fZi266jMYMPOFHHQrZfpb6OtxfdstG",
  "isActive": true,
  "createdAt": {
    "$date": "2026-06-03T05:58:36.259Z"
  },
  "updatedAt": {
    "$date": "2026-06-03T05:58:36.259Z"
  },
  "__v": 0
}
```

## URLs Collection

```json

{
  "userId": {
    "$oid": "6a1fc28cfd560d737c6f1512"
  },
  "originalUrl": "http://110.172.151.102/LMS/index.html",
  "shortCode": "M4NzLDO",
  "customAlias": "portal",
  "clickCount": 4,
  "isActive": true,
  "metadata": {
    "tags": []
  },
  "createdAt": {
    "$date": "2026-06-03T08:10:14.155Z"
  },
  "updatedAt": {
    "$date": "2026-06-03T10:21:53.077Z"
  },
  "__v": 0,
  "lastClickedAt": {
    "$date": "2026-06-03T10:21:53.076Z"
  }
}
```

## Visits Collection

```json
{
  "_id": {
    "$oid": "6a1fe175c0e898123ecdd2f3"
  },
  "urlId": {
    "$oid": "6a1fe166c0e898123ecdd2ed"
  },
  "browser": "Chrome",
  "device": "Desktop",
  "os": "Windows",
  "country": "IN",
  "city": "Coimbatore",
  "ipHash": "650834cc6736d670086e4d46ce7d4f2b3fd07e10ac4d7a270037b9396ed2521c",
  "referrer": null,
  "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36",
  "visitedAt": {
    "$date": "2026-06-03T08:10:29.862Z"
  },
  "__v": 0
}
```

---

# 📜 Sample Server Logs

```bash
MongoDB Connected Successfully

Server running on port 5000

POST /api/auth/login 200

POST /api/urls/shorten 201

GET /s/abc123 302

Analytics Updated

Country: India
Browser: Chrome
Device: Desktop
```

---

# 📸 Screenshots

## Landing Page

Add:

docs/landing-page.png

## Dashboard

Add:

docs/dashboard.png

## Create url

Add:

docs/create-url.png

## My url Code

Add:

docs/my-url.png

## Analytics

Add:

docs/analytics-page

---

# 🔐 Security Features

* JWT Authentication
* Password Hashing using BcryptJS
* Input Validation
* URL Validation
* CORS Protection
* Helmet Security Headers
* Soft Delete Support

---

# ⚡ Performance Optimizations

* MongoDB Indexing
* Atomic Click Counter Updates
* Aggregation Pipelines
* Efficient Analytics Queries
* Optimized React State Management

---

# 🧠 AI Tools Used

## GitHub Copilot

Used for:

* React Components
* CRUD Operations
* API Integration

## ChatGPT

Used for:

* Architecture Planning
* Database Design
* UI/UX Improvements
* README Documentation

---


# 🧪 Local Setup

## Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/url-shortener.git
cd url-shortener
```

## Backend Setup

```bash
cd backend

npm install

npm run dev
```

## Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

---

# 🧾 Assumptions Made

* User has Node.js installed
* User has MongoDB Atlas connection string
* URLs must be valid HTTP or HTTPS URLs
* Custom aliases are unique
* Geolocation data accuracy depends on IP lookup services
* Analytics data is stored for reporting purposes

---



---

# 📄 License

MIT License

---

This project is a part of a hackathon run by https://katomaran.com
