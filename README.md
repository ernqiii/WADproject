# WADproject
WAD1 Y2025/2026 Group 6 — Apartment Rental Platform

## Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 LTS recommended)
- A MongoDB Atlas account with your connection string

### 1. Clone the repository
```bash
git clone <repo-url>
cd WADproject
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `config.env` file in the root directory with the following:
```
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority
SECRET=<any long random string for session signing>
PORT=8000
```

### 4. (Optional) Seed the database
```bash
npm run seed
```

## Running the Application
```bash
npm start
```

The app will be available at [http://localhost:8000](http://localhost:8000).

## Troubleshooting

**MongoDB SSL/TLS error on startup?**
This is usually a Node.js version issue. Use Node.js v16 LTS, or start with:
```bash
NODE_OPTIONS=--openssl-legacy-provider npm start
```
