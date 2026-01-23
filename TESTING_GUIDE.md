# Testing Guide - Exam Management System

This guide provides step-by-step instructions for testing the authentication and exam creation features with the Spring Boot backend.

## Prerequisites

- Backend server running at `http://localhost:8080`
- Frontend running at `http://localhost:5173` (or your configured port)
- curl installed (for API testing)

---

## 1. Start the Backend Server

```bash
cd /path/to/backend
mvn spring-boot:run
```

Wait for the server to start successfully before proceeding.

---

## 2. User Registration (Signup)

### A. Create a Teacher Account

#### Using curl:
```bash
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -c teacher_cookies.txt \
  -d '{
    "username": "teacher1",
    "password": "pass123",
    "email": "teacher@uni.edu",
    "fullName": "Professor Smith",
    "role": "TEACHER"
  }'
```

#### Using Frontend:
1. Navigate to: `http://localhost:5173/signup`
2. Fill in the form:
   - **Username**: `teacher1`
   - **Full Name**: `Professor Smith`
   - **Email**: `teacher@uni.edu`
   - **Password**: `pass123`
   - **Confirm Password**: `pass123`
   - **Role**: Click "👨‍🏫 Teacher"
   - Check "I agree to the terms"
3. Click "Create Account"
4. You should be redirected to the dashboard

### B. Create a Student Account

#### Using curl:
```bash
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -c student_cookies.txt \
  -d '{
    "username": "student1",
    "password": "pass123",
    "email": "student@uni.edu",
    "fullName": "John Doe",
    "role": "STUDENT"
  }'
```

#### Using Frontend:
1. Logout if logged in (click profile icon → Logout)
2. Navigate to: `http://localhost:5173/signup`
3. Fill in the form:
   - **Username**: `student1`
   - **Full Name**: `John Doe`
   - **Email**: `student@uni.edu`
   - **Password**: `pass123`
   - **Confirm Password**: `pass123`
   - **Role**: Click "🎓 Student"
   - Check "I agree to the terms"
4. Click "Create Account"

---

## 3. User Login

### A. Login as Teacher

#### Using curl:
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -c teacher_cookies.txt \
  -d '{
    "username": "teacher1",
    "password": "pass123"
  }'
```

#### Using Frontend:
1. Navigate to: `http://localhost:5173/login`
2. Enter credentials:
   - **Username**: `teacher1`
   - **Password**: `pass123`
3. Click "Sign In"
4. Verify you're redirected to the teacher dashboard

### B. Login as Student

#### Using curl:
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -c student_cookies.txt \
  -d '{
    "username": "student1",
    "password": "pass123"
  }'
```

#### Using Frontend:
1. Logout if logged in
2. Navigate to: `http://localhost:5173/login`
3. Enter credentials:
   - **Username**: `student1`
   - **Password**: `pass123`
4. Click "Sign In"
5. Verify you're redirected to the student dashboard

---

## 4. Create Exam (Teacher Only)

### A. Create MCQ Exam

#### Using curl:

First, get the current timestamp for startDateTime and calculate endDateTime (1 hour later):

```bash
# For macOS/Linux
START_TIME=$(date +%s000)
END_TIME=$(($(date +%s) * 1000 + 3600000))

curl -X POST http://localhost:8080/api/exams \
  -H "Content-Type: application/json" \
  -b teacher_cookies.txt \
  -d "{
    \"title\": \"Introduction to Programming - Final Exam\",
    \"course\": \"CS101\",
    \"examType\": \"MCQ\",
    \"durationMinutes\": 60,
    \"totalMarks\": 20,
    \"passingMarks\": 12,
    \"startDateTime\": $START_TIME,
    \"endDateTime\": $END_TIME,
    \"status\": \"PUBLISHED\",
    \"description\": \"Final exam covering all topics from the semester\",
    \"questions\": [
      {
        \"type\": \"MCQ\",
        \"questionText\": \"What is 2 + 2?\",
        \"options\": [\"3\", \"4\", \"5\", \"6\"],
        \"correctAnswer\": \"4\",
        \"marks\": 10,
        \"questionOrder\": 1
      },
      {
        \"type\": \"MCQ\",
        \"questionText\": \"What is the capital of France?\",
        \"options\": [\"London\", \"Berlin\", \"Paris\", \"Madrid\"],
        \"correctAnswer\": \"Paris\",
        \"marks\": 10,
        \"questionOrder\": 2
      }
    ]
  }"
```

#### Using Frontend:
1. Login as teacher
2. Navigate to: `http://localhost:5173/dashboard/exams/create`
3. Fill in the exam details:
   - **Exam Type**: Click "MCQ Exam"
   - **Exam Title**: `Introduction to Programming - Final Exam`
   - **Course**: `CS101`
   - **Description**: `Final exam covering all topics from the semester`
   - **Duration**: `60` (minutes)
   - **Total Marks**: `20`
   - **Passing Marks**: `12`
   - **Start Date**: Today's date
   - **Start Time**: Current time or a future time
   - **End Date**: Today's date or tomorrow
   - **End Time**: At least 1 hour after start time
