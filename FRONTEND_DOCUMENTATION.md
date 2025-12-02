# Mouth Cancer Detection - Frontend Documentation

## 📋 Overview

A Next.js-based web application for AI-powered mouth cancer detection and screening. Users can upload mouth images and biopsy samples, complete medical questionnaires, and receive AI-driven risk assessments with personalized recommendations.

---

## 🛠️ Tech Stack

| Category           | Technologies                                     |
| ------------------ | ------------------------------------------------ |
| **Framework**      | Next.js 15.1.6, React 19                         |
| **Styling**        | Tailwind CSS 3.4.1, CSS Modules                  |
| **UI Components**  | Radix UI (Dialog, Dropdown, Select, Toast, etc.) |
| **Form Handling**  | React Hook Form + Zod validation                 |
| **Backend/DB**     | Appwrite (Auth, Database, Storage)               |
| **File Upload**    | React Dropzone, Cloudinary (avatars)             |
| **Animations**     | Framer Motion                                    |
| **Charts**         | Recharts                                         |
| **AI Integration** | FastAPI Backend (External)                       |
| **Email**          | Nodemailer                                       |
| **Icons**          | Lucide React, React Icons, FontAwesome           |
| **Markdown**       | React Markdown                                   |
| **PDF**            | jsPDF                                            |
| **Date Handling**  | date-fns                                         |

---

## 📁 Project Structure

```
frontend/
├── app/                    # Next.js App Router
│   ├── (API)/              # API Routes
│   │   └── api/
│   │       ├── contact/    # Email contact API
│   │       └── predict/    # AI prediction proxy
│   ├── (auth)/             # Authentication pages
│   │   ├── login/
│   │   └── sign-up/
│   ├── (root)/             # Main user dashboard
│   │   └── dashboard/
│   │       ├── chatbot/    # AI assistant
│   │       ├── contact/    # Contact form
│   │       ├── documents/  # Test results
│   │       ├── settings/   # User settings
│   │       └── test/       # Cancer screening test
│   └── admin/              # Admin panel
│       ├── messages/       # User messages
│       └── users/          # User management
├── components/             # React components
├── lib/                    # Actions & utilities
│   ├── actions/            # Server actions
│   └── appwrite/           # Appwrite config
├── constants/              # App constants
├── hooks/                  # Custom hooks
├── public/                 # Static assets
└── styles/                 # CSS modules
```

---

## 📄 Pages & Routes

### Public Pages

| Route      | Description                         |
| ---------- | ----------------------------------- |
| `/`        | Landing page with features overview |
| `/login`   | User login with OTP verification    |
| `/sign-up` | New user registration               |

### User Dashboard (Protected)

| Route                       | Description                                       |
| --------------------------- | ------------------------------------------------- |
| `/dashboard`                | Main dashboard with stats, charts, recent uploads |
| `/dashboard/test`           | Start new cancer screening (3-step process)       |
| `/dashboard/documents`      | View all test results with sorting                |
| `/dashboard/documents/[id]` | View detailed test results & recommendations      |
| `/dashboard/chatbot`        | AI medical assistant for Q&A                      |
| `/dashboard/settings`       | Update profile, email, avatar                     |
| `/dashboard/contact`        | Contact support form                              |

### Admin Panel (Admin Only)

| Route             | Description                           |
| ----------------- | ------------------------------------- |
| `/admin`          | Admin dashboard with statistics       |
| `/admin/users`    | Manage users (view/delete)            |
| `/admin/messages` | Manage user messages (status updates) |

---

## 🔐 Authentication System

### Flow

1. User enters email → OTP sent via Appwrite
2. User enters 6-digit OTP → Session created
3. Session stored in HTTP-only cookie (`appwrite-session`)

### Key Functions (`lib/actions/userActions.js`)

