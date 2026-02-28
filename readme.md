# 🏥 MediFlow

### A Modular, Production-Ready Backend System for Healthcare Platforms

<p align="center">
  <strong>Structured • Secure • Scalable • Maintainable</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-18+-green" />
  <img src="https://img.shields.io/badge/TypeScript-Strict-blue" />
  <img src="https://img.shields.io/badge/Prisma-ORM-black" />
  <img src="https://img.shields.io/badge/PostgreSQL-Relational-blue" />
  <img src="https://img.shields.io/badge/Architecture-Modular-orange" />
</p>

---

## 🎯 Why MediFlow Exists

Healthcare systems often operate across fragmented tools for scheduling, billing, prescriptions, and user management.

MediFlow was engineered to unify these workflows into a single backend platform with:

- Clear domain boundaries
- Strict role-based access control
- Consistent API response standards
- Transaction-aware booking confirmation
- Production-oriented architectural patterns

This project prioritizes engineering discipline, maintainability, and system clarity over rapid feature accumulation.

---

# 🧠 Architecture Overview

MediFlow follows a **Modular MVC Architecture** with strong separation of concerns.

```
Client
  ↓
Route Layer
  ↓
Validation Middleware (Zod)
  ↓
Authentication & RBAC Guard
  ↓
Controller Layer
  ↓
Service Layer (Business Logic)
  ↓
Prisma ORM
  ↓
PostgreSQL
```

### Design Principles

- Thin controllers, isolated service logic
- Centralized error normalization
- Enum-driven state transitions
- Soft delete strategy for auditability
- Environment-based configuration
- Webhook verification before state mutation
- Explicit validation before execution

The structure supports long-term maintainability and horizontal scalability.

---

# 🧩 Key Engineering Decisions

- Selected Prisma for type-safe database interaction and controlled migrations
- Used enum-driven status management to eliminate magic strings
- Separated business logic from controllers to improve scalability
- Implemented centralized error handling for consistent API behavior
- Designed booking confirmation around verified Stripe webhook events
- Structured modules by business domain to reduce cross-domain coupling

Each decision prioritizes clarity, maintainability, and production-readiness.

---

# 🏗️ Core Capabilities

MediFlow manages the complete appointment lifecycle:

- Doctor onboarding & verification
- Dynamic availability scheduling
- Secure appointment booking
- Stripe-based payment confirmation
- Automated invoice generation
- Prescription issuance
- Verified patient reviews

Each domain is implemented as an isolated module to reduce cross-domain coupling and improve long-term maintainability.

---

# 👥 Role-Based Access Model

| Capability            | Super Admin | Admin | Doctor | Patient |
| --------------------- | ----------- | ----- | ------ | ------- |
| Manage Users          | ✅          | ✅    | ❌     | ❌      |
| Verify Doctors        | ❌          | ✅    | ❌     | ❌      |
| View Platform Metrics | ✅          | ✅    | ❌     | ❌      |
| Manage Schedules      | ❌          | ❌    | ✅     | ❌      |
| Book Appointment      | ❌          | ❌    | ❌     | ✅      |
| Generate Prescription | ❌          | ❌    | ✅     | ❌      |
| Submit Review         | ❌          | ❌    | ❌     | ✅      |

Access enforcement is handled at middleware level via role guards, with consistent authorization checks at route boundaries.

---

# 🔄 Appointment Lifecycle

```
Patient → Browse Doctors
        → View Available Slots
        → Select Time Slot
        → Create Stripe Payment Intent
        → Stripe Webhook Verification
        → Appointment Status Updated
        → Invoice Email Generated
        → Appointment Completed
        → Doctor Issues Prescription
        → Patient Submits Review
```

Booking confirmation occurs only after successful Stripe webhook verification to ensure payment integrity.

---

# ⚙️ Technology Stack

## Backend Runtime

- Node.js
- Express.js
- TypeScript

## Database

- PostgreSQL
- Prisma ORM

## Authentication & Security

- JWT (Access + Refresh Strategy)
- better-auth
- bcrypt password hashing
- Role-Based Access Control
- HTTP-only cookies

## Validation

- Zod schema validation
- Centralized error normalization

## Payments

- Stripe Payment Intents
- Webhook signature verification

## File Handling

- Multer
- Cloudinary

## Communication

- Nodemailer
- EJS Templates
- PDFKit for document generation

## Automation

- node-cron for background workflows

---

# 🔐 Security Considerations

Security is enforced across layers:

- Password hashing using bcrypt
- Access & refresh token rotation
- Strict payload validation
- Stripe webhook signature verification
- Consistent authorization checks at route-level boundaries
- Sanitized error responses
- Soft delete support for sensitive entities
- Environment-based secret management

Internal database errors are never exposed to API consumers.

---

# 🗄️ Database Strategy

- Fully relational schema design
- Enum-driven status management
- Indexed foreign key relations
- Audit fields (`createdAt`, `updatedAt`)
- Soft delete fields (`isDeleted`, `deletedAt`)
- Unique constraints for integrity enforcement
- Transaction-aware booking logic

Consistency is enforced at both schema and service levels.

---

# ⚡ Performance & Scalability Considerations

- Selective Prisma field queries
- Indexed relational lookups
- Lean response payloads
- Background cron processing
- Stateless authentication model
- Horizontal scaling compatibility through stateless API design

The architecture is structured to support future integration of:

- Redis caching
- Microservice extraction (appointments/payment domains)
- Distributed scaling strategies

---

# 📦 API Response Standard

### Success

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Operation successful",
  "data": {}
}
```

### Error

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation failed",
  "errors": []
}
```

Consistent response formatting ensures frontend predictability.

---

# 📁 Project Structure

```
src/
 ├── app.ts
 ├── server.ts
 ├── app/
 │   ├── config/
 │   ├── errorHelpers/
 │   ├── interfaces/
 │   ├── middleware/
 │   ├── module/
 │   │   ├── auth/
 │   │   ├── admin/
 │   │   ├── doctor/
 │   │   ├── patient/
 │   │   ├── appointment/
 │   │   ├── payment/
 │   │   ├── prescription/
 │   │   └── review/
 │   ├── routes/
 │   ├── shared/
 │   └── utils/
```

Modules are structured by business domain to maintain isolation and scalability.

---

# 🔑 Environment Configuration

```
DATABASE_URL=
JWT_SECRET=
JWT_REFRESH_SECRET=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
EMAIL_HOST=
EMAIL_PORT=
EMAIL_USER=
EMAIL_PASS=
```

---

# 🚀 Local Development Setup

### Clone Repository

```bash
git clone https://github.com/ArnabSaga/MediFlow-Backend.git
cd MediFlow
```

### Install Dependencies

```bash
pnpm install
```

### Prisma Setup

```bash
pnpm run generate
pnpm run push
```

### Run Development Server

```bash
pnpm run dev
```

---

# 🧪 Testing Strategy (Planned)

- Unit testing via Jest
- Integration testing with Supertest
- Webhook simulation tests
- Role-based access validation tests

---

# 📈 Roadmap

- WebRTC-based video consultations
- Real-time notifications (Socket.io)
- Redis caching layer
- Audit logging system
- Next.js frontend dashboard
- Analytics and reporting engine

---

# 👨‍💻 Author

**ArnabSaga**
Backend Engineer

GitHub: [ArnabSaga](https://github.com/ArnabSaga/MediFlow)

---

<p align="center">
Engineered with structure. Built for scale. Designed for clarity.
</p>
