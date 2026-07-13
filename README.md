# ResultHub Business & Admin Web

## 🌍 Complete Project Overview
**ResultHub** is a comprehensive, multi-platform social and organizational ecosystem designed to bridge the gap between institutions, data, and the community. It allows organizations (like sports leagues, educational institutions, or event organizers) to securely upload and manage complex datasets. Simultaneously, it provides end-users with an engaging, modern social network to view these results, interact with posts, customize their profiles, and stay connected with real-time feeds.

The platform is decoupled into four codebases:
1. **Backend API**
2. **Public Web** (User-facing social network)
3. **Business Web (This repository)**
4. **Mobile App** (Flagship Flutter app)

---

## 🎯 Purpose of This Repository
The Business Web platform completely separates enterprise workloads from consumer workloads. It is a highly-secure, restricted dashboard designed exclusively for ResultHub Organizations (to manage data) and internal Super Admins (to moderate the platform). Standard users cannot log into this platform.

## 🔌 How It Integrates with the Backend
Like all frontends in the ecosystem, this application is completely stateless and depends heavily on the `backend-mern` Node.js API:

1. **Enterprise Authentication:** The login forms here hit entirely different backend routes (e.g., `/api/organization/login` or `/api/superadmin/login`). The backend verifies that the account has elevated privileges before issuing an enterprise JWT token.
2. **Heavy Data Uploads:** When an organization uploads a massive CSV of results, this frontend packages the file using standard HTML `<input type="file">` and `FormData`, and posts it to the backend using `multipart/form-data`. The backend's Multer middleware catches the file, parses the CSV, and bulk-inserts the rows into MongoDB.
3. **Data Visualization:** The Recharts analytics components in this repo actively poll the backend's `/api/analytics` endpoints to receive aggregated metric JSON arrays, which are then painted as graphs.

## 📦 What It Has
- **Organization Dashboards:** Complex UI flows for organization data management and CSV imports.
- **Super Admin Moderation:** Tools for handling user complaints, reviewing flagged posts, and managing platform-wide settings.
- **Analytics & Reporting:** Built-in charts and graphs using Recharts.

## 🛠️ How It Is Built
### Tech Stack
- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Library:** React 19
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Data Visualization:** Recharts

### Prerequisites
- [Node.js](https://nodejs.org/) (v20+ recommended)
- A running instance of the `backend-mern` API.

### Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Configuration**
   Ensure this runs on a different port than the public web if developing simultaneously!
   ```env
   PORT=3002
   NEXT_PUBLIC_API_URL=http://localhost:3001/api
   ```

3. **Start the Server**
   ```bash
   npm run dev
   ```
