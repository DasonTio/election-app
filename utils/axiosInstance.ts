import axios from "axios";

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api', // Default to localhost if not set
    headers: {
        'Content-Type': 'application/json',
    },
});

export default axiosInstance;
