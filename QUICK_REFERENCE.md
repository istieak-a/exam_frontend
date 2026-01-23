# Quick Reference - Backend API Integration

## 🚀 Quick Start

```bash
# 1. Start backend
mvn spring-boot:run

# 2. Start frontend (in another terminal)
npm run dev

# 3. Access app at http://localhost:5173
```

## 🔐 Authentication

### Signup (Teacher)
```bash
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "username": "teacher1",
    "password": "pass123",
    "email": "teacher@uni.edu",
    "fullName": "Professor Smith",
    "role": "TEACHER"
  }'
```

### Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "username": "teacher1",
    "password": "pass123"
  }'
```

## 📝 Create Exam

### MCQ Exam (Auto-graded)
```bash
curl -X POST http://localhost:8080/api/exams \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "title": "Test Exam",
    "course": "CS101",
    "examType": "MCQ",
    "durationMinutes": 60,
    "totalMarks": 10,
    "passingMarks": 6,
    "startDateTime": '$(date +%s000)',
    "endDateTime": '$(($(date +%s) * 1000 + 3600000))',
    "status": "PUBLISHED",
    "questions": [{
      "type": "MCQ",
      "questionText": "What is 2+2?",
      "options": ["3", "4", "5", "6"],
      "correctAnswer": "4",
      "marks": 10,
      "questionOrder": 1
    }]
  }'
```

### CQ Exam (Manual grading)
```bash
curl -X POST http://localhost:8080/api/exams \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "title": "Essay Exam",
    "course": "CS201",
    "examType": "CQ",
    "durationMinutes": 120,
    "totalMarks": 50,
    "passingMarks": 30,
    "startDateTime": '$(date +%s000)',
    "endDateTime": '$(($(date +%s) * 1000 + 7200000))',
    "status": "PUBLISHED",
    "questions": [{
      "type": "CQ",
      "questionText": "Explain binary search algorithm",
      "marks": 25,
      "questionOrder": 1
    }]
  }'
```

## 📊 Key Field Mappings

| Frontend Field | Backend Field | Format |
|---------------|---------------|---------|
| username | username | string |
| fullName | fullName | string |
| role | role | TEACHER/STUDENT (uppercase) |
| duration | durationMinutes | integer |
| startDate + startTime | startDateTime | milliseconds timestamp |
| endDate + endTime | endDateTime | milliseconds timestamp |
| question.text | questionText | string |
| question.correctAnswer | correctAnswer | answer string (not index) |
| - | status | PUBLISHED (default) |
| - | questionOrder | 1-based index |

## ✨ New Required Fields

All these fields are now properly implemented:

- ✅ **course** - Course code/name
- ✅ **passingMarks** - Minimum marks to pass
- ✅ **startDateTime** - Unix timestamp in milliseconds
- ✅ **endDateTime** - Unix timestamp in milliseconds
- ✅ **examType** - MCQ or CQ (uppercase)
- ✅ **status** - PUBLISHED, DRAFT, etc. (uppercase)

## 🎯 Frontend Routes

- `/signup` - User registration
- `/login` - User login
- `/dashboard` - User dashboard (redirects based on role)
- `/dashboard/exams` - Teacher: My exams
- `/dashboard/exams/create` - Teacher: Create exam
- `/dashboard/exams/available` - Student: Available exams
- `/dashboard/exams/take/:id` - Student: Take exam

## 🔧 Configuration

Create `.env` file:
```
VITE_API_URL=http://localhost:8080/api
```

## 🐛 Common Issues

### CORS Error
**Fix**: Backend must allow `http://localhost:5173`

### 401 Unauthorized
**Fix**: Ensure cookies are being sent (`credentials: 'include'` - already configured)

### Validation Error
**Check**:
- All required fields present
- Start time < End time
- Total marks = Sum of question marks
- Passing marks ≤ Total marks

## 📦 Data Flow

```
Frontend Form
    ↓
examService.createExam()
    ↓
formatExamPayload()
    ↓ Converts:
    - role → UPPERCASE
    - dates → timestamps
    - questions → proper format
    ↓
API POST /api/exams
    ↓ with credentials: 'include'
Backend validates & saves
    ↓
Response with created exam
    ↓
Frontend updates UI
```

## 🎓 Testing Flow

1. **Teacher**: Signup → Login → Create Exam → View Submissions
2. **Student**: Signup → Login → View Exams → Take Exam → View Result
3. **Teacher**: Grade CQ submissions

## 📝 Notes

- Session cookies handled automatically
- All timestamps in milliseconds
- Roles must be uppercase
- Question order starts from 1
- MCQ correctAnswer is the actual answer text
