# **App Name**: Ihsan Education Hub Portal

## Core Features:

### 1. User Management (The Actors)
- **Student Management**: View master list, filter/search for specific students, and perform verification actions (Approve/Reject new sign-ups).
- **Trainer Management**: View, search, and approve/edit trainer profiles.
- **Verification Queue**: A dedicated flow for "Unverified" users, requiring admin validation before granting full access.
- **Authentication**: Secure email/password login system with role-based access control (Admin, Management, Teacher/Asatizah, Student).

### 2. Bursary Management (Financial Aid)
- **Application Workflow**: A pipeline to view all incoming bursary applications with decision-making controls (Verify, Approve, or Reject).
- **Payment Tracking**: A system to track the status of payouts or disbursements associated with approved bursaries.

### 3. Course Overview (The Product)
- **Lifecycle Management**: Classify courses as "Ongoing" (active) or "Completed" (archived).
- **CRUD Operations**: Capabilities to Add new courses, Edit existing ones, and manage Modules.
- **Enrollment & Taxonomy**: Tagging features ("Add Course to Tag") and visibility into enrolled students.
- **Course Details**: Display course title, description, and modules.

### 4. Reports & Analytics (Business Intelligence)
- **Growth Metrics**: Track "Registration per Year" to monitor uptake.
- **Performance Metrics**: Analyze "User Demographics," "Passing Rates," and "Course Completion Statistics."
- **Financial Audit**: A specific report for "Payment Stats / Audit," linking back to bursary disbursements.

### 5. Settings / Configuration (System Control)
- **AI Integration**: Integration for automated support or grading (using Genkit).
- **Access Control**: Role-Based Access Control (RBAC) management.
- **Communication**: Management of "Notification Templates" (email/SMS).
- **System Logic**: Management of system-wide variables, "Discount Management," and Matching Engine configuration.

## Style Guidelines:

- Primary color: Deep blue (`#34495E`) to convey trust, stability, and professionalism.
- Background color: Light gray (`#ECF0F1`) to provide a clean, neutral backdrop.
- Accent color: A softer, calming teal (#4DB6AC) for CTAs and highlights to create a sense of growth and learning. (Ensure all color combinations are checked for WCAG accessibility).
- Body font: 'PT Sans', a humanist sans-serif with a modern look, suitable for body text.
- Headline font: 'Montserrat', a clean and versatile sans-serif font that offers excellent readability for UI headlines and pairs well with the body font.
- Icons: Use a single, consistent icon library like Material Symbols (by Google) to ensure a clear and professional visual language.
- Animation: Subtle transitions and animations to enhance user experience.