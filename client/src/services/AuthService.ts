import AxiosInstance from "./AxiosInstance";

interface LoginPayload {
  username: string;
  password: string;
}

const AuthService = {
  login: async (payload: LoginPayload) => AxiosInstance.post("/auth/login", payload),
  me: async () => AxiosInstance.get("/auth/me"),
  logout: async () => AxiosInstance.post("/auth/logout"),
};

export default AuthService;
