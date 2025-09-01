# Parking Reservation System - Interview Assessment

A full-stack parking management application built with React, TypeScript, and Node.js. This project demonstrates real-time WebSocket communication, state management, and admin dashboard functionality.

## 🚀 Features

### Core Functionality

- **Real-time Parking Management**: Live updates via WebSocket connections
- **Admin Dashboard**: Comprehensive control panel for system management
- **Gate Operations**: Check-in/check-out functionality for visitors and subscribers
- **Zone Management**: Dynamic zone status and capacity tracking
- **Category Rate Management**: Flexible pricing for different parking categories
- **Rush Hour & Vacation Management**: Special rate periods configuration

### Technical Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS
- **State Management**: Zustand, TanStack Query (React Query)
- **Real-time Communication**: WebSocket
- **Backend**: Node.js

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd parking
```

### 2. Backend Setup

```bash
cd backend
npm install
npm start
```

The backend server will start on `http://localhost:3000`

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend application will start on `http://localhost:5173`

### 4. Access the Application

- **Main Application**: http://localhost:5173
- **Admin Dashboard**: http://localhost:5173/admin
- **API Documentation**: Available in `backend/API_DOC.md`

## 🔐 Authentication

### Default Admin Credentials

- **Username**: `admin`
- **Password**: `admin123`

### Default Employee Credentials

- **Username**: `employee`
- **Password**: `employee123`

## 🏗️ Project Structure

```
parking/
├── backend/                 # Node.js + Express server
│   ├── server.js           # Main server file
│   ├── seed.json           # Initial data
│   └── API_DOC.md          # API documentation
├── frontend/               # React + TypeScript application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API and WebSocket services
│   │   ├── store/          # Zustand state stores
│   │   └── types/          # TypeScript type definitions
│   └── package.json
└── README.md
```

## 🔧 Key Fixes Implemented

### Admin WebSocket Connectivity Issue

**Problem**: The admin dashboard was not receiving real-time updates, and the `admin-update` WebSocket event was not triggering.

**Root Causes Identified**:

1. Missing WebSocket connection initialization in admin pages
2. No admin subscription system in the backend
3. Broken event flow between frontend and backend

**Solutions Implemented**:

1. Backend Admin Subscription System

- **File**: `backend/server.js`
- **Fix**: Implemented admin client tracking with `adminSubs` Set

```javascript
const adminSubs = new Set();

// Handle admin subscriptions
} else if (m.type === "subscribe-admin") {
  adminSubs.add(ws);
} else if (m.type === "unsubscribe-admin") {
  adminSubs.delete(ws);
}
```

#### 3. Frontend Admin Event Subscription

- **File**: `frontend/src/hooks/useAdminQueries.ts`
- **Fix**: Added proper admin subscription handling in `useWebSocketAdminUpdate`

```typescript
const handleConnectionChange = (data: { status: string }) => {
  if (data.status === "connected") {
    wsService.subscribeAdmin();
  }
};
```

## 🧪 Testing

### Automated Tests

To run the frontend tests, navigate to the `frontend` directory and execute:

```bash
npm test
```

### Manual Verification Steps

Follow these steps to manually verify the application's functionality, especially the WebSocket updates:

1.  **Start Backend and Frontend**: Ensure both the backend (`npm start` in `backend/`) and frontend (`npm run dev` in `frontend/`) are running.

2.  **Login as Admin**: Open your browser to `http://localhost:5173/admin` and log in with the default admin credentials:

    - **Username**: `admin`
    - **Password**: `admin123`

3.  **Monitor Admin Dashboard**: Navigate to the "dashboard" tab in the Admin Dashboard. You should see the "Recent Activity" section at the bottom. This section will display real-time logs of admin actions.

4.  **Perform Admin Actions & Observe Updates**:

    - **Update Category Rate**: Go to "Control" -> "Category Rates". Change a category's normal or special rate and save. Observe a new entry appearing in "Recent Activity" (e.g., "category-update on category [id]").
    - **Toggle Zone Open/Close**: Go to "Control" -> "Zones". Toggle a zone's "Open" status. Observe a new entry in "Recent Activity" (e.g., "zone-update on zone [id]").
    - **Add Rush Hour/Vacation**: Go to "Control" -> "Rush Hours" or "Vacations" and add a new entry. Observe a new entry in "Recent Activity" (e.g., "rush-hour-add on rushHour [id]").

5.  **Test Gate Screen & WebSocket Subscription (Employee)**:
    - Open a **new Incognito/Private window** in your browser.
    - Navigate to a gate, e.g., `http://localhost:5173/gate/gate1`. You will automatically be subscribed to this gate's updates.
    - **Important**: Keep the browser's developer console open in this window (F12) and monitor the "Console" and "Network" (WebSocket tab) for `wsService` messages.
    - **Perform a Check-in (Visitor)**:
      - Select an available parking zone (e.g., Zone A).
      - Click the "Check In" button. A ticket modal should appear.
    - **Perform a Check-in (Subscriber)**:
      - Switch to the "Subscriber" tab.
      - Enter a valid subscription ID (e.g., `sub1`).
      - Select a parking zone valid for the subscriber's category (e.g., Zone A, if `sub1` is for `cat1`).
      - Click the "Check In" button. A ticket modal should appear.

By following these steps, you can verify that the WebSocket connections are established, events are being broadcasted and received, and the UI is updating in real-time across different roles and actions.

## 📝 Notes

### Backend Limitations

- **In-memory Database**: Data is not persisted between server restarts