- `createAccount()` - Register new user
- `signInUser()` - Login existing user
- `sendEmailOTP()` - Send OTP to email
- `verifySecret()` - Verify OTP & create session
- `getCurrentUser()` - Get logged-in user data
- `updateAccount()` - Update user profile
- `signOutUser()` - Logout user

---

## 🧪 Cancer Screening Process (3 Steps)

### Step 1: Mouth Image Upload

- Upload oral cavity image
- AI analyzes for visual signs of cancer
- Returns: `prediction` (Cancer/Non Cancer) + `confidence` score

### Step 2: Biopsy Image Upload

- Upload histopathological biopsy image
- AI classifies tissue abnormality
- Returns: `prediction` (Normal/Abnormal) + `confidence` score

### Step 3: Medical Questionnaire

Collects 20+ risk factors including:

- Demographics (age, gender, country)
- Risk factors (tobacco, alcohol, HPV, betel quid)
- Symptoms (oral lesions, bleeding, white patches)
- Medical history (family history, immune system status)
- Cancer staging data (tumor size, stage)

Returns: `prediction` (Low/Medium/High Risk)

### Test Results

- Combined analysis from all 3 steps
- Patient information summary
- Risk factor breakdown
- Personalized recommendations
- Next steps guidance

---

## 🤖 AI Integration

### External FastAPI Backend

Base URL: `NEXT_PUBLIC_API_URL` (default: `http://127.0.0.1:8000`)

### API Endpoints

| Endpoint                | Method | Description          |
| ----------------------- | ------ | -------------------- |
| `/predict/mouth-image`  | POST   | Analyze mouth image  |
| `/predict/biopsy-image` | POST   | Analyze biopsy image |
| `/predict/csv`          | POST   | Analyze medical data |
| `/chatbot/`             | POST   | AI chatbot response  |
| `/`                     | GET    | Health check         |

### Next.js API Proxy (`/api/predict`)

- Forwards requests to FastAPI backend
- Handles file uploads via FormData

---

## 💬 AI Chatbot Features

- **Test Context Awareness**: Analyzes user's test results
- **Quick Questions**: Pre-built prompts for common queries
- **Real-time Status**: Shows API connection status
- **Fallback Responses**: Local responses if API unavailable
- **Markdown Support**: Renders formatted AI responses

---

## 📁 File Management

### Actions (`lib/actions/fileActions.js`)

- `uploadFile()` - Upload & create document record
- `getFiles()` - List files with filters/sorting
- `getFileById()` - Get single file details
- `renameFile()` - Update file name
- `updateData()` - Update test results (per step)
- `deleteFile()` - Remove file & storage
- `updateFileUsers()` - Share file via email
- `getTotalSpaceUsed()` - Calculate storage usage

### Storage

- **Provider**: Appwrite Storage
- **Max File Size**: 50MB
- **Total Space**: 1GB per user

### File Types Supported

- Images: jpg, jpeg, png, gif, bmp, svg, webp
- Documents: pdf, doc, docx, txt, csv, etc.

---

## 👤 Admin Features

### Dashboard Stats

- Total users count
- Total tests count
- Storage used
- Message statistics (pending/in-progress/completed)
- Recent users & tests activity

### User Management

- View all registered users
- Delete user accounts

### Message Management

- View all contact messages
- Filter by status
- Update status (pending → in-progress → completed)
- Delete messages

---

## 📧 Contact & Messaging

### Email System (`/api/contact`)

- Uses Nodemailer with Gmail SMTP
- Sends notification to admin
- Sends confirmation to user

### Message Storage

- Saved to Appwrite database
- Status tracking (pending/in-progress/completed)
- Admin can manage via dashboard

---

## 🎨 UI Components

### Custom Components

