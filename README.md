# Garagix – Precision Auto Care & Workshop Management Platform

Garagix is an enterprise-grade, full-stack automotive workshop and precision repair management platform built for modern auto service centers, certified mechanics, and vehicle owners. It seamlessly integrates a responsive, high-performance **Angular 19** single-page application styled with **Tailwind CSS** and an **ASP.NET Core 8 Web API** backed by **MySQL (Pomelo Entity Framework Core)**.

Vehicle owners can schedule multi-service repair appointments, track live repair telemetry in real time using a unique reference code or license plate, inspect diagnostic milestones, and maintain digital vehicle service records. Workshop administrators and service managers gain a command center for bay allocation, certified technician dispatching, customer fleet management, real-time KPI tracking, and operational reporting.

---

## ✨ Key Features

### 🚗 Real-Time Repair Telemetry & Live Bay Tracking
- **Public Repair Telemetry Console** – Customers track vehicle service progress via reference number (e.g. `GRX-2026-8941`) or license plate without requiring login.
- **Milestone Progress Tracker** – Visual milestone steps: *Vehicle Checked In → Multi-Point Inspection → Parts Sourcing → Active Repair → Quality Diagnostics → Ready for Collection*.
- **Live Workshop Feed** – Real-time bay occupancy, technician assignment, estimated completion times, and symptom log feeds.

### 📅 Smart Service Booking & Multi-Step Scheduling
- **Interactive Multi-Step Booking Wizard** – Select vehicle details, browse services, specify symptoms, upload damage inspection photos, and choose preferred drop-off times.
- **Dynamic Cost & Duration Estimation** – Automatic calculation of estimated service pricing (in LKR) and time requirements based on selected workshop packages.
- **Flexible Drop-off Options** – Support for standard drop-off, priority valet pickup, or express same-day maintenance.

### 🛡️ Authentication, Security & Email OTP Verification
- **Two-Step Registration with Email OTP** – Dispatches 6-digit verification codes via SMTP to guarantee valid customer identities before account creation.
- **Secure Password Reset Flow** – Three-tier recovery flow (`forgot-password` → `verify-otp` → `reset-password`).
- **Role-Based Access Control (RBAC)** – JWT bearer authentication with strict route guards separating `admin` and `customer` permissions.
- **BCrypt Password Hashing** – Industry-standard cryptographic salt hashing for all stored credentials.

### 🏢 Comprehensive Admin Command Center
- **Interactive Operations Dashboard** – Real-time KPI cards for daily revenue, active repairs in bays, pending booking requests, and mechanic utilization.
- **Technician & Bay Dispatcher** – Assign certified master mechanics to specific repair jobs and track their workload in real time.
- **Service Catalogue CRUD** – Manage pricing, duration, categories, included checklist items, and common symptoms.
- **Customer & Fleet Directory** – Complete customer vehicle records, service histories, and contact information.
- **Workshop Operational Settings** – Configure bay capacity, operating hours, holiday schedules, cancellation policies, and SMS/Email notification broadcasts.
- **Reporting Engine** – Generate summary analytics and exportable operational reports.

### 👤 Dedicated Customer Portal
- **Service History & Past Invoices** – Complete digital maintenance log with diagnostic breakdowns and payments.
- **Virtual Garage** – Register and manage multiple personal vehicles (Make, Model, Year, Plate, VIN, Mileage).
- **One-Click Quick Rebooking** – Instant scheduling for routine maintenance based on vehicle history.

---

## 🧱 Tech Stack

### Frontend
- **Angular 19** (Standalone Components, Signals, Reactive State)
- **Tailwind CSS** (Custom Garagix precision dark theme: obsidian canvas `#0e0d0d` & racing red `#d70006`)
- **TypeScript 5.x**
- **RxJS 7.x** & Angular Signals
- **Lucide Icons** / SVG Custom Icon Component
- **Node.js 20+** & **npm**

