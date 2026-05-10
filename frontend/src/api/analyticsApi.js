import axios from 'axios';

const ANALYTICS_API_BASE = 'http://localhost:5000/analytics';

export const getProductivity = async (studentId) => {
    const response = await axios.get(`${ANALYTICS_API_BASE}/productivity/${studentId}`);
    return response.data;
};

export const getTrends = async (studentId) => {
    const response = await axios.get(`${ANALYTICS_API_BASE}/trends/${studentId}`);
    return response.data;
};

export const getAdminReport = async () => {
    const response = await axios.get(`${ANALYTICS_API_BASE}/admin`);
    return response.data;
};

export const getAttendance = async (studentId) => {
    console.log(">>> Frontend: Fetching attendance for student_id:", studentId);
    const response = await axios.get('http://localhost:8081/attendance/student/' + studentId);
    console.log(">>> Frontend: Attendance API Response:", response.data);
    return response.data;
};
