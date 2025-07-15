# Filo

A modern, full-stack web app for managing personal data and files, with authentication and cloud storage. Built with React (Vite), Node.js/Express, and MongoDB Atlas.

---

## ✨ Features
- User registration and login (JWT-based)
- Secure session (sessionStorage, auto-logout on close)
- Add, view, update, and delete personal data
- File uploads (images, docs, etc.)
- Beautiful pixel-art inspired UI
- Responsive and mobile-friendly
- Dark mode with enhanced visuals
- Cloud-hosted: **Frontend on Vercel, Backend on Render, DB on MongoDB Atlas**

---

## 🛠️ Tech Stack
- **Frontend:** React (Vite), CSS
- **Backend:** Node.js, Express
- **Database:** MongoDB Atlas
- **Auth:** JWT, bcrypt
- **File Uploads:** Multer
- **Deployment:** Vercel (frontend), Render (backend)

---

## 🚀 Getting Started (Local Development)

### 1. Clone the Repo
```bash
git clone https://github.com/SHUBHAM2775/Filo.git
cd Filo
```

### 2. Setup Backend
```bash
cd backend
npm install
```
- Create a `.env` file in `backend/`:
  ```env
  MONGODB_URI=your_mongodb_atlas_uri
  JWT_SECRET=your_jwt_secret
  CORS_ORIGIN=http://localhost:5173
  ```
- Start the backend:
  ```bash
  npm start
  # Runs on http://localhost:5000
  ```

### 3. Setup Frontend
```bash
cd ../
npm install
```
- Create a `.env` file in the root or `src/`:
  ```env
  VITE_API_URL=http://localhost:5000
  ```
- Start the frontend:
  ```bash
  npm run dev
  # Runs on http://localhost:5173
  ```

---

## 🌐 Deployment

### Backend (Render)
- Push your code to GitHub.
- Create a new Web Service on [Render](https://render.com/):
  - Root directory: `backend/`
  - Build command: `npm install`
  - Start command: `npm start`
  - Region: Singapore (for India)
  - Set environment variables as above

### Frontend (Vercel)
- Import your repo on [Vercel](https://vercel.com/)
- Set environment variable:
  - `VITE_API_URL=https://your-backend.onrender.com`
- Deploy!

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)
- `MONGODB_URI` — MongoDB Atlas connection string
- `JWT_SECRET` — Secret for JWT auth
- `CORS_ORIGIN` — Frontend URL (for CORS)

### Frontend (`.env`)
- `VITE_API_URL` — Backend API base URL

---

## 📱 Usage Notes
- **Session-based login:** You must log in each session (auto-logout on browser close)
- **File uploads:** Supported for images, PDFs, docs, etc.
- **Mobile-friendly:** Works on all screen sizes
- **Dark mode:** Toggle for a beautiful night look

---

## 🤝 Contributing
Pull requests welcome! For major changes, open an issue first to discuss what you’d like to change.

---

## 📄 License
MIT
