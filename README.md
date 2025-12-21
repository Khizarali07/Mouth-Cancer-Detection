# 🩺 Mouth Cancer Detection - Frontend

A comprehensive Next.js web application for **AI-powered mouth cancer detection and screening**. Users can upload mouth images and biopsy samples, complete medical questionnaires, and receive AI-driven risk assessments with personalized recommendations.

![Next.js](https://img.shields.io/badge/Next.js-15.1.6-black?logo=next.js)
![React](https://img.shields.io/badge/React-19.0.0-blue?logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.1-06B6D4?logo=tailwindcss)
![Appwrite](https://img.shields.io/badge/Appwrite-Backend-F02E65?logo=appwrite)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Pages & Routes](#-pages--routes)
- [Core Functionality](#-core-functionality)
- [Database Schema](#-database-schema)
- [Scripts](#-scripts)
- [Learn More](#-learn-more)

---

## ✨ Features

### 🔐 Authentication System

- **Passwordless OTP Authentication** - Secure email-based OTP verification
- **Session Management** - HTTP-only cookies for secure session storage
- **User Registration & Login** - Seamless onboarding experience

### 🧪 AI-Powered Cancer Screening (3-Step Process)

1. **Mouth Image Analysis** - Upload oral cavity images for AI visual analysis
2. **Biopsy Image Analysis** - Upload histopathological biopsy images for tissue classification
3. **Medical Questionnaire** - Comprehensive 20+ risk factor assessment including:
   - Demographics (age, gender, country)
   - Risk factors (tobacco, alcohol, HPV, betel quid usage)
   - Symptoms (oral lesions, bleeding, white patches)
   - Medical history (family history, immune system status)
   - Cancer staging data (tumor size, stage)

### 📊 Dashboard & Analytics

- **User Dashboard** - Overview with stats, charts, and recent uploads
- **Storage Usage Charts** - Visual representation using Recharts
- **Test History** - View all previous screening results
- **Detailed Reports** - Comprehensive test results with recommendations

### 🤖 AI Chatbot Assistant

- **Context-Aware Responses** - Analyzes user's test results for personalized answers
- **Quick Question Prompts** - Pre-built queries for common medical questions
- **Real-time API Status** - Connection status indicator
- **Markdown Support** - Rich formatted AI responses
- **Fallback Responses** - Local responses when API unavailable

### 📁 Document Management

- **File Upload** - Drag & drop with React Dropzone
- **Sorting & Filtering** - Multiple sort options (date, name, size)
- **File Actions** - Rename, share, download, delete functionality
- **PDF Generation** - Export test results using jsPDF

### 👤 User Settings

- **Profile Management** - Update name and email
- **Avatar Upload** - Cloudinary-powered image hosting
- **Account Settings** - Manage personal information

### 📧 Contact & Support

- **Contact Form** - Send messages to support team
- **Email Notifications** - Nodemailer integration with Gmail SMTP
- **Message Tracking** - Status updates (pending/in-progress/completed)

### 🛡️ Admin Panel

- **Admin Dashboard** - Overview statistics and metrics
- **User Management** - View and delete user accounts
- **Message Management** - Handle support requests with status updates
- **Activity Monitoring** - Track recent users and tests

### 📱 Responsive Design

- **Mobile-First Approach** - Optimized for all screen sizes
- **Adaptive Navigation** - Sidebar + mobile hamburger menu
- **Touch-Friendly UI** - Optimized for touch interactions

---

## 🛠️ Tech Stack

### Core Framework

| Technology       | Version | Purpose                         |
| ---------------- | ------- | ------------------------------- |
| **Next.js**      | 15.1.6  | React framework with App Router |
| **React**        | 19.0.0  | UI library                      |
| **Tailwind CSS** | 3.4.1   | Utility-first CSS framework     |

### Backend & Database

| Technology        | Purpose                           |
| ----------------- | --------------------------------- |
| **Appwrite**      | Authentication, Database, Storage |
| **node-appwrite** | Server-side Appwrite SDK          |
| **Nodemailer**    | Email sending (Gmail SMTP)        |
| **Cloudinary**    | Avatar image hosting              |

### UI Components & Styling

| Technology              | Purpose                                                          |
| ----------------------- | ---------------------------------------------------------------- |
| **Radix UI**            | Accessible UI primitives (Dialog, Dropdown, Select, Toast, etc.) |
| **Lucide React**        | Icon library                                                     |
| **React Icons**         | Additional icons                                                 |
| **FontAwesome**         | Brand icons                                                      |
| **Framer Motion**       | Animations and transitions                                       |
| **CSS Modules**         | Scoped styling                                                   |
| **tailwindcss-animate** | Animation utilities                                              |

### Form & Validation

| Technology          | Purpose               |
| ------------------- | --------------------- |
| **React Hook Form** | Form state management |
| **Zod**             | Schema validation     |
| **input-otp**       | OTP input component   |

### Data & Visualization

| Technology         | Purpose                          |
| ------------------ | -------------------------------- |
| **Recharts**       | Charts and data visualization    |
| **date-fns**       | Date formatting and manipulation |
| **jsPDF**          | PDF document generation          |
| **React Markdown** | Markdown rendering               |

### File Handling

| Technology         | Purpose                         |
| ------------------ | ------------------------------- |
| **React Dropzone** | Drag & drop file uploads        |
| **Cloudinary**     | Image upload and transformation |

### Utilities

| Technology                   | Purpose                         |
| ---------------------------- | ------------------------------- |
| **class-variance-authority** | Component variant management    |
| **clsx**                     | Conditional class names         |
| **tailwind-merge**           | Merge Tailwind classes          |
| **use-debounce**             | Debounced input handling        |
| **sonner**                   | Toast notifications             |
| **react-hot-toast**          | Alternative toast notifications |

### AI Integration

| Technology             | Purpose                        |
| ---------------------- | ------------------------------ |
| **FastAPI Backend**    | External AI prediction service |
| **Next.js API Routes** | Proxy for AI endpoints         |

---

## 📁 Project Structure

```
frontend/
├── app/                        # Next.js App Router
│   ├── globals.css             # Global styles
│   ├── layout.js               # Root layout
│   ├── page.js                 # Landing page
│   ├── not-found.js            # 404 page
│   ├── (API)/                  # API Routes
│   │   └── api/
│   │       ├── contact/        # Email contact API
│   │       └── predict/        # AI prediction proxy
│   ├── (auth)/                 # Authentication pages
│   │   ├── layout.js           # Auth layout
│   │   ├── loading.js          # Auth loading state
│   │   ├── login/              # Login page
│   │   └── sign-up/            # Registration page
│   ├── (root)/                 # Main user dashboard
│   │   └── dashboard/
│   │       ├── layout.js       # Dashboard layout
│   │       ├── page.js         # Main dashboard
│   │       ├── chatbot/        # AI assistant
│   │       ├── contact/        # Contact form
│   │       ├── documents/      # Test results
│   │       │   └── [id]/       # Individual result
│   │       ├── settings/       # User settings
│   │       └── test/           # Cancer screening
│   └── admin/                  # Admin panel
│       ├── layout.js           # Admin layout
│       ├── page.js             # Admin dashboard
│       ├── messages/           # Message management
│       └── users/              # User management
├── components/                 # React components
│   ├── ui/                     # Radix UI components
│   ├── testComponents/         # Test step components
│   ├── ActionDropdown.js       # File actions menu
│   ├── Authform.js             # Auth forms
│   ├── Card.js                 # File display card
│   ├── Chart.js                # Storage chart
│   ├── Chatbot.js              # AI chatbot
│   ├── ContactUs.js            # Contact form
│   ├── FileUploader.js         # Drag & drop upload
│   ├── header.js               # Search header
│   ├── Home.js                 # Landing page
│   ├── mobileNavigation.js     # Mobile nav
│   ├── OTPmodal.js             # OTP verification
│   ├── Settings.js             # Profile settings
│   ├── sideBar.js              # Navigation sidebar
│   └── ...
├── lib/                        # Utilities & actions
│   ├── utils.js                # Helper functions
│   ├── actions/                # Server actions
│   │   ├── adminActions.js     # Admin operations
│   │   ├── fileActions.js      # File CRUD
│   │   ├── messageActions.js   # Contact messages
│   │   └── userActions.js      # Authentication
│   └── appwrite/               # Appwrite configuration
│       ├── config.js           # Client config
│       └── index.js            # Server config
├── constants/                  # App constants
│   ├── index.js                # Nav items, sort options
│   └── userinfo.js             # User data
├── hooks/                      # Custom React hooks
│   └── use-toast.js            # Toast hook
├── public/                     # Static assets
│   └── assets/
│       ├── icons/              # SVG icons
│       └── images/             # Images
└── styles/                     # CSS modules
    └── Contact.module.css
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm, yarn, pnpm, or bun package manager
- Appwrite instance (cloud or self-hosted)
- FastAPI backend for AI predictions (optional for testing)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory (see [Environment Variables](#-environment-variables))

4. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

5. **Open the application**

   Navigate to [http://localhost:3000](http://localhost:3000) in your browser

---

## 🔧 Environment Variables

Create a `.env.local` file with the following variables:

```env
# Appwrite Configuration
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT=your_project_id
NEXT_PUBLIC_APPWRITE_DATABASE=your_database_id
NEXT_PUBLIC_APPWRITE_USERS_COLLECTION=your_users_collection_id
NEXT_PUBLIC_APPWRITE_FILES_COLLECTION=your_files_collection_id
NEXT_PUBLIC_APPWRITE_MESSAGES_COLLECTION=your_messages_collection_id
NEXT_PUBLIC_APPWRITE_BUCKET=your_bucket_id
NEXT_APPWRITE_KEY=your_api_key

# External AI API
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000

# Email Configuration (Nodemailer)
SENDER=your_email@gmail.com
PASSWORD=your_app_password
TO=admin_email@gmail.com
```

---

## 📄 Pages & Routes

### Public Pages

| Route      | Description                                            |
| ---------- | ------------------------------------------------------ |
| `/`        | Landing page with features overview and call-to-action |
| `/login`   | User login with OTP verification                       |
| `/sign-up` | New user registration                                  |

### User Dashboard (Protected)

| Route                       | Description                                           |
| --------------------------- | ----------------------------------------------------- |
| `/dashboard`                | Main dashboard with stats, charts, and recent uploads |
| `/dashboard/test`           | Start new cancer screening (3-step process)           |
| `/dashboard/documents`      | View all test results with sorting options            |
| `/dashboard/documents/[id]` | View detailed test results & recommendations          |
| `/dashboard/chatbot`        | AI medical assistant for Q&A                          |
| `/dashboard/settings`       | Update profile, email, and avatar                     |
| `/dashboard/contact`        | Contact support form                                  |

### Admin Panel (Admin Only)

| Route             | Description                                 |
| ----------------- | ------------------------------------------- |
| `/admin`          | Admin dashboard with system statistics      |
| `/admin/users`    | View and manage all users                   |
| `/admin/messages` | Manage contact messages with status updates |

---

## 🔥 Core Functionality

### Authentication Flow

1. User enters email → OTP sent via Appwrite
2. User enters 6-digit OTP → Session verified
3. Session stored in HTTP-only cookie (`appwrite-session`)
4. Protected routes check session validity

### Cancer Screening Process

1. **Step 1**: Upload mouth image → AI returns prediction + confidence
2. **Step 2**: Upload biopsy image → AI classifies tissue
3. **Step 3**: Complete questionnaire → AI calculates risk level
4. **Results**: Combined analysis with recommendations

### AI API Endpoints

| Endpoint                | Method | Description                        |
| ----------------------- | ------ | ---------------------------------- |
| `/predict/mouth-image`  | POST   | Analyze mouth cavity image         |
| `/predict/biopsy-image` | POST   | Analyze biopsy sample              |
| `/predict/csv`          | POST   | Process medical questionnaire data |
| `/chatbot/`             | POST   | AI chatbot conversation            |
| `/`                     | GET    | API health check                   |

---

## 🗄️ Database Schema

### Users Collection

| Field     | Type    | Description           |
| --------- | ------- | --------------------- |
| fullName  | String  | User's full name      |
| email     | String  | Email address         |
| avatar    | URL     | Profile picture URL   |
| accountId | String  | Appwrite account ID   |
| isAdmin   | Boolean | Admin privileges flag |

### Files Collection

| Field              | Type         | Description            |
| ------------------ | ------------ | ---------------------- |
| name               | String       | Test/file name         |
| type               | String       | File type              |
| url                | URL          | Mouth image URL        |
| urlBiopsy          | URL          | Biopsy image URL       |
| extension          | String       | File extension         |
| size               | Number       | File size in bytes     |
| owner              | Relationship | User reference         |
| accountId          | String       | Owner's account ID     |
| users              | Array        | Shared users list      |
| Result             | JSON String  | Mouth image results    |
| resultBiopsy       | JSON String  | Biopsy results         |
| resultMedical      | JSON String  | Questionnaire results  |
| medicalData        | JSON String  | Raw questionnaire data |
| isCompleted        | Boolean      | Test completion status |
| bucketFileId       | String       | Storage file ID        |
| biopsyBucketFileId | String       | Biopsy storage ID      |

### Messages Collection

| Field   | Type   | Description                   |
| ------- | ------ | ----------------------------- |
| userId  | String | Sender's user ID              |
| name    | String | Sender's name                 |
| email   | String | Sender's email                |
| phone   | String | Phone number                  |
| message | String | Message content               |
| status  | Enum   | pending/in-progress/completed |

---

## 📜 Scripts

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run ESLint for code quality
npm run lint
```

---

## 🔒 Security Features

- **HTTP-only Session Cookies** - Prevents XSS attacks
- **Server-side Auth Checks** - Route protection on server
- **Admin Route Protection** - Role-based access control
- **Secure File URLs** - Signed URLs for file access
- **OTP Authentication** - Passwordless security

---

## 🎨 UI/UX Features

- **Poppins Font** - Clean, modern typography
- **Custom Brand Colors** - Defined in Tailwind config
- **Smooth Animations** - Framer Motion transitions
- **Toast Notifications** - Real-time user feedback
- **Loading States** - Skeleton loaders and spinners
- **Error Handling** - Graceful error messages

---

## 📚 Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs) - Next.js features and API
- [React Documentation](https://react.dev) - React library
- [Tailwind CSS](https://tailwindcss.com/docs) - Utility-first CSS
- [Appwrite Documentation](https://appwrite.io/docs) - Backend services
- [Radix UI](https://www.radix-ui.com/docs/primitives) - UI primitives
- [React Hook Form](https://react-hook-form.com/docs) - Form handling

---

## 🚢 Deployment

The easiest way to deploy this Next.js app is using [Vercel](https://vercel.com/new):

1. Push your code to a Git repository
2. Import the project to Vercel
3. Configure environment variables
4. Deploy!

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

## 📝 License

This project is private and proprietary.

---

<p align="center">
  Built with ❤️ using Next.js and AI
</p>
