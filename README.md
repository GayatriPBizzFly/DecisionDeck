# DecisionDeck

> **Make complicated decisions clearer.**

DecisionDeck is a full-stack decision-making web application that helps users organize decisions, compare available options, evaluate them using weighted criteria, and track the progress of their decisions in one place.

## 🔗 Repository

**GitHub:** https://github.com/GayatriPBizzFly/DecisionDeck.git

---

## 📌 About the Project

DecisionDeck is designed to simplify situations where users need to choose between multiple options.

Instead of making decisions only through simple comparison, users can:

* Create and manage decisions
* Add multiple options
* Define evaluation criteria
* Assign weights to criteria
* Give scores from 1–10
* Generate a scoring table
* Track decision status and priority
* Pin important decisions
* View recent decisions
* Manage their account and password
* Switch between Light and Dark themes

The application uses a React frontend, Node.js/Express backend, and MongoDB database.

---

## ✨ Features

### 🔐 Authentication

* User Sign Up
* User Sign In
* JWT-based authentication
* Protected backend routes
* Password hashing using bcrypt
* Google OAuth Sign In
* Logout functionality

### 🔑 Forgot & Reset Password

* Forgot Password functionality
* Email-based password reset
* SMTP integration
* Nodemailer for sending reset emails
* Secure password reset token flow
* Password hashing before storing the new password

### 🧠 Decision Management

Users can create and manage their decisions with:

* Decision title
* Description
* Status
* Priority
* Multiple options
* Multiple evaluation criteria

Supported decision statuses include:

* Pending
* In Progress
* Completed

---

## 📊 Decision Scoring

DecisionDeck provides a weighted scoring system for comparing options.

Users can:

1. Add evaluation criteria.
2. Assign a weight to each criterion.
3. Add scores between **1 and 10** for each option.
4. Generate a scoring table.
5. Compare options using weighted scores.

The total criterion weight is validated to ensure that the scoring calculation is properly configured.

### Example

Suppose a user wants to choose a laptop.

| Criteria    |  Weight |
| ----------- | ------: |
| Price       |      30 |
| Performance |      40 |
| Battery     |      20 |
| Design      |      10 |
| **Total**   | **100** |

The user can then score each laptop from 1–10 against these criteria.

---

## 📌 Pin / Unpin Decisions

Users can pin important decisions for quick access.

Pinned decisions are displayed separately from regular decisions, making frequently accessed decisions easier to find.

Users can:

* Pin a decision
* Unpin a decision
* View pinned decisions separately
* Maintain their own decision list

---

## 🕒 Recent Decisions

The dashboard displays the user's most recent decisions.

The application currently shows the **latest 3 decisions** in the recent-decision section.

Users can access the complete list through **All My Decisions**.

---

## 📈 Dashboard

The Dashboard provides an overview of the user's decisions.

It includes:

* Total Decisions
* Pending Decisions
* In Progress Decisions
* Completed Decisions
* Recent Decisions
* Pinned Decisions
* My Decisions
* Subscription Plan
* Settings
* Logout

---

## 🌓 Light & Dark Theme

DecisionDeck supports both:

* Light Mode
* Dark Mode

The theme is managed using React Context through `ThemeContext`.

The selected theme is stored in `localStorage`, allowing the user's preference to remain available after refreshing the application.

---

## 👤 Profile & Settings

Users can manage their account information from Settings.

Available functionality includes:

* Update name
* View email
* Change password
* Manage account information

---

## 🔑 Google OAuth

DecisionDeck supports Google Sign In using Google OAuth.

### Authentication Flow

```text
User
  ↓
Google Sign In
  ↓
Google Authentication
  ↓
Google Credential
  ↓
React Frontend
  ↓
Express Backend
  ↓
Google Credential Verification
  ↓
Create / Find User
  ↓
Generate JWT
  ↓
Store Authentication Token
  ↓
Dashboard
```

The Google Client ID is configured through environment variables rather than being hardcoded into the application.

---

## 📧 SMTP & Password Reset Flow

The application uses SMTP with Nodemailer to send password reset emails.

```text
User clicks "Forgot Password"
        ↓
Enters registered email
        ↓
Backend verifies email
        ↓
Reset token generated
        ↓
Reset link created
        ↓
Nodemailer sends email
        ↓
User opens reset link
        ↓
Creates new password
        ↓
Password is hashed using bcrypt
        ↓
Password updated in MongoDB
```

---