4. Click "Add Question" button
5. Fill in first question:
   - **Question**: `What is 2 + 2?`
   - **Marks**: `10`
   - **Option 1**: `3`
   - **Option 2**: `4` (select as correct)
   - **Option 3**: `5`
   - **Option 4**: `6`
6. Click "Add Question" to add the question
7. Repeat for second question:
   - **Question**: `What is the capital of France?`
   - **Marks**: `10`
   - **Option 1**: `London`
   - **Option 2**: `Berlin`
   - **Option 3**: `Paris` (select as correct)
   - **Option 4**: `Madrid`
8. Click "Publish Exam"
9. Verify exam is created successfully

### B. Create CQ Exam

#### Using curl:

```bash
START_TIME=$(date +%s000)
END_TIME=$(($(date +%s) * 1000 + 7200000))  # 2 hours later

curl -X POST http://localhost:8080/api/exams \
  -H "Content-Type: application/json" \
  -b teacher_cookies.txt \
  -d "{
    \"title\": \"Data Structures - Midterm\",
    \"course\": \"CS201\",
    \"examType\": \"CQ\",
    \"durationMinutes\": 120,
    \"totalMarks\": 50,
    \"passingMarks\": 30,
    \"startDateTime\": $START_TIME,
    \"endDateTime\": $END_TIME,
    \"status\": \"PUBLISHED\",
    \"description\": \"Midterm exam on data structures and algorithms\",
    \"questions\": [
      {
        \"type\": \"CQ\",
        \"questionText\": \"Explain the difference between a stack and a queue. Provide real-world examples for each.\",
        \"marks\": 25,
        \"questionOrder\": 1
      },
      {
        \"type\": \"CQ\",
        \"questionText\": \"Write an algorithm to implement binary search. Analyze its time complexity.\",
        \"marks\": 25,
        \"questionOrder\": 2
      }
    ]
  }"
```

#### Using Frontend:
1. Login as teacher
2. Navigate to: `http://localhost:5173/dashboard/exams/create`
3. Fill in the exam details:
   - **Exam Type**: Click "CQ Exam"
   - **Exam Title**: `Data Structures - Midterm`
   - **Course**: `CS201`
   - **Description**: `Midterm exam on data structures and algorithms`
   - **Duration**: `120` (minutes)
   - **Total Marks**: `50`
   - **Passing Marks**: `30`
   - **Start Date**: Today's date
   - **Start Time**: Current time
   - **End Date**: Today's date or tomorrow
   - **End Time**: At least 2 hours after start time
4. Add creative questions (no options needed):
   - **Question 1**: `Explain the difference between a stack and a queue. Provide real-world examples for each.`
   - **Marks**: `25`
   - **Question 2**: `Write an algorithm to implement binary search. Analyze its time complexity.`
   - **Marks**: `25`
5. Click "Publish Exam"

---

## 5. View Exams

### A. Teacher View (My Exams)

#### Using curl:
```bash
curl -X GET http://localhost:8080/api/exams/my-exams \
  -H "Content-Type: application/json" \
  -b teacher_cookies.txt
```

#### Using Frontend:
1. Login as teacher
2. Navigate to: `http://localhost:5173/dashboard/exams`
3. View list of all exams you created

### B. Student View (Available Exams)

#### Using curl:
```bash
curl -X GET http://localhost:8080/api/exams/published \
  -H "Content-Type: application/json" \
  -b student_cookies.txt
```

#### Using Frontend:
1. Login as student
2. Navigate to: `http://localhost:5173/dashboard/exams/available`
3. View list of all published exams

### C. Get Exam Details

#### Using curl:
```bash
# Replace {examId} with actual exam ID from previous responses
curl -X GET http://localhost:8080/api/exams/{examId}?includeQuestions=true \
  -H "Content-Type: application/json" \
  -b teacher_cookies.txt
```

#### Using Frontend:
1. Click on any exam card to view details
2. Verify all exam information and questions are displayed

---

## 6. Submit Exam (Student)

### A. Submit MCQ Exam

#### Using curl:
```bash
# Replace {examId} with actual exam ID
curl -X POST http://localhost:8080/api/exams/{examId}/submit \
  -H "Content-Type: application/json" \
  -b student_cookies.txt \
  -d '{
    "answers": [
      {
        "questionId": "question-id-1",
        "selectedAnswer": "4"
      },
      {
        "questionId": "question-id-2",
        "selectedAnswer": "Paris"
      }
    ]
  }'
```

#### Using Frontend:
1. Login as student
2. Navigate to available exams
3. Click "Take Exam" on an MCQ exam
4. Answer all questions
5. Click "Submit Exam"
6. View your results (auto-graded for MCQ)

### B. Submit CQ Exam

