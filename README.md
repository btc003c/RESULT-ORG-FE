# ResultHub Business & Admin Web

This repository contains the enterprise-facing application strictly reserved for ResultHub Organizations and internal Super Admins.

## 🎯 Purpose
The Business Web platform completely separates enterprise workloads from consumer workloads. It provides high-security dashboards where organizations can manage their internal structures, upload datasets, and monitor analytics. It also houses the `superadmin` portal for internal system moderation.

## 📦 What It Has
- **Organization Dashboards:** Complex UI flows for organization data management and CSV imports.
- **Super Admin Moderation:** Tools for handling user complaints, reviewing flagged posts, and managing platform-wide settings.
- **Analytics & Reporting:** Built-in charts and graphs using Recharts to visualize organizational data and user engagement.
- **Enterprise Security Flows:** Dedicated business-to-business login schemas that bypass consumer social logins.

## 🛠️ How It Is Built
### Tech Stack
- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Library:** React 19
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Data Visualization:** Recharts
- **Language:** TypeScript

### Prerequisites
- [Node.js](https://nodejs.org/) (v20+ recommended)
- A running instance of the `backend-mern` API.

### Getting Started

1. **Install Dependencies**
   Navigate to the root of this folder and install the required npm packages:
   ```bash
   npm install
   ```

2. **Environment Configuration**
   Create a `.env.local` file in the root directory to point to your local backend API. Ensure this runs on a different port than the public web if developing simultaneously!
   ```env
   PORT=3002
   NEXT_PUBLIC_API_URL=http://localhost:3001/api
   ```

3. **Start the Development Server**
   Run the Next.js development server:
   ```bash
   npm run dev
   ```
   *The application will start locally at `http://localhost:3002`.*

### Available Scripts
- `npm run dev`: Starts the local development server.
- `npm run build`: Compiles an optimized production build.
- `npm run start`: Starts the application in production mode.
- `npm run lint`: Runs ESLint to catch syntax and styling errors.
