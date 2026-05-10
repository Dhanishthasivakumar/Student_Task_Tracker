# Student_Task_Tracker
# Student Tracker Portal

A playful, modern, editorial-style student productivity and management platform. This project combines a robust Java backend with an aesthetic Pinterest-inspired frontend and a Python-powered machine learning analytics service.

## Project Overview

The **Student Tracker Portal** is designed to provide a visually stunning and highly functional environment for students to manage their tasks and for administrators to monitor performance. 

###  Design Aesthetic
The application features a **"Modern Scrapbook"** aesthetic:
- **Playful Editorial UI**: Soft pastel color palette (Pink, Sage, Cream).
- **Interactive Elements**: Floating decorative stickers, smooth transitions, and grid-paper backgrounds.
- **Bento Layouts**: Clean, card-based dashboards inspired by modern creative startups.

---

## Tech Stack

### Frontend
- **Framework**: React.js (Vite)
- **Styling**: Vanilla CSS with custom design tokens.
- **Charts**: Recharts for data visualization.
- **Icons**: Emoji-based stickers and custom SVG accents.

### Backend (Core)
- **Language**: Java 17
- **Framework**: Spring Boot
- **Build Tool**: Maven
- **Database**: H2 (Development) / MySQL (Production ready)
- **Features**: RESTful APIs, Task CRUD, User Authentication.

### Analytics (ML Service)
- **Language**: Python 3.x
- **Framework**: Flask
- **Machine Learning**: Scikit-learn (Logistic Regression for Risk Prediction)
- **Data Handling**: Pandas, Numpy.

---

##  Key Features

- **Dashboard Overview**: Bento-style widgets showing total, pending, and completed tasks.
- **Task Management**: CRUD operations for tasks with priority badges and status tracking.
- **Advanced Analytics**:
    - **Productivity Scoring**: Algorithmic calculation of student engagement.
    - **ML Risk Prediction**: AI-driven detection of students who might be falling behind.
    - **Weekly Trends**: Visual tracking of task completion over time.
- **Role-Based Access**: Specialized views for Administrators and Students.

---

## Installation & Setup

### 1. Prerequisites
- **Java JDK 17+**
- **Node.js & npm**
- **Python 3.8+**
- **Maven**

### 2. Run the Backend (Spring Boot)
```bash
cd backend
mvn spring-boot:run
```
*Runs on: `http://localhost:8080`*

### 3. Run the Analytics Service (Python)
```bash
cd python_analytics
pip install -r requirements.txt
python app.py
```
*Runs on: `http://localhost:5000`*

### 4. Run the Frontend (React)
```bash
cd frontend
npm install
npm run dev
```
*Runs on: `http://localhost:5173`*

---

## Project Structure

```text
├── backend/            # Java Spring Boot source code
├── frontend/           # React frontend source code
│   ├── src/
│   │   ├── components/ # Redesigned aesthetic components
│   │   ├── api/        # API integration logic
│   │   └── App.css     # Global layout & sticker animations
├── python_analytics/   # ML service & Flask API
└── README.md
```



---

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
