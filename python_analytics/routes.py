from flask import Blueprint, jsonify
from analytics import get_student_data, calculate_productivity_score, get_weekly_trends, categorize_student, JAVA_API_BASE
from ml_service import predict_risk
import requests

analytics_bp = Blueprint('analytics', __name__)

@analytics_bp.route('/productivity/<int:student_id>', methods=['GET'])
def get_productivity(student_id):
    print(f">>> Analytics: Fetching productivity for student_id: {student_id}")
    tasks, attendance = get_student_data(student_id)
    
    score, task_rate, avg_att = calculate_productivity_score(tasks, attendance)
    
    # Categorize based on 0-100 score
    if score > 75:
        category = "High Performer"
    elif score >= 50:
        category = "Average"
    else:
        category = "At Risk"
    
    risk = predict_risk(task_rate / 100, avg_att / 100) # ML model expects 0-1
    
    print(f">>> Analytics: Data processed for student {student_id}. Score: {score}")
    return jsonify({
        "student_id": student_id,
        "attendance": avg_att,
        "task_completion_rate": task_rate,
        "productivity_score": score,
        "category": category,
        "is_at_risk": bool(risk)
    })

@analytics_bp.route('/trends/<int:student_id>', methods=['GET'])
def get_trends(student_id):
    print(f">>> Analytics: Fetching trends for student_id: {student_id}")
    tasks, _ = get_student_data(student_id)
    trends = get_weekly_trends(tasks)
    
    if not trends:
        print(f">>> Analytics: No trend data for student {student_id}. Returning empty set.")
        return jsonify({
            "student_id": student_id,
            "weekly_trends": {},
            "message": "No trends available"
        })

    return jsonify({
        "student_id": student_id,
        "weekly_trends": trends
    })

@analytics_bp.route('/admin', methods=['GET'])
def get_admin_report():
    print(">>> Analytics: Generating admin report...")
    try:
        # Fetch all students from Spring Boot
        res = requests.get(f"{JAVA_API_BASE}/students")
        if res.status_code != 200:
            print(f">>> Analytics: ERROR - Failed to fetch students from {JAVA_API_BASE}/students")
            return jsonify({"error": "Failed to fetch students"}), 500
        
        students = res.json()
        report = []
        
        for s in students:
            # Only analyze students, not admins
            if s.get('role') == 'STUDENT':
                tasks, attendance = get_student_data(s['id'])
                score, task_rate, avg_att = calculate_productivity_score(tasks, attendance)
                
                if score > 75:
                    category = "High Performer"
                elif score >= 50:
                    category = "Average"
                else:
                    category = "At Risk"
                    
                risk = predict_risk(task_rate / 100, avg_att / 100)
                
                report.append({
                    "id": s['id'],
                    "name": s['name'],
                    "score": score,
                    "attendance": avg_att,
                    "task_rate": task_rate,
                    "category": category,
                    "is_at_risk": bool(risk)
                })
        
        print(f">>> Analytics: Admin report generated with {len(report)} students.")
        return jsonify(report)
    except Exception as e:
        print(f">>> Analytics: EXCEPTION in admin report: {e}")
        return jsonify({"error": str(e)}), 500
