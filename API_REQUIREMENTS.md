# Exam Management System - API Requirements

## Overview
This document outlines the complete API requirements for implementing the Exam Creation and Management features in the exam management system. The backend is being developed using Java Spring Boot.

---

## Feature: Create/Edit Exam

### Business Flow

1. **Teacher initiates exam creation/editing**
   - Teacher navigates to Create Exam page or Edit Exam page (with exam ID in URL query parameter)
   - Frontend loads existing exam data if in edit mode

2. **Teacher selects exam type**
   - Two types: MCQ (Multiple Choice Questions) or CQ (Creative Questions)
   - MCQ exams have auto-grading capability
   - CQ exams require manual grading by teacher

3. **Teacher fills exam details**
   - Basic information: title, course, description
   - Timing: duration (in minutes), start date/time, end date/time
   - Scoring: total marks, passing marks

4. **Teacher adds questions**
   - For MCQ: question text, marks, 4 options, correct answer selection
   - For CQ: question text, marks only
   - Can add multiple questions
   - Can remove questions
   - Questions are stored temporarily in frontend state

5. **Teacher publishes or updates exam**
   - Creates new exam OR updates existing exam
   - All exam details and questions are sent together in single transaction

---

## Required API Endpoints

### 1. Create Exam
**Endpoint:** `POST /api/exams`

**Purpose:** Create a new exam with all details and questions

**Authentication:** Required (Teacher only)

**Request Body Structure:**
```
{
  "examType": "MCQ" or "CQ",
  "title": "string (required)",
  "course": "string (required)",
  "description": "string (optional)",
  "duration": integer (minutes, required),
  "totalMarks": integer (required),
  "passingMarks": integer (required),
  "startDateTime": "ISO 8601 datetime string (required)",
  "endDateTime": "ISO 8601 datetime string (required)",
  "questions": [
    {
      "text": "string (required)",
      "marks": integer (required),
      "type": "MCQ" or "CQ",
      "options": ["string array - 4 items for MCQ, empty for CQ"],
      "correctAnswer": integer (0-3 for MCQ option index, null for CQ)
    }
  ]
}
```

**Business Rules:**
- Teacher must be authenticated and authorized
- startDateTime must be before endDateTime
- totalMarks must equal sum of all question marks
- passingMarks must be less than or equal to totalMarks
- MCQ questions must have exactly 4 options
- MCQ questions must have correctAnswer between 0-3
- CQ questions should not have options or correctAnswer
- All required fields must be present and valid

**Success Response:**
- Status Code: 201 Created
- Response Body:
```
{
  "id": "string/UUID",
  "message": "Exam created successfully",
  "examData": {
    ... (echo back the created exam with generated ID and timestamps)
  }
}
```

**Error Responses:**
- 400 Bad Request: Validation errors (missing fields, invalid data)
- 401 Unauthorized: User not authenticated
- 403 Forbidden: User is not a teacher
- 500 Internal Server Error: Server-side issues

---

### 2. Update Exam
**Endpoint:** `PUT /api/exams/{examId}`

**Purpose:** Update existing exam with all details and questions

**Authentication:** Required (Teacher who created the exam)

**Path Parameters:**
- examId: UUID/string identifier of the exam

**Request Body Structure:** Same as Create Exam

**Business Rules:**
- All rules from Create Exam apply
- Only the teacher who created the exam can update it
- Cannot update exam if students have already started taking it (check submission status)
- If exam has submissions, provide warning but allow update (or block based on business decision)
- Updating questions will replace all existing questions

**Success Response:**
- Status Code: 200 OK
- Response Body:
```
{
  "id": "string/UUID",
  "message": "Exam updated successfully",
  "examData": {
    ... (updated exam data)
  }
}
```

**Error Responses:**
- 400 Bad Request: Validation errors
- 401 Unauthorized: User not authenticated
- 403 Forbidden: User doesn't own this exam
- 404 Not Found: Exam doesn't exist
- 409 Conflict: Exam has active submissions (if blocking updates)
- 500 Internal Server Error: Server-side issues

---

### 3. Get Exam Details (for editing)
**Endpoint:** `GET /api/exams/{examId}`

**Purpose:** Retrieve exam details with all questions for editing or viewing

**Authentication:** Required (Teacher who created it, or students for viewing)

**Path Parameters:**
- examId: UUID/string identifier

**Query Parameters:**
- includeQuestions: boolean (default true) - whether to include questions in response
- includeStats: boolean (default false) - whether to include submission statistics

