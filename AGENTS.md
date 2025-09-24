This document breaks down the Patient Dashboard implementation into manageable tasks for Copilot. Follow each task in order.

🎯 Goal

Recreate the Patient Dashboard UI as shown in the Figma design:

Sidebar navigation

Top navbar with search and notifications

Dashboard sections (Appointments, Recent Activity, Prescriptions, Diagnosis, Bills).

📂 Project Context

Frontend: React + TypeScript + Vite

Styling: Tailwind CSS + Shadcn/UI components

Icons: Lucide or Phosphor Icons

Directory: src/components/dashboard/ contains dashboard modules.

🛠️ Step-by-Step Tasks
Task 1: Sidebar

File: src/components/layout/Sidebar.tsx

Implement sidebar with icons + links:

Dashboard

Appointment

Clinics

Health Records

Consent Management

Messages

Notifications

Billing

Settings

Use Lucide icons.

Match colors with Figma (deep blue background, peach hover states).

Task 2: Navbar

File: src/components/layout/Navbar.tsx

Add search bar (placeholder: “Type here to search”).

Add settings & notification bell icons on the right.

Make it sticky at the top.

Task 3: Dashboard Layout

File: src/components/layout/MainLayout.tsx

Structure the layout with:

Sidebar (left)

Navbar (top)

Content area (center)

Task 4: Appointment Card

File: src/components/dashboard/AppointmentList.tsx

Show next appointment details (doctor name, specialization, date, time, location).

Add buttons: Cancel Booking and Reschedule.

Task 5: Recent Activity

File: src/components/dashboard/RecentRecords.tsx

Create list of doctor updates / health events.

Each row should show:

Doctor avatar

Doctor name & specialization

Update text (e.g., “Updated prescription”).

Task 6: Prescription List

File: src/components/dashboard/Prescription.tsx (create new file).

Display list of medicines (name, dosage, instructions, refill date).

Use Card + Badge for styling.

Task 7: Diagnosis Card

File: src/components/dashboard/Diagnosis.tsx (create new file).

Show current diagnosis (e.g., Sinusitis).

Include:

Severity badge (e.g., Moderate).

Primary doctor.

Treatment plan.

Next appointment.

Task 8: Recent Bills

File: src/components/dashboard/Bills.tsx (create new file).

Show payment breakdown:

Patient payment

Insurance (Medicare)

Total

Add “Reschedule” button for billing-related appointments.

Task 9: Dashboard Page

File: src/pages/Dashboard.tsx

Assemble components in a grid layout:

Appointment (left top)

Recent Activity (right top)

Prescriptions (left middle)

Diagnosis (center middle)

Bills (right middle)

Task 10: Reusable UI

Ensure all sections use existing Shadcn components:

card.tsx for cards

badge.tsx for severity & dosage

avatar.tsx for doctor images

button.tsx for actions

✅ Final Deliverable

A responsive, styled patient dashboard matching the Figma screenshot.