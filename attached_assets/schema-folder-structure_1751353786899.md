# Discord Bot Manager - Project Structure Schema

## 📁 Root Directory Structure

```
Discord-Bot-Manager/
├── 📁 client/                     # Frontend React Application
│   ├── 📁 src/
│   │   ├── 📁 components/         # Reusable UI Components
│   │   │   ├── 📁 ui/            # shadcn/ui components
│   │   │   ├── activity-log.tsx   # Bot activity monitoring
│   │   │   ├── bot-control-center.tsx  # Central bot management
│   │   │   ├── bot-status-card.tsx     # Bot status display
│   │   │   ├── discord-message-preview.tsx  # Message preview
│   │   │   ├── message-template-editor.tsx  # Template editor
│   │   │   └── sidebar.tsx        # Navigation sidebar
│   │   ├── 📁 hooks/             # Custom React hooks
│   │   │   ├── use-discord-bots.ts    # Bot management hook
│   │   │   ├── use-mobile.tsx     # Mobile detection
│   │   │   └── use-toast.ts       # Toast notifications
│   │   ├── 📁 lib/               # Utility libraries
│   │   │   ├── discord-utils.ts   # Discord-specific utilities
│   │   │   ├── queryClient.ts     # API client configuration
│   │   │   └── utils.ts           # General utilities
│   │   ├── 📁 pages/             # Application pages
│   │   │   ├── dashboard.tsx      # Main dashboard
│   │   │   ├── control-center.tsx # Bot control center
│   │   │   ├── bot-config.tsx     # Bot configuration
│   │   │   ├── auto-poster.tsx    # Auto posting setup
│   │   │   ├── auto-responder.tsx # Auto response rules
│   │   │   ├── multi-account.tsx  # Multi-account management
│   │   │   ├── analytics.tsx      # Performance analytics
│   │   │   ├── templates.tsx      # Message templates
│   │   │   └── not-found.tsx      # 404 page
│   │   ├── App.tsx               # Main application component
│   │   ├── main.tsx              # Application entry point
│   │   └── index.css             # Global styles & Discord theme
│   └── index.html                # HTML template
├── 📁 server/                    # Backend Express Application
│   ├── 📁 services/             # Business logic services
│   │   ├── discord-bot.ts        # Discord bot management
│   │   └── scheduler.ts          # Auto-posting scheduler
│   ├── index.ts                  # Server entry point
│   ├── routes.ts                 # API route definitions
│   ├── storage.ts                # Data storage layer
│   └── vite.ts                   # Vite integration
├── 📁 shared/                    # Shared code between client/server
│   └── schema.ts                 # Database schemas & types
├── 📁 Configuration Files
│   ├── package.json              # Dependencies & scripts
│   ├── vite.config.ts            # Vite build configuration
│   ├── tailwind.config.ts        # Tailwind CSS configuration
│   ├── tsconfig.json             # TypeScript configuration
│   ├── components.json           # shadcn/ui configuration
│   ├── drizzle.config.ts         # Database ORM configuration
│   └── postcss.config.js         # PostCSS configuration
└── 📁 Documentation
    ├── replit.md                 # Project overview & architecture
    └── schema-folder-structure.md # This file

```

## 🏗️ Architecture Overview

### Frontend Structure (client/)
- **React 18** with TypeScript for type safety
- **Wouter** for lightweight client-side routing
- **TanStack Query** for server state management
- **shadcn/ui** components with Radix UI primitives
- **Tailwind CSS** with custom Discord theme

### Backend Structure (server/)
- **Express.js** REST API with TypeScript
- **Discord.js** for Discord bot integration
- **Cron** for scheduled message posting
- **In-memory storage** for development (MemStorage)

### Key Components Explanation

#### 🎛️ Control Center (NEW FEATURE)
- **Location**: `client/src/components/bot-control-center.tsx`
- **Purpose**: Centralized bot management with start/stop controls
- **Features**:
  - Start All / Stop All buttons
  - Individual bot controls
  - Real-time status monitoring
  - Statistics dashboard

#### 🤖 Bot Management
- **Services**: `server/services/discord-bot.ts`
- **Features**: Bot lifecycle, message handling, auto-responses
- **API Endpoints**: `/api/bots/{id}/start`, `/api/bots/{id}/stop`

#### 📅 Scheduler System
- **Service**: `server/services/scheduler.ts`
- **Purpose**: Automated message posting with cron jobs
- **Supports**: Flexible intervals (seconds, minutes, hours, days)

#### 💾 Storage Layer
- **Interface**: `server/storage.ts` (IStorage interface)
- **Implementation**: MemStorage for in-memory data
- **Tables**: bots, auto_poster_configs, auto_responder_rules, activity_logs, templates

## 🎨 UI Theme Structure

### Discord-Inspired Design
- **Colors**: Dark theme with Discord blue (#5865F2)
- **Components**: Glass effects, hover animations
- **Typography**: Clean, modern fonts with proper hierarchy
- **Icons**: Lucide React icons throughout

### Component Categories
1. **Layout**: Sidebar navigation, responsive design
2. **Forms**: Bot configuration, rule setup
3. **Data Display**: Status cards, activity logs, analytics
4. **Controls**: Start/stop buttons, bulk operations
5. **Feedback**: Toast notifications, loading states

## 📊 Data Flow

```
User Action → Frontend Component → API Request → Backend Route → Service Layer → Storage → Response → UI Update
```

## 🔄 Recent Additions (June 30, 2025)

### ✅ Completed Features
- Bot Control Center with centralized management
- Start All / Stop All functionality
- Individual bot start/stop controls
- Real-time status indicators
- Enhanced navigation with Control Center
- Discord-themed UI improvements
- Type-safe storage implementation

### 🎯 Key Benefits
- **Single Control Point**: Manage all bots from one location
- **Bulk Operations**: Start/stop multiple bots efficiently
- **Visual Feedback**: Clear status indicators and statistics
- **Responsive Design**: Works on desktop and mobile
- **Type Safety**: Full TypeScript implementation