**Success Response:**
- Status Code: 200 OK
- Response Body:
```
{
  "id": "string/UUID",
  "examType": "MCQ" or "CQ",
  "title": "string",
  "course": "string",
  "description": "string",
  "duration": integer,
  "totalMarks": integer,
  "passingMarks": integer,
  "startDateTime": "ISO 8601 datetime",
  "endDateTime": "ISO 8601 datetime",
  "createdBy": {
    "id": "string",
    "name": "string",
    "email": "string"
  },
  "createdAt": "ISO 8601 datetime",
  "updatedAt": "ISO 8601 datetime",
  "status": "DRAFT" or "PUBLISHED" or "ACTIVE" or "COMPLETED",
  "questions": [
    {
      "id": "string/UUID",
      "text": "string",
      "marks": integer,
      "type": "MCQ" or "CQ",
      "options": ["array of strings"],
      "correctAnswer": integer or null
    }
  ],
  "stats": {
    "totalSubmissions": integer,
    "averageScore": decimal,
    "pendingGrading": integer (for CQ exams)
  }
}
```

**Error Responses:**
- 401 Unauthorized: User not authenticated
- 403 Forbidden: User doesn't have access to this exam
- 404 Not Found: Exam doesn't exist
- 500 Internal Server Error

---

### 4. Get Teacher's Exams List
**Endpoint:** `GET /api/exams`

**Purpose:** Retrieve list of all exams created by the authenticated teacher

**Authentication:** Required (Teacher only)

**Query Parameters:**
- page: integer (default 0)
- size: integer (default 20)
- sort: string (e.g., "createdAt,desc")
- status: string filter (DRAFT, PUBLISHED, ACTIVE, COMPLETED)
- search: string (search in title, course)

**Success Response:**
- Status Code: 200 OK
- Response Body:
```
{
  "content": [
    {
      "id": "string/UUID",
      "title": "string",
      "course": "string",
      "examType": "MCQ" or "CQ",
      "status": "string",
      "startDateTime": "ISO 8601 datetime",
      "endDateTime": "ISO 8601 datetime",
      "totalMarks": integer,
      "duration": integer,
      "totalQuestions": integer,
      "totalSubmissions": integer,
      "pendingGrading": integer,
      "createdAt": "ISO 8601 datetime"
    }
  ],
  "pageable": {
    "pageNumber": integer,
    "pageSize": integer,
    "totalElements": integer,
    "totalPages": integer
  }
}
```

---

### 5. Delete Exam
**Endpoint:** `DELETE /api/exams/{examId}`

**Purpose:** Delete an exam (soft delete recommended)

**Authentication:** Required (Teacher who created it)

**Path Parameters:**
- examId: UUID/string identifier

**Business Rules:**
- Only creator can delete
- Cannot delete if exam has submissions (or allow with cascade delete based on business decision)
- Consider soft delete to maintain data integrity

**Success Response:**
- Status Code: 204 No Content OR 200 OK with message

**Error Responses:**
- 401 Unauthorized
- 403 Forbidden: User doesn't own exam
- 404 Not Found
- 409 Conflict: Exam has submissions
- 500 Internal Server Error

---

## Data Models (Backend Entities)

### Exam Entity
```
- id (UUID, primary key)
- examType (ENUM: MCQ, CQ)
- title (String, not null)
- course (String, not null)
- description (String, nullable)
- duration (Integer, not null) - in minutes
- totalMarks (Integer, not null)
- passingMarks (Integer, not null)
- startDateTime (LocalDateTime, not null)
- endDateTime (LocalDateTime, not null)
- status (ENUM: DRAFT, PUBLISHED, ACTIVE, COMPLETED)
- teacherId (Foreign Key to User)
- createdAt (LocalDateTime, auto-generated)
- updatedAt (LocalDateTime, auto-updated)
- deletedAt (LocalDateTime, nullable) - for soft delete
```

### Question Entity
```
- id (UUID, primary key)
- examId (Foreign Key to Exam, cascade)
- text (String/Text, not null)
- marks (Integer, not null)
- type (ENUM: MCQ, CQ)
- questionOrder (Integer) - to maintain order
- createdAt (LocalDateTime)
- updatedAt (LocalDateTime)
```

### MCQOption Entity (for MCQ questions only)
```
- id (UUID, primary key)
- questionId (Foreign Key to Question)
- optionText (String, not null)
- optionOrder (Integer, 0-3)
- isCorrect (Boolean, not null)
```

**Note:** For MCQ questions, store options as separate records with isCorrect flag instead of storing correctAnswer index, for better data integrity.

---

## Additional Technical Requirements