# 🛠️ Tech Stack

## Frontend

* React.js
* Vite
* React Router
* JavaScript
* CSS
* Context API
* Fetch API

## Backend

* Node.js
* Express.js
* REST API
* JWT
* bcrypt
* Nodemailer
* Google OAuth

## Database

* MongoDB
* MongoDB Atlas
* Mongoose

## Development Tools

* Visual Studio Code
* Git
* GitHub
* REST Client

---

# 📦 Important Dependencies

### Frontend

```bash
npm install react react-dom react-router-dom
```

### Backend

```bash
npm install express mongoose bcryptjs jsonwebtoken dotenv cors
```

Google OAuth:

```bash
npm install google-auth-library
```

Email functionality:

```bash
npm install nodemailer
```

Development:

```bash
npm install --save-dev nodemon
```

---

# 📁 Project Structure

```text
DecisionDeck/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── css/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── .env
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── config/
│   ├── server.js
│   ├── .env
│   └── package.json
│
└── README.md
```

---

# ⚙️ Installation & Setup

## 1. Clone the Repository

```bash
git clone https://github.com/GayatriPBizzFly/DecisionDeck.git
```

Navigate into the project:

```bash
cd DecisionDeck
```

---

## 2. Install Frontend Dependencies

```bash
cd frontend
npm install
```

---

## 3. Install Backend Dependencies

Open another terminal:

```bash
cd backend
npm install
```

---

# 🔐 Environment Variables

Create a `.env` file inside the backend directory.

Example:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
SMTP_HOST=your_smtp_host
SMTP_PORT=your_smtp_port
SMTP_USER=your_email
SMTP_PASS=your_email_password_or_app_password
```

For the frontend, create:

```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

> Do not commit `.env` files or secret credentials to GitHub.

---

# ▶️ Running the Application

## Start Backend

Inside the `backend` folder:

```bash
npm run dev
```

Backend runs on:

```text
http://localhost:5000
```

## Start Frontend

Inside the `frontend` folder:

```bash
npm run dev
```

Vite will provide the local frontend URL, typically:

```text
http://localhost:5173
```

---

# 🔄 Application Workflow

```text
                ┌───────────────┐
                │     User      │
                └───────┬───────┘
                        │
                        ▼
                ┌───────────────┐
                │ React Frontend│
                └───────┬───────┘
                        │
                  REST API Calls
                        │
                        ▼
                ┌───────────────┐
                │ Express Server│
                └───────┬───────┘
                        │
             ┌──────────┴──────────┐
             ▼                     ▼
      Authentication          Decision APIs
             │                     │
             └──────────┬──────────┘
                        ▼
                ┌───────────────┐
                │    MongoDB    │
                └───────────────┘
```

---

# 🔒 Security

DecisionDeck implements several security-related practices:

* JWT authentication
* Protected API routes
* Password hashing using bcrypt
* Environment variables for sensitive configuration
* User-specific decision filtering
* Google credential verification
* Authentication middleware
* Secure password reset flow

Each user's decisions are associated with their user ID so that authenticated users access only their own decision records.

---

# 🧪 Testing

The backend REST APIs can be tested using tools such as the VS Code REST Client extension.

Important API areas include:

### Authentication

```text
POST /api/auth/signup
POST /api/auth/signin
POST /api/auth/google
POST /api/auth/forgot-password
POST /api/auth/reset-password/:token
PUT  /api/auth/update-profile
```

### Decisions

```text
GET    /api/decisions
POST   /api/decisions
PUT    /api/decisions/:id
DELETE /api/decisions/:id
PATCH  /api/decisions/:id/pin
```

Protected endpoints require a valid JWT token.

---

# 🚀 Future Enhancements

Possible future improvements include:

* AI-powered decision suggestions
* Automatic criteria recommendations
* Advanced decision analytics
* Decision history
* Charts and visual comparisons
* Export decisions as PDF
* Subscription-based premium features
* Google account profile integration
* Improved scoring visualization
* Mobile-responsive improvements

---

# 🎯 Project Objective

The main objective of DecisionDeck is to provide a structured approach to everyday decision-making by combining:

**Decision Organization + Criteria Evaluation + Weighted Scoring + Progress Tracking**

into a single web application.

---

# 👩‍💻 Developer

**Gayatri Pardeshi**

GitHub:
https://github.com/GayatriPBizzFly

---

## 📄 License

This project is currently developed as a learning and portfolio project.
