import axios, {AxiosError} from "axios";
type UserStats = {
  name: string;
  streak: number;
  longestStreak: number;
  xp: number;
};

const api = axios.create({
  baseURL: "http://localhost:3000/api", // Adjust this to your backend URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    } else if (!window.location.pathname.includes("/login")) {
      // If no token and we're not on login page, redirect to login
      window.location.href = "/login";
      throw new Error("No auth token");
    }
    return config;
  },
  (error: AxiosError): Promise<never> => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError): Promise<never> => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const login = async (
  username: string,
  password: string
): Promise<{token: string}> => {
  const response = await api.post<{token: string}>("/auth/login", {
    username,
    password,
  });
  localStorage.setItem("token", response.data.token);
  return response.data;
};

export const getUserStats = async (): Promise<UserStats> => {
  const response = await api.get<UserStats>("/user/stats");
  return response.data;
};

export default api;