### 1. Validation Layer
Implement comprehensive server-side validation:
- Field presence validation
- Data type validation
- Range validation (marks, dates)
- Business logic validation (totalMarks = sum of question marks)
- DateTime validation (start before end)
- MCQ option validation (exactly 4 options, one correct answer)

### 2. Authorization Layer
- Implement role-based access control (RBAC)
- Teacher role required for creating/updating/deleting exams
- Owner-based access control for update/delete operations
- Students can only view published exams they're enrolled in

### 3. Transaction Management
- Use database transactions for exam creation/update
- Ensure atomicity - all questions must be saved or none
- Handle rollback scenarios properly

### 4. Exam Status Management
Implement automatic status transitions:
- DRAFT: Initially created, not visible to students
- PUBLISHED: Visible to students but not yet started
- ACTIVE: Current time between startDateTime and endDateTime
- COMPLETED: Current time after endDateTime

Consider implementing a scheduled job to update statuses automatically.

### 5. Error Handling
- Return structured error responses
- Include field-level validation errors
- Provide meaningful error messages
- Use appropriate HTTP status codes

Example error response structure:
```
{
  "timestamp": "ISO 8601 datetime",
  "status": integer,
  "error": "string (HTTP error name)",
  "message": "string (user-friendly message)",
  "path": "string (API endpoint)",
  "validationErrors": {
    "fieldName": ["array of error messages"]
  }
}
```

### 6. Audit Trail
Consider implementing:
- CreatedBy, CreatedAt fields
- UpdatedBy, UpdatedAt fields
- Change history/audit log for exam modifications

### 7. Performance Considerations
- Use database indexes on frequently queried fields (teacherId, status, startDateTime)
- Implement pagination for list endpoints
- Consider caching for frequently accessed exam data
- Optimize query performance for exam with questions (eager vs lazy loading)

### 8. Security Considerations
- Validate JWT tokens for authentication
- Implement rate limiting on API endpoints
- Sanitize input data to prevent SQL injection
- Don't expose correct answers in student-facing endpoints
- Use HTTPS for all communications

---

## Integration Points with Frontend

### Frontend Expectations
1. **Date/Time Format:** Frontend sends and expects ISO 8601 format
   - Example: "2026-01-23T10:00:00Z"
   - Handle timezone conversion on backend if needed

2. **Marks Calculation:** Frontend validates that sum of question marks equals totalMarks, but backend must validate again

3. **Question Order:** Frontend sends questions in array order, backend should maintain this order using questionOrder field

4. **Error Handling:** Frontend expects structured error responses with field-level validation messages

5. **Success Navigation:** 
   - After create: Frontend navigates to exam list page
   - After update: Frontend navigates to exam details page
   - Backend should return created/updated exam ID

---

## Testing Scenarios

Backend developer should test:

1. **Happy Path:**
   - Create MCQ exam with 5 questions
   - Create CQ exam with 3 questions
   - Update existing exam (change title, add question)
   - Retrieve exam details
   - Delete exam without submissions

2. **Validation Scenarios:**
   - Missing required fields
   - Invalid date ranges (start after end)
   - Total marks mismatch with sum of questions
   - MCQ with less/more than 4 options
   - MCQ without correct answer
   - Negative marks or duration

3. **Authorization Scenarios:**
   - Non-teacher trying to create exam
   - Teacher trying to update another teacher's exam
   - Unauthenticated access attempts

4. **Edge Cases:**
   - Update exam that has submissions
   - Delete exam that has submissions
   - Very large number of questions (performance)
   - Concurrent updates to same exam
   - Special characters in question text

5. **Status Transitions:**
   - Exam becomes ACTIVE when current time passes start time
   - Exam becomes COMPLETED when current time passes end time
   - Proper status filtering in list endpoint

---

## Summary for Developer

**Key Points:**
1. Single transaction for exam + questions creation/update
2. Separate entities for Exam, Question, and MCQOption
3. Strong validation on both data format and business logic
4. Owner-based authorization for modifications
5. Automatic status management based on date/time
6. Structured error responses with field-level details
7. Soft delete recommended for data integrity
8. Consider audit trail for tracking changes

**Database Relationships:**
- Exam 1:N Question (cascade delete)
- Question 1:N MCQOption (for MCQ type only, cascade delete)
- Exam N:1 User (Teacher)

**Critical Business Logic:**
- totalMarks must equal sum of all question marks
- startDateTime < endDateTime
- Only exam owner can update/delete
- MCQ questions must have exactly 4 options and 1 correct answer
- CQ questions don't have options or correct answer

Please review this document and clarify any questions before implementation. Coordinate with frontend team on data formats and error handling patterns.
