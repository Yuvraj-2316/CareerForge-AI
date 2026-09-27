<div align="center">

# CareerForge AI

### A full-stack career preparation workspace for students

**Plan your goals. Build projects. Track progress. Prepare for what's next.**

![Status](https://img.shields.io/badge/Status-Active%20Development-F59E0B?style=for-the-badge)
![Stack](https://img.shields.io/badge/Stack-MERN-61DAFB?style=for-the-badge)
![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20Tailwind-38BDF8?style=for-the-badge)

[Overview](#overview) · [Implemented Features](#implemented-features) · [Tech Stack](#tech-stack) · [Local Setup](#local-setup) · [Roadmap](#roadmap)

</div>

## Overview

CareerForge AI is an in-development MERN-stack application designed to bring students' career preparation into one place. It currently provides authenticated accounts, project management, personalized goals, and a dashboard that reflects saved project and goal data.

Coding practice, resume analysis, mock interviews, and AI-assisted career guidance are planned modules. CareerForge AI is intended to complement platforms such as LeetCode and GitHub, not replace them.

## Current Status

**Active development — core student experience implemented locally.**

| Module | Status | Current scope |
|---|---|---|
| Student authentication | Implemented | Registration, login, JWT-protected application routes |
| Student dashboard | Implemented | Personalized overview, project statistics, goals, and deadline widgets |
| Project management | Implemented | Create, view, edit, delete, and categorize projects by status |
| Personalized goals | Implemented | Set individual targets, categories, deadlines, and statuses |
| Project goal progress | Implemented | Displays progress based on completed projects |
| Goal schedule | Implemented | Upcoming deadlines and weekly calendar based on active goals |
| DSA practice | Planned | LeetCode question links and saved solve tracking |
| Resume analysis and interviews | Planned | Resume feedback and mock interview modules |
| AI career assistant | Planned | AI-assisted guidance and learning roadmaps |

The dashboard deliberately uses empty states for features that do not yet have real activity data. The current application is a development project; a publicly deployed version is not yet available.

## Implemented Features

### Authentication and protected routes

- Student registration and login.
- Password hashing using bcryptjs and JWT-based authentication.
- Protected frontend routes and authenticated backend endpoints.
- User-specific project and goal records in MongoDB.

### Personalized dashboard

- Project totals and completed/in-progress project statistics derived from saved records.
- Goal summaries and progress indicators.
- Upcoming goal deadlines and an interactive weekly calendar.
- Dedicated placeholders for DSA practice, resume analysis, interviews, and coding activity until those modules are connected.

### Project management

- Add, view, edit, and delete portfolio projects.
- Organize projects as **Planned**, **In Progress**, or **Completed**.
- Keep each student's project records separate.
- Reflect completed projects in the dashboard and project-related goals.

### Personalized goals and deadlines

- Create goals across **DSA**, **Projects**, **Resume**, **Interviews**, and **Custom** categories.
- Choose a personal target, optional deadline, and status (**Active**, **Paused**, or **Completed**).
- Record manual progress for custom goals.
- Show project-goal progress using completed-project records.
- Display active goals with deadlines in Upcoming Tasks and the weekly calendar. Paused and completed goals are excluded from the upcoming schedule.

**Tracking limitation:** DSA, resume, and interview activity are not automatically tracked yet. LeetCode synchronization has not been implemented.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, Tailwind CSS, React Router, Lucide React |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas, Mongoose |
| Authentication | JWT, bcryptjs |
| Development | Git, GitHub, npm |
| Planned AI integration | Google Gemini API (subject to implementation) |
| Potential deployment | Vercel (frontend), Render (backend) |

## Architecture

```text
                  CareerForge AI
                        |
                React + Vite client
                        |
             Protected routes / UI
                        |
                  Express REST API
                        |
             JWT authentication layer
                        |
                Mongoose models
                        |
                  MongoDB Atlas
                 /            \
             Projects        Goals
```

The React client requests authenticated, user-specific data from the Express API. MongoDB stores project and goal records. Dashboard statistics and calendar entries are derived from that saved data rather than hard-coded activity counts.

The AI service, resume file storage, and external coding-platform synchronization shown in the original concept are **not part of the current architecture**.

## Repository Structure

```text
CareerForge-AI/
├── client/
│   └── src/
│       ├── components/
│       │   ├── dashboard/
│       │   ├── layout/
│       │   └── ui/
│       ├── context/
│       ├── pages/
│       └── utils/
├── server/
│   └── src/
│       ├── models/
│       ├── routes/
│       └── server.js
└── README.md
```

## Local Setup

### Prerequisites

- Node.js and npm
- A MongoDB Atlas connection string (or a compatible MongoDB instance)
- Git

### 1. Clone the repository

```bash
git clone https://github.com/Yuvraj-2316/CareerForge-AI.git
cd CareerForge-AI
```

### 2. Install dependencies

In separate terminal sessions, install dependencies for both applications:

```bash
cd server
npm install
```

```bash
cd client
npm install
```

### 3. Configure environment variables

Create `server/.env` with the values expected by your local backend configuration. For the current Express/MongoDB/JWT setup, these typically include:

```dotenv
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=replace_with_a_long_random_secret
```

**Check the environment variable names in your server configuration before starting.** Never commit `.env` files, database credentials, or JWT secrets.

The frontend currently uses the local API at `http://localhost:5001`; update its API configuration if you run the backend elsewhere.

### 4. Run the application

Start the backend from `server/` using the start or development script defined in `server/package.json`:

```bash
npm run dev
```

If your server package does not define a `dev` script, use its configured `start` script instead.

Start the frontend from `client/`:

```bash
npm run dev
```

Open the local URL printed by Vite (normally `http://localhost:5173`). Register or log in to access the protected dashboard.

## Roadmap

### Completed: Core foundation

- [x] Initialize React and Express applications.
- [x] Configure MongoDB and Mongoose.
- [x] Implement registration, login, and protected routes.
- [x] Build shared UI, navigation, and the student dashboard.
- [x] Add authenticated project CRUD operations.
- [x] Add personalized goals and project-based goal progress.
- [x] Connect goal deadlines to Upcoming Tasks and the weekly calendar.

### Next: DSA practice

- [ ] Create a topic-wise DSA question list with LeetCode links.
- [ ] Save each student's solved questions in MongoDB.
- [ ] Show actual solved totals, difficulty breakdown, and coding activity.
- [ ] Connect solved-question counts to personalized DSA goals.
- [ ] Evaluate authorized options for LeetCode progress synchronization.

### Later: Career preparation and AI

- [ ] Build resume upload, creation, and analysis workflows.
- [ ] Add mock interview practice and tracking.
- [ ] Add certification management and expanded student profiles.
- [ ] Integrate AI-assisted career guidance and learning roadmaps.
- [ ] Add automated tests and complete a security review.
- [ ] Deploy and document a public MVP.

### Future enhancements

- [ ] Permission-based recruiter features.
- [ ] Administrative tools.
- [ ] GitHub integration and advanced analytics.

## Security Notes

- Passwords are hashed and authenticated endpoints require a JWT.
- Project and goal records are scoped to the signed-in student.
- Local secrets belong in ignored environment files, never in Git.
- The application is under active development and has not undergone a production security audit.

## Developer

**Yuvraj Garg**  
B.E. Computer Science Engineering — Artificial Intelligence & Machine Learning  
Batch 2024–2028

[GitHub](https://github.com/Yuvraj-2316) · [CareerForge AI Repository](https://github.com/Yuvraj-2316/CareerForge-AI)

---

<div align="center">

**CareerForge AI — Build skills. Track progress. Shape your future.**

</div>
