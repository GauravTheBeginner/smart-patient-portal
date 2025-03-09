
# Health Records Application

A full-stack application for managing health records with a React frontend and Express backend.

## Project Structure

```
/health-records-app
  /frontend       # React frontend application
  /backend        # Express backend API
  README.md       # Project documentation
  package.json    # Root package.json for managing both frontend and backend
```

## Setup Instructions

### Prerequisites
- Node.js (v14+)
- npm (v6+)

### Installation

1. Install dependencies for both frontend and backend
```
npm run install:all
```

### Development

To run both frontend and backend in development mode:
```
npm run dev
```

To run only the frontend:
```
npm run frontend
```

To run only the backend:
```
npm run backend
```

### Building for Production

```
npm run build
```

### Running in Production

```
npm start
```

## Environment Configuration

### Frontend Environment Variables
Create a `.env` file in the frontend directory with:
```
VITE_API_URL=http://localhost:3001/api
```

### Backend Environment Variables
Create a `.env` file in the backend directory with:
```
PORT=3001
DATABASE_URL="your-database-url"
JWT_SECRET="your-secure-jwt-secret"
```

## API Documentation

### Authentication Endpoints
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/signin` - Login a user

### Patient Endpoints
- `GET /api/patients/:id` - Get patient information

### Health Record Endpoints
- `GET /api/records/patient/:patientId` - Get all records for a patient
- `GET /api/records/:id` - Get a specific record
- `POST /api/records/:id/share` - Share a record with another user
- `POST /api/records/:id/revoke` - Revoke access to a shared record

### Profile Endpoints
- `GET /api/profile` - Get the current user's profile
- `PUT /api/profile` - Update the current user's profile