### Backend
- **ASP.NET Core 8 Web API** (C# 12)
- **Pomelo Entity Framework Core 8** (MySQL async provider)
- **BCrypt.Net-Next** for secure credential encryption
- **FluentValidation.AspNetCore** for incoming DTO validation pipelines
- **Microsoft.AspNetCore.Authentication.JwtBearer** (RFC 7519 tokens)
- **Swashbuckle / OpenAPI** (Interactive Swagger documentation)
- **DotNetEnv** for `.env` configuration parsing
- **.NET 8.0 SDK**

### Database & Storage
- **MySQL 8.0+** relational database with InnoDB engine
- UTF-8 Multi-byte Unicode (`utf8mb4_unicode_ci`) encoding
- Automatic table creation, schema verification, and seed data initialization via `DbInitializer`

---

## 📂 Project Structure

```
Garagix/
├── README.md
│
├── frontend/                       # Angular 19 SPA
│   ├── package.json
│   ├── angular.json
│   ├── tailwind.config.js          # Garagix dark & racing red design tokens
│   ├── scripts/
│   │   └── set-env.js              # Environment synchronizer script
│   ├── public/                     # Static assets, hero images, partner logos
│   │   └── images/
│   │       ├── home/               # Hero & workshop visuals
│   │       └── team/               # Master mechanics photos
│   └── src/
│       ├── main.ts                 # Angular bootstrap
│       ├── styles.scss             # Global design tokens and utilities
│       └── app/
│           ├── core/               # Guards (admin/customer), Interceptors, Services
│           │   ├── guards/         # Auth, Admin, and Customer route guards
│           │   ├── interceptors/   # JWT bearer token attachment & error handling
│           │   └── services/       # Auth, Booking, Mechanic, Service API services
│           ├── features/           # Feature modules
│           │   ├── admin/          # Admin dashboard, bookings, mechanics, settings
│           │   ├── customer/       # Customer portal, book repair, fleet, tracking
│           │   ├── auth/           # Login, registration, OTP verify, password reset
│           │   └── public/         # Landing page, about, services, contact, team
│           ├── layouts/            # Master layout templates (Public, Admin, Customer)
│           └── shared/             # Reusable UI icons, cards, modals, pipes
│
└── backend/                        # ASP.NET Core 8 Web API
    ├── Garagix.Api.csproj          # Project configuration & NuGet dependencies
    ├── Garagix.sln                 # Visual Studio Solution
    ├── Program.cs                  # Pipeline configuration, DI, and middleware
    ├── Controllers/                # RESTful API controllers
    │   ├── AuthController.cs       # Registration with OTP, login, password recovery
    │   ├── BookingsController.cs   # Booking appointments & mechanic dispatch
    │   ├── TrackRepairController.cs# Telemetry lookup & live bay feeds
    │   ├── ServicesController.cs   # Workshop service catalogue CRUD
    │   ├── MechanicsController.cs  # Certified technicians management
    │   ├── CustomersController.cs  # Customer fleet & profile directory
    │   ├── DashboardController.cs  # Workshop KPI metrics & telemetry stats
    │   ├── ReportsController.cs    # Financial & service analytics reports
    │   ├── WorkshopSettingsController.cs # Operating hours, bays, capacity
    │   └── ContactController.cs    # Public contact inquiries
    ├── Data/                       # Entity Framework Core context & seeding
    │   ├── ApplicationDbContext.cs # EF Core DbContext
    │   ├── DbInitializer.cs        # Automated MySQL schema & seed verification
    │   └── Configurations/         # Entity mapping configurations & initial seeds
    ├── DTOs/                       # Strongly typed Requests & Responses
    ├── Entities/                   # Domain models (Booking, User, Vehicle, Mechanic, etc.)
    ├── Extensions/                 # Service collection setup (DB, JWT, CORS, Swagger)
    ├── Middleware/                 # Global exception handler & request logging
    ├── Services/                   # Business logic implementations & interfaces
    └── Validators/                 # FluentValidation rule definitions
```

---

## 🚀 Setup & Installation

### Prerequisites
- [.NET 8.0 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js 20+](https://nodejs.org/) and `npm`
- [MySQL Server 8.0+](https://dev.mysql.com/downloads/mysql/) running locally
- Git

---

### 1. Database Setup
Ensure your MySQL server is running. Create the database schema:
```sql
CREATE DATABASE IF NOT EXISTS garagix_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

---

### 2. Backend Setup (.NET 8 Web API)

1. **Navigate to the backend directory**
```bash
cd backend
```

2. **Configure environment settings**
Copy the template configuration file:
```bash
cp .env.example .env
```
Update `.env` with your local database credentials:
```ini
# Server Configuration
PORT="5203"
ASPNETCORE_ENVIRONMENT="Development"

# Database Configuration (MySQL)
DB_HOST="localhost"
DB_PORT="3306"
DB_DATABASE="garagix_db"
DB_USERNAME="root"
DB_PASSWORD="your_mysql_password"
DATABASE_URL="Server=localhost;Port=3306;Database=garagix_db;User=root;Password=your_mysql_password;"

# JWT Authentication
JWT_SECRET="your_jwt_secret_key_min_32_characters_here"
JWT_ISSUER="GaragixApi"
JWT_AUDIENCE="GaragixFrontend"
JWT_EXPIRES_IN_HOURS="24"

# Frontend Origin for CORS
FRONTEND_URL="http://localhost:4200"

# Transactional Email / SMTP (Optional for OTP verification)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-google-app-password"
SMTP_FROM="your-email@gmail.com"
```

3. **Restore packages and run the API**
```bash
dotnet restore
dotnet run
```

| Service | URL |
|---------|-----|
| **Backend API Base** | `http://localhost:5203/api` |
| **Interactive Swagger Docs** | `http://localhost:5203/swagger` |

> On initial startup, `DbInitializer` will automatically verify all required MySQL tables, schema relations, and inject default seed data (mechanics, services, settings, and demo accounts).

---

### 3. Frontend Setup (Angular 19)

1. **Navigate to the frontend directory**
```bash
cd ../frontend
```

2. **Install npm dependencies**
```bash
npm install
```

3. **Configure environment settings**
Copy the template configuration:
```bash
cp .env.example .env
```
Ensure `NG_APP_API_URL` points to your backend instance:
```ini
NG_APP_API_URL=http://localhost:5203/api
NG_APP_NAME=Garagix Auto Care
NG_APP_ENV=development
```

4. **Launch the development server**
```bash
npm start
# or: ng serve --port 4200
```
Open **`http://localhost:4200`** in your browser.

---

## 🔐 Default Seed Credentials

For rapid testing and evaluation, the database is pre-seeded with the following accounts:

| Role | Name | Email | Password | Access Level |
|------|------|-------|----------|--------------|
| **Admin** | Priyantha Jayasuriya | `admin@garagix.lk` | `Admin@123` | Full Workshop Command Center, Bookings, Mechanics, KPIs & Settings |
| **Customer** | Kasun Mendis | `kasun.mendis@example.lk` | `Customer@123` | Customer Portal, Vehicle Fleet, Booking Appointments, Live Tracking |

> [!NOTE]
> In development mode without SMTP configured, registration OTP codes and password reset OTPs are logged directly in the backend console output and returned in the HTTP response for seamless local testing.

---

## 🔄 Vehicle Repair Telemetry & Booking Lifecycle

```
┌────────────────┐     ┌────────────────┐     ┌────────────────┐
│ 1. Customer    │────▶│ 2. Booking     │────▶│ 3. Admin       │
│ Submits Booking│     │ Status:        │     │ Dispatches Bay │
│ (Plate & Issue)│     │ PENDING        │     │ & Mechanic     │
└────────────────┘     └────────────────┘     └────────────────┘
                                                       │
                                                       ▼
┌────────────────┐     ┌────────────────┐     ┌────────────────┐
│ 6. Ready for   │◀────│ 5. Active      │◀────│ 4. Inspection  │
│ Collection /   │     │ Repair & Parts │     │ & Diagnostic   │
│ Completed      │     │ Milestone      │     │ Review         │
└────────────────┘     └────────────────┘     └────────────────┘
```

1. **Customer Booking**: Customer selects target services, inputs vehicle details (e.g. `WP CAC-4821`), selects an appointment date/time, and submits the booking.
2. **Reference Code Issuance**: A unique tracking reference (e.g. `GRX-2026-8941`) is automatically generated.
3. **Dispatch & Allocation**: Workshop manager assigns an available master technician (e.g., *Saman Kumara – Engine Specialist*) and schedules the bay slot.
4. **Live Telemetry Inspection**: Anyone with the reference code or vehicle plate number can track real-time progress via `/track-repair` without logging in.

---

## 📡 API Endpoints (Backend)

### 🔑 Authentication (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/auth/register/send-otp` | Validates data & dispatches 6-digit email OTP | None |
| `POST` | `/api/auth/register/verify-otp` | Verifies OTP & provisions customer account | None |
| `POST` | `/api/auth/login` | Authenticates user & issues JWT bearer token | None |
| `POST` | `/api/auth/forgot-password` | Requests password reset OTP code | None |
| `POST` | `/api/auth/verify-otp` | Validates password reset OTP code | None |
| `POST` | `/api/auth/reset-password` | Updates password with valid OTP code | None |
| `GET`  | `/api/auth/me` | Retrieves current authenticated profile | Bearer Token |

### 🔍 Repair Tracking & Telemetry (`/api/track-repair`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/track-repair/{referenceOrPlate}` | Looks up live repair status by booking code or license plate | None |
| `GET` | `/api/track-repair/active-feeds` | Returns active workshop repair feeds for the tracking console | None |

### 📅 Bookings & Dispatch (`/api/bookings`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST`   | `/api/bookings` | Creates a new vehicle service booking | Customer / Admin |
| `GET`    | `/api/bookings` | Returns paginated bookings with status filtering | Admin |
| `GET`    | `/api/bookings/my` | Returns all bookings for the logged-in customer | Customer |
| `GET`    | `/api/bookings/{id}` | Retrieves booking details by ID | Customer / Admin |
| `PATCH`  | `/api/bookings/{id}/status` | Updates repair status (`IN_PROGRESS`, `COMPLETED`, etc.) | Admin |
| `PATCH`  | `/api/bookings/{id}/assign` | Assigns or reassigns a certified mechanic | Admin |
| `DELETE` | `/api/bookings/{id}` | Cancels or removes a booking | Customer / Admin |

### 🛠️ Services Catalogue (`/api/services`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET`    | `/api/services` | Retrieves all active workshop services | None |
| `GET`    | `/api/services/{id}` | Retrieves service details by ID or slug | None |
| `POST`   | `/api/services` | Creates a new service offering | Admin |
| `PUT`    | `/api/services/{id}` | Updates existing service pricing & details | Admin |
| `DELETE` | `/api/services/{id}` | Toggles or deactivates service | Admin |

### 👨‍🔧 Mechanics & Technicians (`/api/mechanics`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET`    | `/api/mechanics` | Lists all mechanics, specialties & status | None |
| `GET`    | `/api/mechanics/{id}` | Retrieves mechanic profile & certifications | None |
| `POST`   | `/api/mechanics` | Adds a new technician to the workshop roster | Admin |
| `PUT`    | `/api/mechanics/{id}` | Updates technician details and status | Admin |
| `DELETE` | `/api/mechanics/{id}` | Removes a technician profile | Admin |

### 📊 Dashboard, Reports & Settings

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/dashboard/stats` | Retrieves real-time KPI metrics & bay occupancy | Admin |
| `GET` | `/api/reports/summary` | Generates workshop revenue & service analytics | Admin |
| `GET` | `/api/workshopsettings` | Retrieves current garage settings & operating hours | None |
| `PUT` | `/api/workshopsettings` | Updates garage hours, bay count & alert rules | Admin |
| `POST`| `/api/contact` | Submits public customer inquiry or feedback | None |

---

## 🔧 Development Tips

- **Interactive API Exploration**: Test endpoints directly via Swagger UI at `http://localhost:5203/swagger`.
- **Environment Auto-Sync**: The frontend runs `scripts/set-env.js` automatically before builds to inject `.env` configurations into `src/environments/environment.ts`.
- **Automatic Database Resiliency**: The backend initializer automatically verifies schema tables and indices on boot (`EnsureCreatedAsync` + raw DDL fallback), preventing migration lockouts.
- **JWT Expiration Handling**: Angular's HTTP interceptor monitors `401 Unauthorized` responses and cleans up invalid sessions automatically.

---

## 🤝 Contributing

1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/amazing-feature`).
3. Commit your changes (`git commit -m 'feat: Add amazing feature'`).
4. Push to the branch (`git push origin feature/amazing-feature`).
5. Open a Pull Request.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 👤 Author

**Name:** Puvanakopis  
**GitHub:** [@puvanakopis](https://github.com/puvanakopis)  
**LinkedIn:** [Puvanakopis](https://www.linkedin.com/in/puvanakopis/)  
**Email:** puvanakopis@gmail.com

---

Keep your vehicle running smoothly with Garagix! 🚗💨
