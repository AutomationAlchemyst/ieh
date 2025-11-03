# Ihsan Education Hub - Portal

This is a comprehensive web application for Ihsan Education Hub, designed to serve as a central portal for administrators, management, teachers, and students. The platform provides role-based access to manage users, courses, and learning groups, facilitating a streamlined educational experience.

## Key Features

The application is built with a modern tech stack and includes the following features:

- **Role-Based Access Control**: The user experience is tailored to four distinct roles:
    - **Admin**: Full control over the platform, including user management, course creation, and access to the student-teacher matching engine.
    - **Management**: A view-only role to monitor platform statistics, user lists, and course catalogs.
    - **Teacher**: Can manage the content of their assigned courses, view their students, and interact with their assigned study groups.
    - **Student**: Can view and participate in their enrolled courses and see their study group details.

- **Dashboard**: A personalized landing page for each user role, providing relevant at-a-glance information:
    - **Admin/Management**: Displays key metrics like total users, total courses, user growth charts, and a list of recently joined users.
    - **Teacher**: Shows an overview of their courses and total number of students.
    - **Student**: Lists enrolled courses and tracks progress.

- **User Management (Admin)**: A feature-rich data table allows administrators to view, search, sort, and manage all users within the system.

- **Course Management**:
    - **Course Catalog**: A browsable list of all available courses, showing thumbnails, descriptions, and instructors.
    - **Course Details**: An in-depth view of each course, including its modules.
    - **Interactive Module Manager**: For admins and teachers, this tool allows for creating, editing, reordering, and deleting course modules directly on the page.

- **Student-Teacher Matching Engine (Admin)**: A powerful multi-step wizard that enables administrators to:
    1. Select students for a new group.
    2. Define criteria such as location and availability.
    3. View a list of AI-suggested teachers with a match score.
    4. Confirm the match to automatically create a new "Ulumi Group".

- **Ulumi Groups**: Dedicated pages for study groups, showing the assigned teacher (Asatizah), enrolled students, and meeting location.

- **Settings**: A personal settings page for users to update their profile information and change their password.

## Tech Stack

This project is a Next.js application built with the App Router, leveraging the latest features for optimal performance and developer experience.

- **Framework**: Next.js (with React)
- **Styling**: Tailwind CSS
- **UI Components**: ShadCN UI
- **Language**: TypeScript
- **Icons**: Lucide React
- **Charts**: Recharts
- **Data Tables**: TanStack Table
- **Generative AI**: Genkit

## Getting Started

To get started, navigate to `src/app/page.tsx`, which redirects to the login page. The application uses mock data located in `src/lib/data.ts` to simulate a real backend, allowing you to explore the full range of features for each user role. You can change the currently logged-in user role within this file to test different dashboard views and permissions.
