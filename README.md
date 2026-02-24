# Farmer Assistant Web Platform

A comprehensive web platform designed to empower farmers with digital tools for crop management, analytics, and community connection. This system provides a robust solution for modernizing agricultural practices, specifically tailored for the Egyptian market with bilingual support (Arabic/English).

## 🚀 Features

### 🌱 Farm & Crop Management
- **Dashboard:** Real-time overview of farm activities, stock alerts, and weather insights.
- **Crop Tracking:** Manage inventory, planting dates, and harvest schedules.
- **Stock Monitoring:** Visual indicators for low and critical stock levels.

### 🗺️ Exploration & Community
- **Interactive Map:** Explore farms across different governorates in Egypt (Delta, Cairo, Upper Egypt, etc.).
- **Marketplace Integration:** Connect with local markets and buyers (simulated).

### 🤖 AI-Powered Assistant
- **Smart Chat:** 24/7 AI assistant to answer farming queries, platform usage questions, and provide recommendations.
- **Localized Support:** Communicates effectively in both Arabic and English.

### 💼 Subscription System
- **Tiered Plans:** Basic, Pro, and Premium subscription models.
- **Billing Management:** Secure payment simulation, invoice history, and plan upgrades/downgrades.
- **Admin Analytics:** Revenue tracking, profit analysis per farmer, and subscription distribution.

### 👤 User & Profile
- **Secure Authentication:** robust login and registration system.
- **Profile Management:** Customizable user profiles with avatar support.
- **Role-Based Access:** Distinct features for Farmers and Administrators.

## 🛠️ Tech Stack

### Frontend
- **Framework:** [React](https://react.dev/) with [TypeScript](https://www.typescriptlang.org/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [Shadcn/ui](https://ui.shadcn.com/), [Radix UI](https://www.radix-ui.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Routing:** [React Router](https://reactrouter.com/)
- **Charts:** [Recharts](https://recharts.org/)

### Backend
- **Runtime:** [Node.js](https://nodejs.org/)
- **Framework:** [Express](https://expressjs.com/)
- **Database Driver:** [MySQL2](https://github.com/sidorares/node-mysql2)
- **Authentication:** JSON Web Tokens (JWT) & Bcrypt

### Database
- **System:** MySQL / Supabase (SQL)
- **Schema:** Relational schema for Users, Crops, Subscriptions, and Activities.

## 📂 Project Structure

```
├── src/                # Frontend source code
│   ├── components/     # Reusable UI components
│   ├── pages/          # Application pages (Dashboard, Home, etc.)
│   ├── styles/         # Global styles
│   └── utils/          # Helper functions and API clients
├── server/             # Backend source code
│   ├── db/             # Database schemas and seed scripts
│   ├── middleware/     # Express middleware (Auth, etc.)
│   └── routes/         # API endpoints
└── supabase/           # Database migrations (optional)
```

## 📄 Project Documents

For a detailed breakdown of the system analysis, business model, and presentation slides, please refer to the following:

- [Documentation of the Graduation Project](docs/last%20edit.docx)
- [Presentation of the Graduation Project](docs/Farmer%20Assistant%20System.pdf)

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MySQL Database

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/youssefahmedtalaat/farmer.git
   cd farmer
   ```

2. **Setup Frontend**
   ```bash
   npm install
   ```

3. **Setup Backend**
   ```bash
   cd server
   npm install
   ```

4. **Environment Configuration**
   - Create a `.env` file in the `server/` directory based on `.env.example`.
   - Configure your database credentials.

5. **Database Initialization**
   - Run the schema scripts located in `server/db/schema_mysql.sql` to set up your database tables.
   - Optionally run `npm run seed:admin` in the server directory to create an initial admin account.

### Running the Application

1. **Start the Backend Server**
   ```bash
   cd server
   npm run dev
   ```

2. **Start the Frontend Development Server**
   ```bash
   # In a new terminal, from the root directory
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:3000`.


## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
