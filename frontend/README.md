
# Smart Patient Portal

A modern health records management system that allows patients to securely store, manage, and share their health records.

## Project Overview

This application consists of:
- **Frontend**: React with TypeScript, Tailwind CSS, and shadcn/ui
- **Backend**: Express.js with TypeScript and Prisma ORM
- **Database**: PostgreSQL

## Prerequisites

- Node.js (v16 or later)
- npm or yarn
- PostgreSQL database

## Getting Started

### Setting up the Database

1. Install and set up PostgreSQL on your system
2. Create a new database named `health_records_db`
3. Configure the database connection in `backend/.env`

### Backend Setup

1. Navigate to the backend directory:
   ```sh
   cd backend
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Set up environment variables by creating a `.env` file in the backend directory:
   ```
   PORT=5000
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/health_records_db"
   JWT_SECRET="your-secret-key-for-jwt-authentication"
   ```
   > Note: Replace the database connection string and JWT secret with your own values

4. Generate Prisma client:
   ```sh
   npx prisma generate
   ```

5. Run database migrations:
   ```sh
   npx prisma migrate dev --name init
   ```

6. Start the backend server:
   ```sh
   npm run dev
   ```
   or
   ```sh
   npx ts-node start.ts
   ```

### Frontend Setup

1. Navigate to the project root directory (if you're in the backend directory, go back with `cd ..`)

2. Install dependencies:
   ```sh
   npm install
   ```

3. Start the development server:
   ```sh
   npm run dev
   ```

4. The application will be available at `http://localhost:8080`

## Project Structure

### Frontend

- `/src`: Source files for the React application
  - `/components`: Reusable UI components
  - `/contexts`: React context providers
  - `/hooks`: Custom React hooks
  - `/pages`: Page components
  - `/utils`: Utility functions

### Backend

- `/backend`: Source files for the Express backend
  - `/controllers`: API route controllers
  - `/middleware`: Express middleware
  - `/prisma`: Prisma schema and migrations
  - `/routes`: API route definitions
  - `/lib`: Utility functions and services

## API Endpoints

### Authentication
- `POST /api/auth/signup`: Create a new user account
- `POST /api/auth/signin`: Sign in to an existing account

### Patients
- `GET /api/patients`: List all patients
- `POST /api/patients`: Create a new patient
- `GET /api/patients/:id`: Get a specific patient
- `PUT /api/patients/:id`: Update a patient
- `DELETE /api/patients/:id`: Delete a patient

### Health Records
- `GET /api/records`: List all health records
- `POST /api/records`: Create a new health record
- `GET /api/records/:id`: Get a specific health record
- `PUT /api/records/:id`: Update a health record
- `DELETE /api/records/:id`: Delete a health record
- `POST /api/records/:id/share`: Share a health record

## Development

### Backend Scripts
- `npm run dev`: Start the development server with hot reloading
- `npm run build`: Build the TypeScript code
- `npm start`: Start the production server

### Frontend Scripts
- `npm run dev`: Start the development server
- `npm run build`: Build the application for production
- `npm run preview`: Preview the production build

## License

[MIT](LICENSE)
