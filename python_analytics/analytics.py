import pandas as pd
import requests
from datetime import datetime

JAVA_API_BASE = "http://localhost:8081/api"

def get_student_data(student_id):
    """Fetch tasks and attendance from Spring Boot API."""
    print(f">>> Analytics: Fetching data for student_id: {student_id}")
    headers = {
        "X-User-Role": "ADMIN",
        "X-User-Id": "1"  # Admin ID
    }
    try:
        tasks_url = f"{JAVA_API_BASE}/tasks/student/{student_id}"
        # Attendance endpoint moved to root /attendance as per strict requirement
        attendance_url = f"http://localhost:8081/attendance/student/{student_id}"
        
        print(f">>> Analytics: Calling Tasks API: {tasks_url}")
        tasks_res = requests.get(tasks_url, headers=headers)
        
        print(f">>> Analytics: Calling Attendance API: {attendance_url}")
        attendance_res = requests.get(attendance_url, headers=headers)
        
        print(f">>> Analytics: Tasks Status: {tasks_res.status_code}")
        print(f">>> Analytics: Attendance Status: {attendance_res.status_code}")
        
        tasks = tasks_res.json() if tasks_res.status_code == 200 else []
        attendance = attendance_res.json() if attendance_res.status_code == 200 else []
        
        print(f">>> Analytics: SUCCESS - Fetched {len(tasks)} tasks and {len(attendance)} attendance records for student {student_id}")
        return tasks, attendance
    except Exception as e:
        print(f">>> Analytics: ERROR fetching data for student {student_id}: {e}")
        return [], []

def calculate_productivity_score(tasks, attendance):
    """Compute weighted productivity score using the 60/40 rule."""
    print(f">>> Analytics: Processing {len(tasks)} tasks and {len(attendance)} attendance records")
    
    # Task completion rate (0-100)
    task_completion_rate = 0.0
    if tasks:
        completed = len([t for t in tasks if str(t.get('status', '')).upper() in ['COMPLETED', 'FINISHED']])
        task_completion_rate = (completed / len(tasks)) * 100
        
    # Average attendance (0-100)
    avg_attendance = 0.0
    if attendance:
        percentages = []
        for a in attendance:
            # Try 'attendance' field first (matches DB column name and new JSON property)
            val = a.get('attendance')
            if val is None:
                val = a.get('attendancePercentage') # Fallback to camelCase if needed
            
            if val is not None:
                percentages.append(float(val))
            else:
                # Fallback to legacy status field (PRESENT/ABSENT)
                status = str(a.get('status', '')).upper()
                if status == 'PRESENT':
                    percentages.append(100.0)
                elif status == 'ABSENT':
                    percentages.append(0.0)
                else:
                    percentages.append(0.0)
        
        if percentages:
            avg_attendance = sum(percentages) / len(percentages)
        
    # Weights: 60% Tasks, 40% Attendance
    # formula: (0.6 * task_completion_rate) + (0.4 * avg_attendance)
    score = (0.6 * task_completion_rate) + (0.4 * avg_attendance)
    
    print(f">>> Analytics: Task Rate: {task_completion_rate:.2f}%, Avg Attendance: {avg_attendance:.2f}% => Productivity Score: {score:.2f}")
    return round(score, 2), round(task_completion_rate, 2), round(avg_attendance, 2)

def get_weekly_trends(tasks):
    """Calculate weekly completed tasks trend using pandas."""
    if not tasks:
        return {}
    
    try:
        df = pd.DataFrame(tasks)
        if 'status' not in df.columns or 'completedAt' not in df.columns:
            print(">>> Analytics: Missing required columns for trends")
            return {}
            
        # Filter only completed tasks with a valid completedAt date
        df = df[(df['status'].str.upper().isin(['COMPLETED', 'FINISHED'])) & (df['completedAt'].notnull())]
        
        if df.empty:
            return {}
        
        # Convert to datetime
        df['completedAt'] = pd.to_datetime(df['completedAt'])
        
        # Group by week
        df['week'] = df['completedAt'].dt.strftime('%Y-W%U')
        
        trend = df.groupby('week').size().to_dict()
        # Sort by week key
        sorted_trend = dict(sorted(trend.items()))
        
        return sorted_trend
    except Exception as e:
        print(f">>> Analytics: Error in weekly trends: {e}")
        return {}

def categorize_student(score):
    """Categorize student based on score."""
    if score > 0.75:
        return "High Performer"
    elif score >= 0.5:
        return "Average"
    else:
        return "At Risk"
