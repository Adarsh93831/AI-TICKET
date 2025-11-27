# AI Ticket Frontend

A modern React frontend for the AI-powered ticket management system, built with Vite, Tailwind CSS, and Zustand.

## Features

- **🔐 Authentication**: Google OAuth integration
- **🎨 Modern UI**: Clean, responsive design with Tailwind CSS
- **📱 Mobile First**: Fully responsive across all devices
- **⚡ Fast**: Built with Vite for lightning-fast development
- **🗃️ State Management**: Zustand for simple and efficient state management
- **🎯 TypeScript Ready**: Easy migration to TypeScript
- **🔧 Component Library**: Reusable components with Headless UI
- **📊 Dashboard**: Comprehensive ticket overview and management
- **👤 User Management**: Profile management and skills tracking
- **🛡️ Role-Based Access**: Different views for users, moderators, and admins

## Tech Stack

- **React 19** - UI Library
- **Vite** - Build Tool
- **Tailwind CSS** - Styling
- **Zustand** - State Management
- **React Router** - Navigation
- **Axios** - HTTP Client
- **Lucide React** - Icons
- **React Hot Toast** - Notifications
- **Headless UI** - Accessible UI Components

## Pages & Features

### User Features
- **Login Page**: Google OAuth authentication
- **Dashboard**: Ticket overview with stats and search
- **Create Ticket**: Form to create new tickets with AI processing
- **Ticket Details**: View individual ticket information
- **Profile**: Manage contact information

### Moderator Features
- **Dashboard**: View all tickets or tickets assigned to you
- **Assigned Tickets Page**: Dedicated view for tickets assigned to you
- **Moderator Panel**: Ticket management and overview
- **Profile**: Manage skills and contact information

### Admin Features
- **Admin Panel**: User management and system overview
- **User Management**: Edit user roles, skills, and permissions
- **Ticket Monitoring**: View all tickets across the system
- **Dashboard**: All moderator features plus user management

### Components
- **Layout**: Responsive sidebar navigation
- **Protected Routes**: Role-based access control
- **Loading States**: Smooth loading indicators
- **Error Boundary**: Graceful error handling
- **Toast Notifications**: User feedback system

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd AI-TICKET/Frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout.jsx      # Main layout with navigation
│   ├── ProtectedRoute.jsx # Route protection
│   ├── Loading.jsx     # Loading components
│   └── ErrorBoundary.jsx # Error handling
├── pages/              # Page components
│   ├── LoginPage.jsx   # Authentication
│   ├── DashboardPage.jsx # Main dashboard
│   ├── CreateTicketPage.jsx # Ticket creation
│   ├── TicketDetailPage.jsx # Ticket details
│   ├── AssignedTicketsPage.jsx # Assigned tickets view
│   ├── ProfilePage.jsx # User profile
│   ├── AdminPage.jsx   # Admin panel
│   └── UnauthorizedPage.jsx # Access denied
├── services/           # API services
│   ├── api.js         # API endpoints
│   └── axios.js       # HTTP client configuration
├── store/             # Zustand stores
│   ├── useAuthStore.js # Authentication state
│   ├── useTicketStore.js # Ticket management
│   └── useUserStore.js # User management
├── utils/             # Utility functions
│   ├── constants.js   # App constants
│   └── helpers.js     # Helper functions
├── App.jsx            # Main app component
├── main.jsx          # Entry point
└── index.css         # Global styles
```

## State Management

The app uses Zustand for state management with three main stores:

### AuthStore
- User authentication status
- Login/logout functionality  
- User profile management
- Skills and contact information

### TicketStore
- Ticket CRUD operations
- Ticket filtering and search
- Current ticket state

### UserStore (Admin)
- User management
- Role assignment
- User listing

## Styling

The project uses Tailwind CSS with:
- Custom color palette
- Responsive design utilities
- Component-based styling
- Dark mode ready (can be implemented)

## API Integration

All API calls are centralized in the `services/api.js` file with:
- Automatic cookie-based authentication
- Error handling
- Request/response interceptors
- Timeout configuration

## Authentication Flow

1. User clicks "Login with Google"
2. Redirected to backend OAuth endpoint
3. After successful authentication, redirected back to app
4. Frontend checks authentication status
5. User gains access to protected routes

## Error Handling

- **Error Boundary**: Catches React errors
- **API Errors**: Centralized error handling
- **Loading States**: Smooth UX during operations
- **Toast Notifications**: User feedback

## Building for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API URL | `http://localhost:5000/api` |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable  
5. Submit a pull request

## License

This project is licensed under the MIT License.
