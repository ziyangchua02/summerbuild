# SkillSwap System Architecture

## Overview

SkillSwap is a React-based skill exchange platform where users can view profiles, connect with others, and chat in real-time.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT SIDE                              │
│                                                                 │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐          │
│  │  Web        │    │  React      │    │  Vite       │          │ 
│  │  Browser    │◄──►│  Frontend   │◄──►│  Dev Server │          │
│  └─────────────┘    └─────────────┘    └─────────────┘          │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                React Components                         │    │
│  │                                                         │    │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐     │    │
│  │  │  Home   │  │Explore  │  │ Profile │  │  Chat   │     │    │
│  │  └─────────┘  └─────────┘  └─────────┘  └─────────┘     │    │
│  │                                                         │    │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐     │    │
│  │  │ Navbar  │  │ Banner  │  │HowItWorks│ │ChatList │     │    │
│  │  └─────────┘  └─────────┘  └─────────┘  └─────────┘     │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                Context Providers                        │    │
│  │                                                         │    │
│  │  ┌─────────────────┐    ┌─────────────────┐             │    │
│  │  │  AuthContext    │    │ ProfileContext  │             │    │
│  │  │  - User auth    │    │ - User profile  │             │    │
│  │  │  - Login state  │    │ - Profile data  │             │    │
│  │  └─────────────────┘    └─────────────────┘             │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                                │
                                │ HTTP/WebSocket
                                ▼
┌──────────────────────────────────────────────────────────────┐
│                        SERVER SIDE                           │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │                    Supabase                            │  │
│  │                                                        │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │  │
│  │  │    Auth     │  │ PostgreSQL  │  │  Real-time  │     │  │
│  │  │   Service   │  │  Database   │  │   Engine    │     │  │
│  │  │             │  │             │  │             │     │  │
│  │  │ - JWT       │  │ - profiles  │  │ - WebSocket │     │  │
│  │  │ - Sessions  │  │ - messages  │  │ - Live chat │     │  │
│  │  │ - Users     │  │ - convos    │  │ - Updates   │     │  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘     │  │
│  │                                                        │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │  │
│  │  │     API     │  │     RLS     │  │   Storage   │     │  │
│  │  │   Gateway   │  │  Policies   │  │   (Images)  │     │  │
│  │  │             │  │             │  │             │     │  │
│  │  │ - REST API  │  │ - Security  │  │ - Profile   │     │  │
│  │  │ - GraphQL   │  │ - Access    │  │   pics      │     │  │
│  │  │ - Auto-gen  │  │ - Control   │  │ - Assets    │     │  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘     │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

## Data Flow

```
User Action → React Component → Context → Supabase Client → API → Database
                                  ↓
Real-time Updates ← WebSocket ← Supabase Real-time ← Database Changes
```

## Key Features

- **Authentication**: User registration and login via Supabase Auth
- **Profile Management**: Users can view and edit their profiles
- **Skill Discovery**: Browse other users' skills and connect
- **Real-time Chat**: Telegram-style messaging with live updates
- **Responsive Design**: Works on desktop and mobile devices

## Technology Stack

### Frontend

- React 18 with Vite
- React Router for navigation
- Context API for state management
- CSS for styling

### Backend

- Supabase (PostgreSQL + services)
- Real-time subscriptions
- Row-level security (RLS)
- JWT authentication

### Database Schema

- `profiles`: User profile information
- `conversations`: Chat conversations between users
- `messages`: Individual chat messages
- `auth.users`: User authentication data

## Security

- Row-level security policies
- JWT token authentication
- Secure API endpoints
- Input validation and sanitization