| Component                      | Purpose                   |
| ------------------------------ | ------------------------- |
| `AuthForm`                     | Login/signup forms        |
| `OTPModal`                     | OTP verification dialog   |
| `FileUploader`                 | Drag & drop file upload   |
| `Chatbot`                      | AI assistant interface    |
| `Chart`                        | Storage usage donut chart |
| `Card`                         | File display card         |
| `Thumbnail`                    | File type preview         |
| `ActionDropdown`               | File actions menu         |
| `Settings`                     | Profile edit form         |
| `ContactUs`                    | Contact form              |
| `Sidebar` / `MobileNavigation` | Navigation                |
| `Header`                       | Search bar                |
| `Sort`                         | File sorting dropdown     |

### Radix UI Components

- AlertDialog, Dialog, Sheet
- DropdownMenu, Select
- Form, Input, Label
- Button, Badge
- Table, ScrollArea
- Toast (notifications)

---

## 🔧 Environment Variables

```env
# Appwrite Configuration
NEXT_PUBLIC_APPWRITE_ENDPOINT=
NEXT_PUBLIC_APPWRITE_PROJECT=
NEXT_PUBLIC_APPWRITE_DATABASE=
NEXT_PUBLIC_APPWRITE_USERS_COLLECTION=
NEXT_PUBLIC_APPWRITE_FILES_COLLECTION=
NEXT_PUBLIC_APPWRITE_MESSAGES_COLLECTION=
NEXT_PUBLIC_APPWRITE_BUCKET=
NEXT_APPWRITE_KEY=

# External API
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000

# Email (Nodemailer)
SENDER=
PASSWORD=
TO=
```

---

## 🗄️ Database Schema (Appwrite)

### Users Collection

| Field     | Type    |
| --------- | ------- |
| fullName  | String  |
| email     | String  |
| avatar    | URL     |
| accountId | String  |
| isAdmin   | Boolean |

### Files Collection

| Field              | Type         |
| ------------------ | ------------ |
| name               | String       |
| type               | String       |
| url                | URL          |
| urlBiopsy          | URL          |
| extension          | String       |
| size               | Number       |
| owner              | Relationship |
| accountId          | String       |
| users              | Array        |
| Result             | JSON String  |
| resultBiopsy       | JSON String  |
| resultMedical      | JSON String  |
| medicalData        | JSON String  |
| isCompleted        | Boolean      |
| bucketFileId       | String       |
| biopsyBucketFileId | String       |

### Messages Collection

| Field   | Type                                 |
| ------- | ------------------------------------ |
| userId  | String                               |
| name    | String                               |
| email   | String                               |
| phone   | String                               |
| message | String                               |
| status  | Enum (pending/in-progress/completed) |

---

## 🚀 Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

---

## 📱 Responsive Design

- Mobile-first approach with Tailwind
- Responsive navigation (sidebar + mobile nav)
- Adaptive layouts for all screen sizes
- Touch-friendly UI elements

---

## 🔒 Security Features

- HTTP-only session cookies
- Server-side authentication checks
- Admin-only route protection
- Secure file URL construction
- OTP-based passwordless auth

---

## 📦 Key Dependencies

| Package         | Version | Purpose             |
| --------------- | ------- | ------------------- |
| next            | 15.1.6  | React framework     |
| react           | 19.0.0  | UI library          |
| node-appwrite   | 14.2.0  | Backend SDK         |
| react-hook-form | 7.54.2  | Form management     |
| zod             | 3.24.1  | Schema validation   |
| recharts        | 2.15.0  | Charts              |
| framer-motion   | 12.0.5  | Animations          |
| nodemailer      | 6.10.0  | Email sending       |
| react-dropzone  | 14.3.5  | File uploads        |
| sonner          | 2.0.3   | Toast notifications |
| cloudinary      | 2.5.1   | Image hosting       |

---

## 📝 Notes

- **Fonts**: Poppins (Google Fonts)
- **Color Theme**: Brand colors defined in Tailwind config
- **State Management**: React hooks + Server Actions
- **Caching**: Next.js `revalidatePath` for cache invalidation
- **Error Handling**: Toast notifications for user feedback
