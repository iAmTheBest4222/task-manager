# Task Manager

A simple full-stack task management application built with Next.js and Node.js.

## Tech Stack

**Frontend:** Next.js (App Router), React, JavaScript  
**Backend:** Node.js, Express.js  
**Database:** MongoDB with Mongoose  

## Setup Instructions

### Backend Setup

1. Navigate to the backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with:
```
MONGODB_URI=mongodb://localhost:27017/taskmanager
PORT=5000
```

4. Start the backend server:
```bash
npm run dev
```

The backend will run on http://localhost:5000

### Frontend Setup

1. Navigate to the frontend folder:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on http://localhost:3000

## Environment Variables

Make sure MongoDB is running on your machine. The backend connects to MongoDB using the URI specified in the `.env` file.


## Features

- Create new tasks with title and description
- View all tasks in a list
- Edit existing tasks
- Delete tasks
- Update task status (pending, in-progress, completed)
