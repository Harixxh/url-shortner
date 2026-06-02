# Complete Frontend Setup

## Installation

```bash
cd frontend
npm install
```

## Environment Setup

```bash
cp .env.example .env
```

Edit `.env` and set your API URL:
```env
VITE_API_URL=http://localhost:5000/api
```

## Development

```bash
npm run dev
```

Frontend will run on http://localhost:3000

## Build for Production

```bash
npm run build
```

This generates a production build in the `dist/` folder.

## Project Structure

```
src/
├── components/        # Reusable components
│   ├── Header.jsx    # Navigation header
│   ├── Footer.jsx    # Footer with links
│   ├── LoadingSpinner.jsx
│   ├── ErrorMessage.jsx
│   └── SuccessMessage.jsx
├── pages/            # Page components
│   ├── Login.jsx
│   ├── Signup.jsx
│   ├── Dashboard.jsx
│   ├── CreateUrl.jsx
│   ├── MyUrls.jsx
│   ├── Analytics.jsx
│   └── NotFound.jsx
├── store/            # Zustand state management
│   ├── authStore.js  # Authentication state
│   └── urlStore.js   # URL management state
├── utils/            # Utility functions
│   ├── api.js        # Axios API client
│   └── helpers.js    # Common helpers
├── styles/           # CSS files
│   └── index.css     # Global Tailwind CSS
├── App.jsx           # Main App component
└── main.jsx          # Entry point
```

## Features

### Authentication
- User signup with validation
- User login with JWT
- Auto logout on 401
- Token stored in localStorage

### URL Shortening
- Create shortened URLs
- Custom alias support
- QR code generation
- Set expiry dates
- Metadata (title, description)

### Dashboard
- Summary statistics
- Top performing URLs
- Quick actions (copy, QR, analytics, delete)

### URL Management
- View all created URLs
- Paginated list
- Copy URLs
- View QR codes
- Delete URLs

### Analytics
- Total clicks
- Device breakdown (pie chart)
- Browser breakdown (bar chart)
- Geographic breakdown (bar chart)
- Daily click trends (line chart)
- Recent visit history (table)
- Configurable time periods (7/30/90 days)

## Component Details

### Pages

**Login**
- Email and password inputs
- Form validation
- Error handling
- Link to signup

**Signup**
- Name, email, password, confirm password
- Password validation
- Error handling
- Link to login

**Dashboard**
- Summary stats cards
- Top performing URLs list
- Quick actions
- Empty state

**CreateUrl**
- Original URL input
- Custom alias input
- Expiry date selector
- Title and description (optional)
- Success state with QR code
- Copy functionality

**MyUrls**
- Table with all URLs
- Pagination support
- Copy, QR, Analytics, Delete actions
- Empty state

**Analytics**
- Time period selector (7/30/90 days)
- Summary stats
- Multiple charts (Recharts)
- Recent visits table
- Device and browser analytics

### State Management (Zustand)

**authStore**
- User data
- Token management
- Signup/Login/Logout
- Error handling

**urlStore**
- URLs list
- Pagination
- Create/Read/Update/Delete
- Analytics data
- Dashboard summary

## Styling

- **Framework:** Tailwind CSS
- **Colors:** Primary blue, success green, error red, warning yellow
- **Components:** Cards, buttons (primary, secondary, danger), badges, inputs
- **Animations:** Fade, slide, spinner

## Dependencies

- `react` - UI library
- `react-router-dom` - Routing
- `axios` - HTTP client
- `zustand` - State management
- `recharts` - Charts and graphs
- `react-hot-toast` - Notifications
- `lucide-react` - Icons
- `tailwindcss` - CSS framework

## Linting & Formatting

```bash
npm run lint
npm run lint:fix
```

## Deployment

### Vercel (Recommended for Frontend)

```bash
npm install -g vercel
vercel
```

### Docker

```bash
docker build -f Dockerfile.frontend -t url-shortener-frontend .
docker run -p 3000:3000 url-shortener-frontend
```

### Manual

1. Build: `npm run build`
2. Deploy `dist/` folder to static hosting (Netlify, GitHub Pages, AWS S3)

## Performance Optimizations

- Code splitting via Vite
- Image optimization
- Lazy loading routes (recommended)
- Memoization for components
- Efficient state management with Zustand

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

### API not connecting?
- Check `VITE_API_URL` in `.env`
- Ensure backend is running on http://localhost:5000
- Check CORS settings in backend

### Routes not working?
- Verify all pages are imported in `App.jsx`
- Check route paths match
- Clear browser cache

### Styling issues?
- Rebuild with `npm run build`
- Clear `.vite` cache
- Check Tailwind CSS configuration

## Development Tips

1. **Hot Module Replacement (HMR):** Changes auto-refresh in dev
2. **React DevTools:** Install browser extension for debugging
3. **Network Tab:** Monitor API calls and responses
4. **Console Logs:** Use for debugging state changes
5. **Lighthouse:** Run in DevTools for performance metrics

---

**Ready to build and deploy! Follow the backend README for complete setup.**
