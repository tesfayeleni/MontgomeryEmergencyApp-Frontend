# Frontend React Application

**Version:** 1.0.0  
**Framework:** React 18  
**UI Library:** Ant Design 5.x  
**Status:** Production-Ready

A responsive React application providing dual-interface dashboards for emergency management and citizen engagement. Features real-time data visualization, interactive maps, and role-based access control.

## 🚀 Quick Setup

### Prerequisites
- Node.js 14+
- Backend API running (http://localhost:8000)

### Installation
```bash
# Install dependencies
npm install

# Configure API endpoint (optional - defaults provided)
echo "REACT_APP_API_URL=http://localhost:8000" > .env
```

### Run Development Server
```bash
npm start
```

**Opens automatically at:** http://localhost:3000

## 🏗️ Architecture

### Core Components
- **App.js:** Main router with authentication guards
- **contexts/AuthContext.js:** JWT authentication state management
- **pages/:** Route-based page components
- **services/api.js:** Axios HTTP client with interceptors
- **gov_dashboard/:** Government-specific UI components
- **citizen_app/:** Citizen-facing UI components

### Key Technologies
- **React 18:** Modern component-based UI framework
- **React Router 6:** Client-side routing with protected routes
- **Ant Design:** Enterprise UI component library
- **Axios:** HTTP client with request/response interceptors
- **Mapbox GL JS:** Interactive mapping and visualization
- **Chart.js/Recharts:** Data visualization and charting
- **CSS Modules:** Scoped styling for components

## 👥 User Interfaces

### Government Dashboard (`/gov`)
**Roles:** police_admin, fire_admin, emergency_manager

#### Components
- **RiskMap:** Zone-based heatmap with real-time risk scores
- **ForecastPanel:** 6-hour demand predictions with charts
- **SignalAlerts:** Real-time intelligence signals and alerts
- **CapacityPanel:** Resource availability and utilization metrics

#### Features
- Live data updates every 30 seconds
- Interactive zone selection and filtering
- Export capabilities for reports
- Manual agent execution controls

### Citizen Application (`/citizen`)
**Roles:** resident, business_owner, event_organizer

#### Components
- **PublicFeed:** Community safety alerts and news
- **CitizenReportForm:** Non-emergency issue submission
- **EventSubmissionForm:** Large event notifications (event organizers)
- **RiskMapSimplified:** Basic safety overview map

#### Features
- Geolocation-based reporting
- Real-time feed updates
- Role-specific form variations
- Mobile-responsive design

## 🔐 Authentication Flow

### Login Process
1. User enters credentials on login page
2. JWT token stored in localStorage
3. User role determines dashboard access
4. Automatic token refresh and validation

### Route Protection
- **Public Routes:** `/login`, `/register`
- **Protected Routes:** `/gov` (government only), `/citizen` (all authenticated)
- **Role-based Redirects:** Automatic routing based on user permissions

## 📊 Data Visualization

### Maps
- **Mapbox Integration:** Custom tile layers and markers
- **Zone Boundaries:** GeoJSON polygon overlays
- **Risk Heatmaps:** Color-coded risk visualization
- **Interactive Popups:** Zone details on click

### Charts
- **Forecast Charts:** Time-series demand predictions
- **Capacity Gauges:** Resource utilization indicators
- **Signal Timelines:** Historical alert tracking
- **Responsive Design:** Mobile-optimized layouts

## 🔧 Configuration

### Environment Variables (.env)
```bash
# API Configuration
REACT_APP_API_URL=http://localhost:8000

# Map Configuration
REACT_APP_MAPBOX_TOKEN=your-mapbox-token

# Feature Flags
REACT_APP_ENABLE_DEBUG=false
```

### Build Configuration
```json
// package.json build scripts
{
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  }
}
```

## 🧪 Testing

### Automated Tests
```bash
# Run test suite
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in CI mode
npm test -- --watchAll=false
```

### Manual Testing
```bash
# Build for production
npm run build

# Serve production build locally
npx serve -s build
```

### Test Accounts
```
Government: admin@montgomery.gov / admin123
Citizen: resident@example.com / resident123
Event Org: event@example.com / event123
Business: business@example.com / business123
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Docker Deployment
```bash
# Build image
docker build -t montgomery-frontend .

# Run container
docker run -p 3000:80 montgomery-frontend
```

### Static Hosting
- **Netlify:** Drag & drop `build/` folder
- **Vercel:** Connect GitHub repository
- **AWS S3 + CloudFront:** Static website hosting
- **nginx:** Serve static files with reverse proxy

### Production Checklist
- [ ] Set `REACT_APP_API_URL` to production backend
- [ ] Configure Mapbox token for maps
- [ ] Enable service worker for caching
- [ ] Set up error monitoring (Sentry)
- [ ] Configure analytics tracking
- [ ] Test on multiple browsers/devices

## 📱 Responsive Design

### Breakpoints
- **Mobile:** < 768px
- **Tablet:** 768px - 1024px
- **Desktop:** > 1024px

### Mobile Optimizations
- Touch-friendly interface elements
- Optimized map controls for mobile
- Collapsible navigation menus
- Swipe gestures for data views

## 🔄 State Management

### Authentication Context
```javascript
const { user, login, logout, isAuthenticated } = useAuth();
```

### API Integration
```javascript
import { api } from '../services/api';

// Automatic JWT token handling
const response = await api.get('/api/risk');
```

### Real-time Updates
- Polling-based data refresh
- WebSocket support (future enhancement)
- Background sync for offline capability

## 🎨 Styling

### CSS Modules
- Scoped component styles
- Dynamic class names
- Theme variable support

### Ant Design Theme
```javascript
// Custom theme configuration
const theme = {
  primaryColor: '#1890ff',
  borderRadius: 4,
};
```

## 📈 Performance

### Optimizations
✅ Code splitting with React.lazy  
✅ Image optimization and lazy loading  
✅ Bundle analysis and tree shaking  
✅ Service worker caching  
✅ CDN asset delivery  

### Bundle Size
- **Development:** ~2.5MB (uncompressed)
- **Production:** ~400KB (gzipped)
- **Vendor chunks:** Separated for caching

## 🆘 Troubleshooting

### Common Issues
- **API Connection:** Check REACT_APP_API_URL
- **Map Loading:** Verify Mapbox token
- **Authentication:** Clear localStorage and relogin
- **Build Errors:** Delete node_modules and reinstall

### Debug Mode
```bash
# Enable debug logging
REACT_APP_ENABLE_DEBUG=true npm start
```

## 📚 Dependencies

### Core
- react: ^18.2.0
- react-dom: ^18.2.0
- react-router-dom: ^6.20.0

### UI & Styling
- antd: ^5.11.0
- @ant-design/icons: ^5.2.6

### HTTP & Data
- axios: ^1.6.0

### Maps & Charts
- mapbox-gl: ^2.15.0
- chart.js: ^4.4.0
- recharts: ^2.8.0

### Utils
- dayjs: ^1.11.10
- lodash: ^4.17.21

---

**Development Server:** http://localhost:3000  
**Production Build:** `npm run build`  
**Version:** 1.0.0
