# DMT App

This project consists of three main components:

1.  **Backend**: A FastAPI server managing the database and API endpoints.
2.  **Frontend**: A React/Vite application for students.
3.  **Dashboard**: A Streamlit application for teachers/admins.

## Prerequisites

-   Python 3.9+
-   Node.js 18+

## Quick Start

### 1. Backend (API)

The backend must be running for the Frontend and Dashboard to work.

```bash
cd backend
# Create virtual environment (optional but recommended)
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the server
uvicorn app.main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`.
Docs: `http://localhost:8000/docs`.

### 2. Frontend (Student App)

```bash
cd frontend
npm install
npm run dev
```

The app will typically run at `http://localhost:5173`.

### 3. Dashboard (Teacher App)

```bash
# In the root directory (or ensure you are in the same venv as backend if using same libs)
# Ideally, install dashboard requirements if they differ, but they are likely shared or in backend/requirements.txt
pip install streamlit plotly pandas

# Run the dashboard
streamlit run dashboard/app.py
```

The dashboard will open in your browser (usually `http://localhost:8501`).

## Portable Frontend

There is a standalone version in `frontend_portable/index.html`. You can open this file directly in a web browser, but it requires a live backend URL (currently hardcoded to a tunnel address which may be offline).
