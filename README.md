# Campus Study Hub 🎓

A study group matching and management platform for campus students. Find and join study sessions based on subject, location, and time.

**4SA3 Course Project**

## ✨ Key Features

- **🔍 Session Discovery**: Filter by subject, tags, date, and location
- **📍 Location-Based Search**: Explore nearby sessions with map and list views
- **👥 Session Management**: Create study sessions and manage join requests
- **✅ Approval System**: Hosts can approve or reject participation requests
- **📅 Schedule Planning**: Filter sessions based on your availability
- **🎯 Smart Ranking**: Sort sessions by distance, relevance, or time

## 🛠️ Tech Stack

### Frontend

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **UI**: React 19
- **Styling**: Tailwind CSS 4
- **Components**: shadcn/ui (Radix UI based)
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React

### Backend

- **Runtime**: Node.js
- **API**: Next.js API Routes
- **Database**: PostgreSQL (ready for integration)
- **Authentication**: Cookie-based session

### Architecture Patterns

- **Repository Pattern**: Data access abstraction
- **Strategy Pattern**: Multiple ranking algorithms
- **Factory Pattern**: Geocoding and Ranking strategy creation
- **Mediator Pattern**: Session search and filtering coordination

## 📁 Project Structure

```
campus-study-hub/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── auth/                 # Authentication (login, signup, logout)
│   │   ├── sessions/             # Session CRUD and search
│   │   └── participants/         # Participant management
│   ├── create/                   # Create session page
│   ├── discover/                 # Discover sessions page
│   ├── my-sessions/              # My sessions management
│   ├── profile/                  # Profile page
│   └── sessions/[id]/manage/     # Session management (approve participants)
├── components/                   # React components
│   ├── ui/                       # shadcn/ui components
│   ├── auth-form.tsx             # Authentication form
│   ├── create-session-form.tsx   # Session creation form
│   ├── session-card.tsx          # Session card component
│   ├── session-filters.tsx       # Filter UI
│   └── session-map.tsx           # Map view
├── lib/                          # Business logic
│   ├── auth/                     # Authentication logic
│   ├── geocoding/                # Location processing
│   ├── ranking/                  # Ranking algorithms
│   ├── repository/               # Data access layer
│   ├── mediator/                 # Session search coordination
│   └── types.ts                  # TypeScript type definitions
├── scripts/                      # Database scripts
│   ├── 001-create-schema.sql    # Schema creation
│   └── 002-seed-data.sql        # Seed data
└── public/                       # Static files
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or higher
- pnpm (recommended) or npm
- PostgreSQL (for production)

### Installation

1. Clone the repository

```bash
git clone <repository-url>
cd campus-study-hub
```

2. Install dependencies

```bash
pnpm install
# or
npm install
```

3. Set up environment variables (optional)

```bash
# Create .env.local file
# DATABASE_URL=postgresql://user:password@localhost:5432/campus_study_hub
# GOOGLE_MAPS_API_KEY=your_api_key_here
```

4. Run the development server

```bash
pnpm dev
# or
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Database Setup (for Production)

To use PostgreSQL database:

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE campus_study_hub;

# Run schema
\i scripts/001-create-schema.sql

# Insert seed data (optional)
\i scripts/002-seed-data.sql
```

## 📝 Key Components & Libraries

### UI Components

- **Form Components**: Input, Select, Textarea, Checkbox, Radio
- **Navigation**: Sidebar, Navigation Menu, Breadcrumb
- **Feedback**: Toast, Alert, Dialog, Alert Dialog
- **Data Display**: Card, Table, Badge, Avatar
- **Layout**: Accordion, Tabs, Collapsible, Resizable

### Business Logic

#### Ranking Strategies

- **DistanceRanking**: Sort by distance from user location
- **RelevanceRanking**: Sort by search query relevance
- **TimeRanking**: Sort by session start time

#### Geocoding Providers

- **GoogleMapsProvider**: Uses Google Maps API
- **MockProvider**: Mock provider for development

#### Repository Pattern

- **SessionRepository**: Manages session data
- **ParticipantRepository**: Manages participant data

## 🔧 Build & Deploy

### Production Build

```bash
pnpm build
pnpm start
```

### Linting

```bash
pnpm lint
```

## 🎨 Design System

- **CSS Framework**: Tailwind CSS 4
- **Component Library**: shadcn/ui
- **Design Tokens**: CSS Variables
- **Theme**: Light/Dark mode support (next-themes)
- **Typography**: Geist font

## 📊 Data Models

### User

- id, email, name, createdAt

### StudySession

- id, hostId, subject, tags, date, startTime, endTime
- capacity, location (address, lat, lng), description

### SessionParticipant

- id, sessionId, userId, status (pending/approved/rejected)
- requestedAt, respondedAt

## 🔐 Authentication

Currently uses simple cookie-based session authentication.
For production, consider:

- NextAuth.js
- Clerk
- Auth0
- Supabase Auth

## 🗺️ Roadmap

- [ ] PostgreSQL database integration
- [ ] Enhanced real-time map view (Google Maps/Mapbox)
- [ ] Push notifications (for approval/rejection)
- [ ] Chat functionality
- [ ] Session reviews and ratings
- [ ] Calendar integration
- [ ] Mobile app (React Native)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is an academic project for 4SA3 course.

## 👨‍💻 Developer

**Kyoungjae Shin**  
McMaster University - 4SA3 Project

## 📞 Contact

If you have any questions or suggestions about this project, please create an issue.

---

**Built with ❤️ using Next.js and TypeScript**