#### Using curl:
```bash
# Replace {examId} with actual exam ID
curl -X POST http://localhost:8080/api/exams/{examId}/submit \
  -H "Content-Type: application/json" \
  -b student_cookies.txt \
  -d '{
    "answers": [
      {
        "questionId": "question-id-1",
        "answerText": "A stack follows LIFO (Last In First Out) principle..."
      },
      {
        "questionId": "question-id-2",
        "answerText": "Binary search algorithm: 1. Start with sorted array..."
      }
    ]
  }'
```

#### Using Frontend:
1. Login as student
2. Navigate to available exams
3. Click "Take Exam" on a CQ exam
4. Write answers in text areas
5. Click "Submit Exam"
6. Wait for teacher to grade

---

## 7. Grade Submissions (Teacher)

### A. View Submissions

#### Using curl:
```bash
# Replace {examId} with actual exam ID
curl -X GET http://localhost:8080/api/exams/{examId}/submissions \
  -H "Content-Type: application/json" \
  -b teacher_cookies.txt
```

#### Using Frontend:
1. Login as teacher
2. Navigate to: `http://localhost:5173/dashboard/exams`
3. Click on an exam
4. Click "View Submissions" tab
5. View all student submissions

### B. Grade CQ Submission

#### Using curl:
```bash
# Replace {submissionId} with actual submission ID
curl -X POST http://localhost:8080/api/exams/submissions/{submissionId}/grade \
  -H "Content-Type: application/json" \
  -b teacher_cookies.txt \
  -d '{
    "grades": [
      {
        "questionId": "question-id-1",
        "marksAwarded": 20,
        "feedback": "Good explanation of stack and queue"
      },
      {
        "questionId": "question-id-2",
        "marksAwarded": 23,
        "feedback": "Excellent algorithm and time complexity analysis"
      }
    ],
    "feedback": "Well done overall!"
  }'
```

#### Using Frontend:
1. Login as teacher
2. Navigate to exam submissions
3. Click on a pending CQ submission
4. Enter marks for each question
5. Add feedback (optional)
6. Click "Submit Grade"

---

## 8. Logout

#### Using curl:
```bash
curl -X POST http://localhost:8080/api/auth/logout \
  -H "Content-Type: application/json" \
  -b teacher_cookies.txt
```

#### Using Frontend:
1. Click on profile icon in top right
2. Click "Logout"
3. Verify redirect to home page

---

## Common Issues & Troubleshooting

### Issue: CORS Errors
**Solution**: Ensure backend CORS configuration allows `http://localhost:5173` (or your frontend port)

### Issue: Cookie Not Saved
**Solution**: 
- Check that backend sends cookies with `SameSite=None` and `Secure=true` for HTTPS
- For local development, use `SameSite=Lax` and `Secure=false`
- Ensure `credentials: 'include'` is set in frontend API calls (already configured)

### Issue: 401 Unauthorized
**Solution**: 
- Ensure you're logged in
- Check that session cookies are being sent
- Verify backend session configuration

### Issue: 403 Forbidden (Student trying to create exam)
**Solution**: This is expected - only teachers can create exams. Login with teacher account.

### Issue: Validation Errors (400 Bad Request)
**Solution**: Check that:
- All required fields are filled
- Start date/time is before end date/time
- Total marks equals sum of question marks
- Passing marks ≤ total marks
- MCQ questions have exactly 4 options

### Issue: Exam Not Appearing in Student View
**Solution**: 
- Verify exam status is "PUBLISHED"
- Check that start date/time has passed
- Ensure student is logged in

---

## Testing Checklist

- [ ] Teacher signup with username, email, fullName, password, role=TEACHER
- [ ] Student signup with username, email, fullName, password, role=STUDENT
- [ ] Teacher login with username and password
- [ ] Student login with username and password
- [ ] Create MCQ exam with all required fields (course, passingMarks, startDateTime, endDateTime, examType)
- [ ] Create CQ exam with all required fields
- [ ] View teacher's exams
- [ ] View available exams as student
- [ ] Submit MCQ exam
- [ ] Submit CQ exam
- [ ] View submissions as teacher
- [ ] Grade CQ submission
- [ ] Logout

---

## Notes

1. **Session Management**: The frontend uses `credentials: 'include'` to send cookies with every request. The backend should set session cookies on login/signup.

2. **Date/Time Format**: The frontend converts date and time inputs to Unix timestamps (milliseconds) before sending to backend.

3. **Role Handling**: Roles are sent as uppercase strings (`TEACHER`, `STUDENT`) to match backend enum values.

4. **Exam Status**: Exams are automatically published with status `PUBLISHED` by default.

5. **Question Order**: Questions are numbered starting from 1 (1-based indexing) in the backend.

6. **Correct Answer Format**: For MCQ questions, the correct answer is sent as the actual answer string (not the index).

---

## API Base URL Configuration

The frontend uses the following environment variable for API base URL:
```
VITE_API_URL=http://localhost:8080/api
```

Create a `.env` file in the frontend root if needed:
```
VITE_API_URL=http://localhost:8080/api
```
