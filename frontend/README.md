# Dam_YET Frontend

A comprehensive research management portal frontend built with React, TypeScript, and Tailwind CSS.

## Features

- **Authentication System**
  - User registration with file uploads (avatar & cover image)
  - Login with email/password
  - Google OAuth integration
  - Protected routes
  - Token-based authentication with refresh

- **User Management**
  - Profile completion flow
  - Avatar and cover image updates
  - Password management
  - Account settings

- **Research Management**
  - Paper management (Scholar API integration + manual uploads)
  - Project tracking
  - Patent management
  - Group organization
  - Star/favorite system

- **Admin Features**
  - User statistics
  - Paper analytics
  - Year-wise reports

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit
- **Routing**: React Router v6
- **Forms**: React Hook Form + Zod validation
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp .env.example .env.local
```

3. Update environment variables in `.env.local`:
```
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id_here
REACT_APP_API_BASE_URL=http://localhost:8000/api/v1
```

4. Start development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── auth/           # Authentication components
│   └── ui/             # UI components
├── pages/              # Page components
├── hooks/              # Custom hooks
├── services/           # API services
├── store/              # Redux store
├── types/              # TypeScript types
├── utils/              # Utility functions
└── App.tsx             # Main app component
```

## API Integration

The frontend integrates with the Dam_YET backend API:

- **Base URL**: `/api/v1`
- **Authentication**: JWT tokens with refresh mechanism
- **File Uploads**: Multipart form data for images and PDFs
- **Error Handling**: Centralized error handling with user-friendly messages

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Environment Variables

- `REACT_APP_GOOGLE_CLIENT_ID` - Google OAuth client ID
- `REACT_APP_API_BASE_URL` - Backend API base URL
- `REACT_APP_ENV` - Environment (development/production)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
