# Event Registration System

## Project Description

Event Registration System is a diploma web application for publishing events and registering participants.

Topic in Russian:
`Разработка веб-сайта для регистрации участников на мероприятия`

The project continues the earlier labs:
- Lab 2 fixed the architecture and technology stack
- Lab 3 fixed UI mockups, design direction, core screens, and user scenarios

This repository contains a working starter implementation aligned with those decisions:
- dark themed React frontend
- PHP backend for XAMPP
- MySQL database
- REST-like JSON API between frontend and backend

## Goal And Tasks

Project goal:
- create a local web system for event publication, participant registration, and organizer administration

Main tasks:
- implement public pages for guests
- implement authentication and personal account for participants
- implement event registration and cancellation
- implement organizer/admin CRUD for events
- implement participant lists and simple statistics
- connect all features to a real MySQL database

## Main Features

- Home page
- Events catalog with cards and filters
- Event details page
- Login and registration
- Personal account with user registrations
- Event registration and cancellation
- Admin panel for events
- Event creation and editing
- Event archive/status management
- Participants list by event
- Registration statistics

## Technology Stack

- React
- Vite
- PHP 8+
- PDO
- MySQL
- XAMPP
- REST API

## Architecture

Layers:
- UI layer: React pages and components in [`client/src`](./client/src)
- service layer: API clients and auth context in [`client/src/api`](./client/src/api) and [`client/src/context`](./client/src/context)
- backend logic layer: PHP endpoints and helpers in [`server/api`](./server/api) and [`server/utils`](./server/utils)
- data access layer: PDO connection and prepared statements in [`server/config/db.php`](./server/config/db.php)
- database layer: schema and seed scripts in [`database`](./database)

Authentication approach:
- session-based authentication
- PHP session is created on login/register
- React sends requests with cookies using `credentials: 'include'`
- this is the simplest stable local solution for XAMPP

## Repository Structure

```text
event-registration-system/
├── client/      React frontend
├── server/      PHP backend API
├── database/    MySQL schema and seed data
└── README.md
```

## Backend API Structure

```text
server/
├── config/
│   ├── bootstrap.php
│   ├── cors.php
│   └── db.php
├── api/
│   ├── auth/
│   ├── events/
│   ├── registrations/
│   └── admin/
└── utils/
    ├── auth.php
    ├── response.php
    └── validator.php
```

## Database Tables

Implemented tables:
- `students`
- `organizers`
- `categories`
- `events`
- `registrations`
- `attendance`

Important database rules:
- `events.status` uses `ENUM('draft','published','closed','cancelled')`
- `registrations` has a unique constraint on `(event_id, student_id)`
- all backend queries use prepared statements

## Seed Data

Included in [`database/seed.sql`](./database/seed.sql):
- 4 categories
- 7 sample events
- 1 admin organizer
- 3 sample students
- sample registrations
- sample attendance records

## Figma Mockup

Add your Figma link here:
- `https://www.figma.com/file/your-project-link`

## Local Setup With XAMPP

### 1. Clone the repository

```bash
git clone https://github.com/elizkrr16/event-registration-system.git
cd event-registration-system
```

### 2. Place backend into XAMPP

Copy the `server` folder into XAMPP `htdocs` so that it becomes available like this:

```text
C:\xampp\htdocs\event-registration-system\server
```

Expected local API base URL:

```text
http://localhost/event-registration-system/server/api
```

If your folder name is different, update `VITE_API_BASE_URL` in the frontend.

### 3. Start Apache and MySQL in XAMPP

Open XAMPP Control Panel and start:
- Apache
- MySQL

### 4. Import the database

Open phpMyAdmin and import in this order:

1. [`database/schema.sql`](./database/schema.sql)
2. [`database/seed.sql`](./database/seed.sql)

Default database name used by the backend:

```text
event_registration_system
```

### 5. Check backend DB config

Default config is in [`server/config/db.php`](./server/config/db.php):
- host: `127.0.0.1`
- port: `3306`
- database: `event_registration_system`
- user: `root`
- password: empty string

If your XAMPP MySQL settings differ, change them there or use environment variables:
- `DB_HOST`
- `DB_PORT`
- `DB_NAME`
- `DB_USER`
- `DB_PASSWORD`

## Frontend Launch

Open a terminal in [`client`](./client):

```bash
npm install
npm start
```

Default frontend URL:

```text
http://localhost:5173
```

Optional environment variable:

```text
VITE_API_BASE_URL=http://localhost/event-registration-system/server/api
```

## How To Run The Full Project Locally

1. Start Apache and MySQL in XAMPP
2. Import `schema.sql` and `seed.sql`
3. Make sure the backend is inside XAMPP `htdocs`
4. Run `npm install` in `client`
5. Run `npm start` in `client`
6. Open `http://localhost:5173`

## Test Credentials

Admin:
- email: `admin@events.local`
- password: `admin123`

Students:
- `ivan@student.local / student123`
- `anna@student.local / student234`
- `sergey@student.local / student345`

## Implemented User Scenarios

Guest:
- open home page
- open events catalog
- filter and search events
- open event details
- open login and registration pages

Participant:
- register account
- login/logout
- open personal account
- view own registrations
- register for event
- cancel registration
- receive success/error status messages

Admin:
- login as admin
- open full events list
- create event
- edit event
- archive event by status change
- change event status
- open event participants list
- view simple registration statistics

## Error Handling Included

- empty events list
- event not found
- invalid login
- duplicate registration
- registration when event is full
- invalid form input
- API/network request failures on the frontend

## Notes And Assumptions

- backend uses session auth instead of JWT for simpler local XAMPP deployment
- deleting events is implemented as archiving by setting status to `cancelled`
- attendance has database support and seeded records, but no separate admin marking UI yet
- CORS is enabled for `http://localhost:3000` and `http://localhost:5173`

## Git History

Main implementation was grouped into these stages:
- `setup backend and db`
- `auth`
- `public events pages`
- `registrations`
- `admin panel`
- `error handling and cleanup`
- `final README update`
