# Exam Management System - Frontend

A modern, responsive exam management system built with React, Vite, and TailwindCSS. This application allows teachers to create and manage exams, and students to take exams and view their results.

## Features

### Authentication
- ✅ User signup with username, email, full name, password, and role (Teacher/Student)
- ✅ Login with username and password
- ✅ Session-based authentication with HTTP-only cookies
- ✅ Automatic session validation
- ✅ Role-based access control

### Exam Management (Teacher)
- ✅ Create MCQ (Multiple Choice Questions) and CQ (Creative Questions) exams
- ✅ Set exam details: title, course, duration, marks, passing marks
- ✅ Schedule exams with start and end date/time
- ✅ Add multiple questions with marks distribution
- ✅ Edit existing exams
- ✅ View all created exams
- ✅ Grade CQ submissions
- ✅ View exam statistics and submissions

### Exam Taking (Student)
- ✅ View available published exams
- ✅ Take MCQ and CQ exams
- ✅ Auto-grading for MCQ exams
- ✅ View exam results and feedback
- ✅ Track submission history

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **TailwindCSS** - Utility-first CSS framework
- **Context API** - State management
- **Fetch API** - HTTP client with cookie support

## Prerequisites

- Node.js 18+ and npm/yarn
- Backend server running at `http://localhost:8080` (Spring Boot)

## Installation

1. Clone the repository
```bash
git clone <repository-url>
cd exam_frontend
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
```bash
cp .env.example .env
```

Edit `.env` and set your backend API URL:
```
VITE_API_URL=http://localhost:8080/api
```

4. Start the development server
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Basic UI components (Button, Input, Card, etc.)
│   ├── landing/        # Landing page components
│   └── dashboard/      # Dashboard components
├── context/            # React Context providers
│   └── AuthContext.jsx # Authentication context
├── layouts/            # Layout components
│   ├── RootLayout.jsx  # Root layout with navbar
│   └── DashboardLayout.jsx # Dashboard layout
├── pages/              # Page components
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── Signup.jsx
│   └── dashboard/      # Dashboard pages
│       ├── CreateExam.jsx
│       ├── ExamList.jsx
│       ├── TakeExam.jsx
│       └── ...
├── services/           # API service layers
│   ├── api.js          # Base API configuration
│   ├── authService.js  # Authentication API
│   └── examService.js  # Exam management API
└── main.jsx           # App entry point
```

## API Integration

The frontend integrates with a Spring Boot backend API. All API requests:
- Use `credentials: 'include'` to send session cookies
- Handle structured error responses
- Convert dates to Unix timestamps (milliseconds)
- Send roles and statuses in uppercase

### Key API Endpoints

**Authentication:**
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

**Exams:**
- `POST /api/exams` - Create exam
- `GET /api/exams/my-exams` - Get teacher's exams
- `GET /api/exams/published` - Get available exams for students
- `POST /api/exams/{id}/submit` - Submit exam
- `POST /api/exams/submissions/{id}/grade` - Grade submission

## Testing

See [TESTING_GUIDE.md](./TESTING_GUIDE.md) for comprehensive testing instructions.

Quick start:
1. Start backend: `mvn spring-boot:run`
2. Start frontend: `npm run dev`
3. Create teacher account at `/signup`
4. Create exam at `/dashboard/exams/create`
5. Create student account and take the exam

## Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## Environment Variables

```bash
VITE_API_URL         # Backend API base URL (default: http://localhost:8080/api)
VITE_ENV             # Environment (development/production)
```

## Documentation

- [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) - Implementation details
- [TESTING_GUIDE.md](./TESTING_GUIDE.md) - Testing instructions with curl examples
- [API_REQUIREMENTS.md](./API_REQUIREMENTS.md) - Complete API specifications

## Key Features Implementation

### New Required Fields ✨
- **Course**: Course code/name for the exam
- **Passing Marks**: Minimum marks required to pass
- **Start DateTime**: When the exam becomes available
- **End DateTime**: When the exam closes
- **Exam Type**: MCQ or CQ (Creative Questions)
- **Status**: PUBLISHED, DRAFT, etc.

### Authentication
- Username-based login (not email)
- Role-based access (TEACHER/STUDENT in uppercase)
- Session cookie authentication
- Automatic session validation

### Data Format
- Timestamps in milliseconds (Unix timestamp * 1000)
- Roles: `TEACHER`, `STUDENT` (uppercase)
- Exam types: `MCQ`, `CQ` (uppercase)
- Question order: 1-based indexing
- Correct answer: actual answer string (not index)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License

## Support

For issues or questions, please open an issue on GitHub.

---

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
