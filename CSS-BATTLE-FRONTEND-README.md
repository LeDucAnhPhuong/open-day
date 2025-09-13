# CSS Battle Frontend

A modern frontend implementation for the CSS Battle platform featuring real-time battles, challenge management, and live chat functionality.

## 🚀 Features

### Core Functionality
- **Authentication System** - Login/Register with student ID
- **Challenge Management** - Browse, create, edit, and delete CSS challenges
- **Real-time Events** - Create and join battle events with live updates
- **Battle Arena** - Real-time CSS battles with Socket.IO
- **Live Chat** - In-battle communication between participants
- **Progressive Difficulty** - Easy, Medium, and Hard challenge levels
- **HP System** - Elimination-based battle mechanics

### Technical Features
- **Custom Hooks** - Clean API integration with React hooks
- **Real-time Socket** - WebSocket integration for live features
- **Type Safety** - Full TypeScript implementation
- **Modern UI** - Built with shadcn/ui and Tailwind CSS
- **Form Validation** - Zod schema validation with React Hook Form
- **Responsive Design** - Works on desktop and mobile devices

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern React component library
- **React Hook Form** - Performant form library
- **Zod** - Schema validation library
- **Socket.IO Client** - Real-time communication

### Backend Integration
- **NestJS API** - RESTful API integration
- **Socket.IO** - WebSocket connection for real-time features
- **JWT Authentication** - Secure token-based auth
- **MongoDB** - Database integration via API

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── challenges/         # Challenge management page
│   ├── events/            # Event creation and joining
│   ├── battle/            # Battle arena pages
│   └── css-battle/        # Demo homepage
├── components/            # React components
│   ├── auth/              # Authentication components
│   ├── challenges/        # Challenge management UI
│   ├── events/            # Event management UI
│   ├── battle/            # Battle arena and chat
│   ├── layout/            # Navigation and layout
│   └── ui/                # shadcn/ui components
├── hooks/                 # Custom React hooks
│   ├── useAuth.ts         # Authentication hook
│   ├── useChallenges.ts   # Challenge management
│   ├── useEvents.ts       # Event management
│   └── useSocket.ts       # Real-time communication
├── lib/                   # Utility libraries
│   ├── api-client.ts      # HTTP client wrapper
│   └── utils.ts           # Common utilities
└── types/                 # TypeScript definitions
    └── api.ts             # API response types
```

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ installed
- CSS Battle Backend running on localhost:4000

### Installation

1. **Clone and install dependencies**
   ```bash
   cd css-battle-frontend
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local`:
   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
   NEXT_PUBLIC_SOCKET_URL=ws://localhost:4000
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

## 📖 API Integration

### Authentication Endpoints
- `POST /auth/register` - User registration
- `POST /auth/login` - User authentication  
- `GET /auth/users` - Get all users (admin only)

### Challenge Management
- `GET /challenges` - List challenges (with optional level filter)
- `GET /challenges/:id` - Get specific challenge
- `POST /challenges` - Create challenge (admin only)
- `PUT /challenges/:id` - Update challenge (admin only)
- `DELETE /challenges/:id` - Delete challenge (admin only)

### Event Management
- `POST /events` - Create event (admin only)
- `POST /events/join` - Join event with code
- `GET /events/:id/members` - Get event members
- `PATCH /events/:id/toggle-status` - Toggle event status

### WebSocket Events (Socket.IO)
- `chat:send` / `chat:new` - Live chat messaging
- `battle:action` - Start battle
- `battle:update` - Submit solution
- `battle:end_stage` - End current stage (host only)
- `battle:create` - New challenge assignment
- `battle:result` - Battle results update
- `battle:submit` - Time to submit notification

## 🎮 How to Use

### For Students

1. **Register/Login**
   - Use your student ID (format: 2 letters + 6 digits)
   - Register with your full name

2. **Browse Challenges**
   - View available challenges by difficulty
   - Filter by Easy, Medium, or Hard levels

3. **Join Events**
   - Get event code from instructor
   - Join battle arena for real-time competition
   - Chat with other participants during battles

### For Administrators

1. **Manage Challenges**
   - Create new challenges with image URLs
   - Set difficulty levels (Easy/Medium/Hard)
   - Edit or delete existing challenges

2. **Host Events**
   - Create events with time slots
   - Start battles and manage rounds
   - Control battle progression and elimination

## 🔧 Custom Hooks Usage

### Authentication
```typescript
const { user, login, register, logout, isAuthenticated } = useAuth();

// Login
await login({ studentId: 'de180914', password: 'password' });

// Register
await register({ studentId: 'de180914', name: 'John Doe' });
```

### Challenge Management
```typescript
const { challenges, createChallenge, updateChallenge, deleteChallenge } = useChallenges(token);

// Create challenge
await createChallenge({
  image: 'https://example.com/image.png',
  level: ChallengeLevel.EASY
});
```

### Real-time Socket
```typescript
const { isConnected, sendChatMessage, onBattleCreate, onChatMessage } = useSocket(token, true);

// Send chat message
sendChatMessage('Hello everyone!', eventCode);

// Listen for battle updates
onBattleCreate((data) => {
  console.log('New challenge:', data.challenge);
});
```

## 🎨 UI Components

### Forms
- `LoginForm` - User authentication
- `RegisterForm` - User registration  
- `ChallengeForm` - Challenge creation/editing
- `CreateEventForm` - Event creation
- `JoinEventForm` - Event joining

### Lists & Cards
- `ChallengesList` - Challenge grid with filtering
- `ChallengeCard` - Individual challenge display

### Battle Components
- `BattleArena` - Main battle interface
- `ChatBox` - Real-time chat functionality

### Layout
- `Navigation` - App navigation with auth state
- `AuthModal` - Authentication modal dialog
- `UserProfileDropdown` - User menu

## 🌐 Environment Variables

```env
# Required
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000  # Backend API URL
NEXT_PUBLIC_SOCKET_URL=ws://localhost:4000      # WebSocket URL

# Optional
NODE_ENV=development                            # Environment mode
```

## 🛡️ Security Features

- **JWT Token Management** - Secure token storage and refresh
- **Input Validation** - Zod schema validation on all forms
- **Role-based Access** - Admin-only features properly protected
- **XSS Protection** - Safe rendering of user content
- **CSRF Protection** - Secure API communication

## 🚀 Deployment

### Build for Production
```bash
npm run build
npm start
```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Follow TypeScript best practices
2. Use the existing custom hooks for API calls
3. Follow the established component structure
4. Add proper error handling and loading states
5. Maintain responsive design principles

## 📝 Notes

- This is a frontend implementation showcasing modern React patterns
- Real-time features require the backend Socket.IO server
- All forms include proper validation and error handling
- Components are designed to be reusable and maintainable
- The project demonstrates full-stack integration with NestJS backend

## 🐛 Common Issues

### Socket Connection Issues
- Ensure backend is running on correct port
- Check CORS configuration in backend
- Verify WebSocket URL in environment variables

### Authentication Issues  
- Check JWT token expiration
- Verify API base URL configuration
- Ensure backend authentication endpoints are working

### Build Issues
- Clear `.next` folder and rebuild
- Check all dependencies are installed
- Verify environment variables are set correctly